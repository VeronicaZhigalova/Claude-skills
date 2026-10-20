from PIL import Image, ImageFilter, ImageDraw
import numpy as np, sys
def bgmodel(a):
    side=np.concatenate([a[:,:30],a[:,-30:]],axis=1).mean(axis=1); return side[:,None,:]
def cup_cut(path, out, thr=14):
    im=Image.open(path).convert('RGB'); a=np.asarray(im).astype(float); H,W,_=a.shape
    d=np.abs(a-bgmodel(a)).max(axis=2); strong=d>thr
    ys=[];xs=[]
    for y in range(H):
        c=np.where(strong[y])[0]
        if len(c)>40: xs.append((c[0],c[-1])); ys.append(y)
    ys=np.array(ys); xs=np.array(xs)
    br=np.where(np.diff(ys)>60)[0]; runs=np.split(np.arange(len(ys)),br+1); r=max(runs,key=len); ys=ys[r]; xs=xs[r]
    # robust walls: fit on the middle 80% of rows
    n=len(ys); sl=slice(int(n*.1),int(n*.9))
    pl=np.polyfit(ys[sl],xs[sl,0],1); pr=np.polyfit(ys[sl],xs[sl,1],1)
    # cups are symmetric: take the centre from the upper rows and mirror the cleaner (right) wall
    top=slice(int(n*.05),int(n*.35)); c=np.median((xs[top,0]+xs[top,1])/2)
    pl=np.array([-pr[0], 2*c - pr[1]])
    full=np.arange(ys[0],ys[-1]+1)
    mask=Image.new('L',(W,H),0); dr=ImageDraw.Draw(mask)
    for y in full: dr.line([(np.polyval(pl,y)-2,y),(np.polyval(pr,y)+2,y)],fill=255)
    mask=mask.filter(ImageFilter.GaussianBlur(1.4))
    o=im.convert('RGBA'); o.putalpha(mask); o=o.crop(mask.getbbox())
    cw,ch=o.size; s=860/ch; o=o.resize((int(cw*s),860),Image.LANCZOS)
    can=Image.new('RGBA',(700,900),(0,0,0,0)); can.paste(o,((700-o.size[0])//2,30),o); can.save(out)
    print(out, o.size)
import sys
for n,t in [("mango",14),("plain",int(sys.argv[1]) if len(sys.argv)>1 else 22),("empty",14)]: cup_cut(f"{n}.png", f"/tmp/claude-0/raw/cut-{n}.png", t)
