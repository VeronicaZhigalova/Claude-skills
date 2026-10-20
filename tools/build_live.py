from PIL import Image, ImageFilter
import numpy as np, math, json
OUT='live/'
SRC={'strawberry':'../src/cup-strawberry.webp','blueberry':'../src/cup-blueberry.webp','banana':'../src/cup-banana.webp',
     'mango':'../src/cut-mango.png','plain':'../src/cut-plain.png'}
BANDS={'strawberry':(105,390,590),'blueberry':(100,480,560),'banana':(115,380,680),'mango':(90,380,600),'plain':(70,560,875)}
def walls(a):
    al=a[:,:,3]; rows=[]
    for y in range(a.shape[0]):
        c=np.where(al[y]>128)[0]; rows.append((c[0],c[-1]) if len(c)>20 else None)
    return rows
def rowmap(src, sw, srows, dst_shape, dw, drows):
    # copy rows srows[0..1] of src (walls sw) into rows drows of a new image (walls dw), stretching each row to the walls
    out=np.zeros(dst_shape,dtype=np.uint8); y0,y1=drows; s0,s1=srows
    for y in range(y0,y1):
        if dw[y] is None: continue
        sy=int(s0+(s1-s0)*(y-y0)/max(1,(y1-y0)))
        if sw[sy] is None: continue
        l,r=dw[y]; sl,sr=sw[sy]
        xs=np.linspace(sl,sr,r-l+1).astype(int); out[y,l:r+1,:3]=src[sy,xs,:3]; out[y,l:r+1,3]=255
    return out
# white Layo print, warped round the cup
logo=Image.open('../src/logo-white.png').convert('RGBA'); logo=logo.crop(logo.getbbox())
def print_on(im, cx, cy, cupw):
    W=int(cupw*.4); Hh=int(W*logo.height/logo.width)
    L=np.asarray(logo.resize((W*3,Hh*3),Image.LANCZOS)).astype(float); h,w,_=L.shape; R=cupw*3/2; o=np.zeros_like(L)
    for x in range(w):
        sx=int(w/2+R*math.sin((x-w/2)/R))
        if 0<=sx<w: o[:,sx]=np.maximum(o[:,sx],L[:,x])
    lg=Image.fromarray(o.astype('uint8')).resize((W,Hh),Image.LANCZOS); lg.putalpha(lg.split()[3].point(lambda v:int(v*.8)))
    im.alpha_composite(lg,(int(cx-W/2),int(cy-Hh/2)))
E=np.asarray(Image.open('../src/cut-empty.png').convert('RGBA')); Ew=walls(E)
meta={}
def clean(F):
    # trim background left inside the straight-wall cut-out: scan in from both sides while the pixel is still white backdrop,
    # smooth the found walls over rows, then round the bottom corners like a real cup
    F=F.copy(); a=F[:,:,:3].astype(float); L=a.mean(axis=2); S=a.max(axis=2)-a.min(axis=2); bgl=(L>226)&(S<14)
    Hh,Ww=L.shape; ls=np.full(Hh,-1.); rs=np.full(Hh,-1.)
    for y in range(Hh):
        c=np.where(F[y,:,3]>128)[0]
        if len(c)<20: continue
        l,r=c[0],c[-1]
        while l<r and bgl[y,l]: l+=1
        while r>l and bgl[y,r]: r-=1
        ls[y],rs[y]=l,r
    ok=np.where(ls>=0)[0]
    # where the cup really starts and ends: skip white backdrop rows above the rim and below the base
    pure=(L>239)&(S<4)   # the flat white studio backdrop, not the clear plastic
    def content(y):
        c=np.where(F[y,:,3]>128)[0]
        if len(c)<20: return 0
        return 1-pure[y,c[0]:c[-1]+1].mean()
    # last backdrop row near the top (a thin edge line can sit above the white band), first backdrop row near the bottom
    top_y=ok[0]
    for y in range(ok[0], min(ok[0]+70, ok[-1])):
        if content(y)<.25: top_y=y+1
    bot_y=ok[-1]
    def content_b(y):
        c=np.where(F[y,:,3]>128)[0]
        if len(c)<20: return 0
        return 1-bgl[y,c[0]:c[-1]+1].mean()
    for y in range(ok[-1], max(ok[-1]-60, top_y), -1):
        if content_b(y)<.6: bot_y=y-1
    ls[:top_y]=-1; rs[:top_y]=-1; ls[bot_y+1:]=-1; rs[bot_y+1:]=-1
    ok=np.where(ls>=0)[0]
    def smooth(v):
        o=v.copy()
        for y in ok: lo,hi=max(ok[0],y-12),min(ok[-1],y+12); o[y]=np.median(v[lo:hi+1][v[lo:hi+1]>=0])
        return o
    ls2,rs2=smooth(ls),smooth(rs)
    y0,y1=ok[0],ok[-1]; R=34
    al=np.zeros((Hh,Ww))
    for y in ok:
        l,r=ls2[y],rs2[y]
        if y>y1-R:   # rounded base
            k=(y-(y1-R))/R; inset=R*(1-np.sqrt(max(0,1-k*k))); l+=inset; r-=inset
        if y<y0+6:   # a small roll at the rim instead of a square corner
            k=(y0+6-y)/6; inset=6*(1-np.sqrt(max(0,1-k*k))); l+=inset; r-=inset
        xs=np.arange(Ww); al[y]=np.clip(np.minimum(xs-l+1.5, r-xs+1.5)/1.5,0,1)
    F[:,:,3]=(np.minimum(F[:,:,3]/255.,al)*255).astype(np.uint8)
    return F
REF=clean(np.asarray(Image.open(SRC['blueberry']).convert('RGBA'))); RW=walls(REF)
RR=[y for y in range(900) if RW[y] is not None]; RT,RB=RR[0],RR[-1]
def to_ref(F, k):
    # stretch a drink photo row by row into the reference cup, and move its layer marks with it
    if k=='blueberry': return F, BANDS[k]
    Fw=walls(F); rr=[y for y in range(900) if Fw[y] is not None]; t,b=rr[0],rr[-1]
    G=rowmap(F,Fw,(t,b+1),F.shape,RW,(RT,RB+1)); G[:,:,3]=np.where(G[:,:,3]>0,REF[:,:,3],0)
    f=lambda y:int(RT+(y-t)*(RB-RT)/(b-t)); return G, tuple(f(v) for v in BANDS[k])
for k,p in SRC.items():
    F,BK=to_ref(clean(np.asarray(Image.open(p).convert('RGBA'))),k); Fw=walls(F)
    rows=[y for y in range(900) if Fw[y] is not None]; top,bot=rows[0],rows[-1]
    lt,mb,ft=BK
    e=rowmap(E,Ew,(36,785),F.shape,Fw,(top,bot+1))
    # milk only: the cleanest milk just above the fruit, stretched from the surface down to the fruit
    # milk only: clean milk with ice from the plain latte, fitted into this cup from the surface down to the fruit
    Pm=np.asarray(Image.open(SRC['plain']).convert('RGBA')); Pw=walls(Pm)
    m=rowmap(Pm,Pw,(690,850),F.shape,Fw,(lt-8,ft))
    # milk only, made from this drink's own clean milk just above the fruit: mirrored upwards row by row,
    # so colour, light and the soft blush where milk meets fruit are all the photo's own
    if k!='plain':
        seam=max(mb+40, ft-90); hb=max(20, ft-12-seam)
        m=F.copy(); m[:,:,3]=0
        m[seam:]=F[seam:]
        # blueberry and mango have fruit in their milk; borrow banana's clean milk band, colour-matched
        S,Sw,s0,sh=F,Fw,seam,hb
        if k in ('blueberry','mango'):
            donor='strawberry' if k=='blueberry' else 'banana'
            S,DB=to_ref(clean(np.asarray(Image.open(SRC[donor]).convert('RGBA'))),donor); Sw=walls(S); s0=max(DB[1]+40,DB[2]-90); sh=max(20,DB[2]-12-s0)
        gain=np.ones(3)
        if S is not F:
            ref=F[seam:seam+30,:,:3][F[seam:seam+30,:,3]>200].reshape(-1,3).mean(axis=0); cur=S[s0:s0+sh,:,:3][S[s0:s0+sh,:,3]>200].reshape(-1,3).mean(axis=0); gain=ref/cur
        for y in range(lt-8, seam):
            d=seam-y; idx=(d-1)%(2*sh); sy=s0+(idx if idx<sh else 2*sh-1-idx)
            if Fw[y] is None or Sw[sy] is None: continue
            l,r=Fw[y]; sl,sr=Sw[sy]; xsrc=np.linspace(sl,sr,r-l+1).astype(int)
            m[y,l:r+1,:3]=np.clip(S[sy,xsrc,:3]*gain,0,255); m[y,l:r+1,3]=255
        if S is not F:   # soften the join with the drink's own milk
            xs=np.arange(F.shape[1])
            for y in range(seam, min(seam+30, ft)):
                w=((y-seam)/30.)
                m[y,:,:3]=(m[seam-1,:,:3]*(1-w)+F[y,:,:3]*w).astype(np.uint8)
    else:
        m[ft:]=F[ft:]
    m[:,:,3]=np.minimum(m[:,:,3],F[:,:,3]); e[:,:,3]=np.minimum(e[:,:,3],F[:,:,3])   # one silhouette for every stage
    imgs={'full':Image.fromarray(F.copy()),'milk':Image.fromarray(m),'empty':Image.fromarray(e)}
    # rim above the drink is the cup itself: copy it into milk and empty so the cup never changes
    for n in ('milk','empty'):
        a=np.asarray(imgs[n]).copy(); a[:lt-8]=np.where(a[:lt-8,:,3:4]>0,a[:lt-8],F[:lt-8]) if n=='milk' else a[:lt-8]; imgs[n]=Image.fromarray(a)
    cy=lt+ (mb-lt)*.42; l,r=Fw[int(cy)]
    for n,im in imgs.items():
        print_on(im,(l+r)/2,cy,r-l)
        im.save(f'{OUT}{k}-{n}.webp',quality=86,method=6)
    meta[k]={'top':top,'bot':bot,'liquid':lt,'matcha':mb,'fruit':ft}
json.dump(meta,open(OUT+'meta.json','w')); print(meta)
