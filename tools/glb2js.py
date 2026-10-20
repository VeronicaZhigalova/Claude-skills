"""glb2js.py — turn a .glb into a preview-safe bundle: <name>-data.js (glTF JSON + base64 geometry) + tex-N.webp.
The artifact preview host blocks fetch(), so models load as a JS module and textures through <img>.
On a client's own host, ship the .glb as is.   Usage: python3 tools/glb2js.py model.glb out_dir [name]"""
import json, struct, base64, io, sys, os
from PIL import Image
src, out = sys.argv[1], sys.argv[2]; name = sys.argv[3] if len(sys.argv) > 3 else 'model'
os.makedirs(out, exist_ok=True)
b = open(src, 'rb').read(); l = struct.unpack('<I', b[12:16])[0]; j = json.loads(b[20:20 + l])
o = 20 + l; bl = struct.unpack('<I', b[o:o + 4])[0]; buf = b[o + 8:o + 8 + bl]
img_views = set()
for k, im in enumerate(j.get('images', [])):
    if 'bufferView' not in im: continue
    bv = j['bufferViews'][im['bufferView']]; img_views.add(im['bufferView'])
    s = bv.get('byteOffset', 0); Image.open(io.BytesIO(buf[s:s + bv['byteLength']])).save(f'{out}/{name}-tex-{k}.webp', 'WEBP', quality=88)
    im.pop('bufferView'); im.pop('mimeType', None); im['uri'] = f'{name}-tex-{k}.webp'
new = bytearray(); keep = [i for i in range(len(j['bufferViews'])) if i not in img_views]
for i in keep:
    bv = j['bufferViews'][i]
    while len(new) % 4: new.append(0)
    s = bv.get('byteOffset', 0); bv['byteOffset'] = len(new); new += buf[s:s + bv['byteLength']]
idx = {o: n for n, o in enumerate(keep)}
j['bufferViews'] = [j['bufferViews'][i] for i in keep]
for a in j.get('accessors', []):
    if 'bufferView' in a: a['bufferView'] = idx[a['bufferView']]
for a in j.get('accessors', []):
    sp = a.get('sparse')
    if sp: sp['indices']['bufferView'] = idx[sp['indices']['bufferView']]; sp['values']['bufferView'] = idx[sp['values']['bufferView']]
j['buffers'] = [{'byteLength': len(new)}]
open(f'{out}/{name}-data.js', 'w').write(f'// {os.path.basename(src)} as glTF JSON + base64 geometry (tools/glb2js.py)\nexport const gltf = ' + json.dumps(j, separators=(',', ':')) + ';\nexport const bin = "' + base64.b64encode(bytes(new)).decode() + '";\n')
print(f'{name}: {len(new)} geometry bytes, {len(img_views)} textures')
