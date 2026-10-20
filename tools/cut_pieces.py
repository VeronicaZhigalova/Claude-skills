# Cut separate pieces (fruit, leaves) out of a "laid out on white" photo into individual transparent images.
# usage: python3 cut_pieces.py src.png out_prefix [max] [thr]
from PIL import Image, ImageFilter
import numpy as np, sys
src, out = sys.argv[1], sys.argv[2]; mx = int(sys.argv[3]) if len(sys.argv) > 3 else 8; thr = int(sys.argv[4]) if len(sys.argv) > 4 else 40
im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(float)
bg = np.median(np.concatenate([a[:20].reshape(-1,3), a[-20:].reshape(-1,3)]), axis=0); d = np.abs(a - bg).max(axis=2)
m = np.asarray(Image.fromarray(((d > thr)*255).astype('uint8')).filter(ImageFilter.MinFilter(5)).resize((a.shape[1]//4, a.shape[0]//4))) > 128
H, W = m.shape; lab = np.zeros((H, W), int); n = 0
for y0 in range(H):
    for x0 in range(W):
        if m[y0,x0] and not lab[y0,x0]:
            n += 1; st = [(y0,x0)]; lab[y0,x0] = n
            while st:
                y, x = st.pop()
                for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
                    yy, xx = y+dy, x+dx
                    if 0 <= yy < H and 0 <= xx < W and m[yy,xx] and not lab[yy,xx]: lab[yy,xx] = n; st.append((yy,xx))
k = 0
for i in range(1, n+1):
    ys, xs = np.where(lab == i)
    if len(ys) < 40 or k >= mx: continue
    x0, x1, y0, y1 = max(0,xs.min()*4-14), xs.max()*4+18, max(0,ys.min()*4-14), ys.max()*4+18
    crop = im.crop((x0,y0,x1,y1)); dd = np.abs(np.asarray(crop).astype(float) - bg).max(axis=2)
    al = Image.fromarray(np.clip((dd-16)*12, 0, 255).astype('uint8')).filter(ImageFilter.GaussianBlur(.8))
    c = crop.convert('RGBA'); c.putalpha(al); c.save(f'{out}-{k}.webp', quality=88); k += 1
print(out, k)
