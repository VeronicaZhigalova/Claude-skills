# Builds a standalone dist/ (full document + only the assets the page uses) for real hosting and audits
import pathlib, re, shutil
root = pathlib.Path(__file__).parent
src = (root / 'index.html').read_text()
title = re.search(r'<title>(.*?)</title>', src).group(1)
# everything before the first <style> closes belongs in <head>; the second style block too
head_end = src.index('<header')
head_extra = src[:head_end].replace(f'<title>{title}</title>', '')
body = src[head_end:]
favicon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23060505'/%3E%3Ctext x='16' y='23' text-anchor='middle' font-family='Georgia' font-size='20' fill='%23C8893E'%3EO%3C/text%3E%3C/svg%3E"
doc = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title} · Perfume house in Brera</title>
<meta name="description" content="Seven perfumes composed in Brera, Milan, and poured by hand. Try all seven with the €45 discovery set, credited towards your first decanter.">
<meta name="theme-color" content="#060505">
<meta property="og:title" content="{title} · Perfume house in Brera">
<meta property="og:description" content="Seven perfumes for the hours after dark. Discovery set €45.">
<meta property="og:image" content="img/ritual-end-1440.webp">
<link rel="icon" href="{favicon}">
{head_extra.strip()}
</head>
<body>
{body}
</body>
</html>
'''
dist = root / 'dist'
if dist.exists(): shutil.rmtree(dist)
(dist / 'img').mkdir(parents=True)
(dist / 'index.html').write_text(doc)
used = set(re.findall(r'img/[\w.-]+', doc))
for m in re.finditer(r"img/ritual\$\{[^}]*\}\.\$\{ext\}|img/ritual-end-\$\{[^}]*\}", doc): pass
used |= {'img/ritual.mp4', 'img/ritual-540.mp4', 'img/ritual.webm', 'img/ritual-540.webm', 'img/ritual-end-1440.webp', 'img/ritual-end-720.webp'}
for u in sorted(used):
    f = root / u
    if f.exists(): shutil.copy(f, dist / u)
print('built', len(doc), 'bytes,', len(used), 'assets')
