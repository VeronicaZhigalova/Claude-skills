# Villa Sereine logo concepts. Text is converted to outlines (fontTools), no live <text>.
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
F='/tmp/claude-0/fonts/'
def word(font, s, size, track=0):
    f=TTFont(F+font); gs=f.getGlyphSet(); cmap=f.getBestCmap(); upm=f['head'].unitsPerEm; k=size/upm
    x=0; parts=[]
    for ch in s:
        g=cmap[ord(ch)]; pen=SVGPathPen(gs); gs[g].draw(pen)
        parts.append(f'<path transform="translate({x:.1f} 0) scale({k:.5f} {-k:.5f})" d="{pen.getCommands()}"/>')
        x+=gs[g].width*k+track
    return ''.join(parts), x-track
def svg(w,h,body,ink='#1f2a24'): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><g fill="{ink}">{body}</g></svg>'
INK='#1f2a24'
# A — window: an arched opening with the sea horizon inside, over spaced capitals
def arch(cx,top,w,h,sw):
    r=w/2
    outer=f'M{cx-r},{top+h} V{top+r} A{r},{r} 0 0 1 {cx+r},{top+r} V{top+h} Z'
    ri=r-sw
    inner=f'M{cx-ri},{top+h-sw} V{top+r} A{ri},{ri} 0 0 1 {cx+ri},{top+r} V{top+h-sw} Z'
    return f'<path fill-rule="evenodd" d="{outer} {inner}"/>'
def window(cx,top,w,h,sw):
    hz=top+h*.66
    sr=w*.17
    sun=f'<path d="M{cx-sr},{hz} A{sr},{sr} 0 0 1 {cx+sr},{hz} Z"/>'
    return arch(cx,top,w,h,sw)+sun+f'<rect x="{cx-w/2+sw}" y="{hz}" width="{w-2*sw}" height="{sw*.7}"/>'
sym_a=window(128,28,120,200,9)
open('a-symbol.svg','w').write(svg(256,256,sym_a))
wm,ww=word('Marcellus.ttf','SEREINE',64,14); vl,vw=word('Marcellus.ttf','VILLA',20,10)
W=max(ww,300)+40
body=window(W/2,10,70,116,6)+f'<g transform="translate({(W-vw)/2} 168)">{vl}</g><g transform="translate({(W-ww)/2} 238)">{wm}</g>'
open('a-lockup.svg','w').write(svg(W,260,body))
# B — horizon: light serif name sitting on one long line, like the sea at dusk
nm,nw=word('CormorantGaramond.ttf','Sereine',120,2)
W=nw+80
body=f'<g transform="translate(40 120)">{nm}</g><rect x="0" y="146" width="{W}" height="2.4"/>'
vl2,vw2=word('CormorantGaramond.ttf','VILLA',22,9)
body+=f'<g transform="translate({(W-vw2)/2} 186)">{vl2}</g>'
open('b-lockup.svg','w').write(svg(W,200,body))
s,sw_=word('CormorantGaramond.ttf','S',170)
open('b-symbol.svg','w').write(svg(256,256,f'<g transform="translate({128-sw_/2} 178)">{s}</g><rect x="28" y="196" width="200" height="3"/>'))
print('ok')
