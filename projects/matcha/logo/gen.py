# Mido logo kit generator. Letters are built from geometry (no font).
import math
W=26; B=200; XH=120
INK="#22351c"; MATCHA="#7fa34a"; MILK="#e9dcc2"; BERRY="#e48a9b"; RICE="#f5f0e6"
def circ(cx,cy,R): return f"M{cx-R},{cy}A{R},{R} 0 1 0 {cx+R},{cy}A{R},{R} 0 1 0 {cx-R},{cy}Z"
def ring(cx,cy,R,r): return circ(cx,cy,R)+circ(cx,cy,r)
def band(cx,cy,r,y0,y1):
    a0=math.sqrt(max(r*r-y0*y0,0))
    if y1>=r: return f"M{cx-a0:.2f},{cy+y0:.2f}A{r},{r} 0 0 0 {cx+a0:.2f},{cy+y0:.2f}Z"
    a1=math.sqrt(max(r*r-y1*y1,0))
    return f"M{cx-a0:.2f},{cy+y0:.2f}A{r},{r} 0 0 0 {cx-a1:.2f},{cy+y1:.2f}H{cx+a1:.2f}A{r},{r} 0 0 0 {cx+a0:.2f},{cy+y0:.2f}Z"
def arch(x,R=38):
    r=R-W; t=B-XH
    return f"M{x},{B}V{t+R}A{R},{R} 0 0 1 {x+2*R},{t+R}V{B}H{x+2*R-W}V{t+R}A{r},{r} 0 0 0 {x+W},{t+R}V{B}Z"
def P(d,fill): return f'<path fill-rule="evenodd" fill="{fill}" d="{d}"/>'
def layered(cx,cy,R,r,g,fills,n=3):
    rr=r-g; s=P(ring(cx,cy,R,r),fills[0])
    if n==3: ys=[(-rr*.30,rr*.06),(rr*.14,rr*.50),(rr*.58,rr)]
    else: ys=[(-rr*.25,rr*.25),(rr*.40,rr)]
    for (y0,y1),f in zip(ys,fills[1:]): s+=P(band(cx,cy,rr,y0,y1),f)
    return s

xl=20; xa=xl+W+16; xy=xa+120+24; xo=xy+76+18; WT=xo+120+20
def uarch(x,R=38):
    r=R-W; t=B-XH; yb=B-R
    return f"M{x},{t}V{yb}A{R},{R} 0 0 0 {x+2*R},{yb}V{t}H{x+2*R-W}V{yb}A{r},{r} 0 0 1 {x+W},{yb}V{t}Z"
def ytail(x,R=38):
    # right stem continues down and hooks left into the descender
    xs=x+2*R-W; r2=30
    return f"M{xs},{B-R}H{xs+W}V{B+38-0}A{r2+W},{r2+W} 0 0 1 {xs+W-(r2+W)},{B+38+r2+W}H{x+6}V{B+38+r2}H{xs+W-(r2+W)}A{r2},{r2} 0 0 0 {xs},{B+38}Z"
def word(ink,layers):
    s=P(f"M{xl},{B-190}H{xl+W}V{B}H{xl}Z",ink)
    s+=P(ring(xa+60,B-60,60,34),ink)+P(f"M{xa+94},{B-XH}H{xa+120}V{B}H{xa+94}Z",ink)
    s+=P(uarch(xy),ink)+P(ytail(xy),ink)
    return s+layered(xo+60,B-60,60,34,6,[ink]+layers)
def svg(w,h,body,bg=None,vb=None):
    b=f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb or f"0 0 {w} {h}"}">{b}{body}</svg>'
C=[MATCHA,MILK,BERRY]
files={
 'layo-wordmark-colour.svg': svg(WT,256,word(INK,C),vb=f"0 0 {WT} 290"),
 'layo-wordmark-black.svg': svg(WT,256,word("#000",["#000"]*3),vb=f"0 0 {WT} 290"),
 'layo-wordmark-reversed.svg': svg(WT,256,word(RICE,[MATCHA,RICE,BERRY]),bg=INK,vb=f"0 0 {WT} 290"),
 'layo-symbol-colour.svg': svg(256,256,layered(128,128,104,60,10,[INK]+C)),
 'layo-symbol-black.svg': svg(256,256,layered(128,128,104,60,10,["#000"]*4)),
 'layo-symbol-small.svg': svg(256,256,layered(128,128,112,58,14,[INK,MATCHA,BERRY],n=2)),
 'layo-app-icon.svg': svg(256,256,f'<rect width="256" height="256" rx="56" fill="{RICE}"/>'+layered(128,128,84,44,10,[INK,MATCHA,BERRY],n=2)),
 'layo-stacked-colour.svg': svg(WT,460,f'<g transform="translate({WT/2-90} 0) scale(.7)">'+layered(128,128,104,60,10,[INK]+C)+f'</g><g transform="translate(0 170)">'+word(INK,C)+'</g>'),
}
for k,v in files.items(): open('kit/'+k,'w').write(v)
# dynamic demo: any drink recolours the o
drinks={'strawberry':[MATCHA,MILK,BERRY],'blueberry':[MATCHA,"#f1ece2","#5b5f9e"],'banana-coconut':[MATCHA,"#fbf7ee","#efd27a"]}
for n,c in drinks.items(): open(f'kit/layo-drink-{n}.svg','w').write(svg(256,256,layered(128,128,104,60,10,[INK]+c)))
