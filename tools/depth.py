from transformers import pipeline
from PIL import Image
import numpy as np, sys
p = pipeline("depth-estimation", model="depth-anything/Depth-Anything-V2-Small-hf", device=-1)
im = Image.open(sys.argv[1]).convert("RGB")
d = np.array(p(im)["depth"]).astype("float32")
d = (d - d.min()) / (d.max() - d.min())
Image.fromarray((d * 255).astype("uint8")).resize(im.size, Image.BICUBIC).save(sys.argv[2])
print("ok", im.size)
