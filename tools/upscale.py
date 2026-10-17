import sys, torch, numpy as np
from PIL import Image
from spandrel import ModelLoader
torch.set_num_threads(max(1, torch.get_num_threads()))
m = ModelLoader().load_from_file('/tmp/claude-0/RealESRGAN_x4plus.pth').model.eval()
im = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(np.float32) / 255
H, W, _ = im.shape; T = 192; P = 16; out = np.zeros((H*4, W*4, 3), np.float32)
x = torch.from_numpy(im).permute(2, 0, 1)[None]
with torch.no_grad():
    for y0 in range(0, H, T):
        for x0 in range(0, W, T):
            ya, yb = max(0, y0-P), min(H, y0+T+P); xa, xb = max(0, x0-P), min(W, x0+T+P)
            o = m(x[:, :, ya:yb, xa:xb])[0].permute(1, 2, 0).numpy()
            oy, ox = (y0-ya)*4, (x0-xa)*4; h = min(T, H-y0)*4; w = min(T, W-x0)*4
            out[y0*4:y0*4+h, x0*4:x0*4+w] = o[oy:oy+h, ox:ox+w]
img = Image.fromarray((out.clip(0, 1)*255).round().astype(np.uint8))
tw = int(sys.argv[3]); img = img.resize((tw, round(img.height*tw/img.width)), Image.LANCZOS)
img.save(sys.argv[2], quality=95); print(img.size)
