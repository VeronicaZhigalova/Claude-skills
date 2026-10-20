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
        l,r=dw[y]; sl,sr=sw[sy]; l=max(0,l-3); r=min(dst_shape[1]-1,r+3)
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
for k,p in SRC.items():
    F=np.asarray(Image.open(p).convert('RGBA')); Fw=walls(F)
    rows=[y for y in range(900) if Fw[y] is not None]; top,bot=rows[0],rows[-1]
    lt,mb,ft=BANDS[k]
    e=rowmap(E,Ew,(36,785),F.shape,Fw,(top,bot+1))
    # milk only: the cleanest milk just above the fruit, stretched from the surface down to the fruit
    # milk only: clean milk with ice from the plain latte, fitted into this cup from the surface down to the fruit
    Pm=np.asarray(Image.open(SRC['plain']).convert('RGBA')); Pw=walls(Pm)
    m=rowmap(Pm,Pw,(560,770),F.shape,Fw,(lt-8,ft))
    m[ft:]=F[ft:]   # fruit below stays as it is
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
