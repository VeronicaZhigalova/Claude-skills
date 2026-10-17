# Builds a standalone dist/index.html (full document) from the artifact page, for real hosting and Figma capture
import pathlib, re, shutil
root = pathlib.Path(__file__).parent
src = (root / 'index.html').read_text()
title = re.search(r'<title>(.*?)</title>', src).group(1)
body_start = src.index('<header')
head_extra = src[:body_start].replace(f'<title>{title}</title>', '').replace('<meta name="claude:viewport-fit-sides" content="cover">', '')
favicon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='16' fill='%23EFE8DD'/%3E%3Ctext x='16' y='22' text-anchor='middle' font-family='Georgia' font-size='18' fill='%232A2522'%3EH%3C/text%3E%3C/svg%3E"
doc = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title} · Reformer Pilates in Le Marais, Paris</title>
<meta name="description" content="Boutique reformer Pilates in Le Marais, Paris. Groups of six, private sessions, first class €25.">
<meta property="og:title" content="{title}">
<meta property="og:description" content="Reformer Pilates in groups of six, in a sunlit studio in Le Marais, Paris.">
<meta property="og:image" content="img/hero-1600.webp">
<link rel="icon" href="{favicon}">
{head_extra.strip()}
</head>
<body>
{src[body_start:]}
</body>
</html>
'''
dist = root / 'dist'; dist.mkdir(exist_ok=True)
(dist / 'index.html').write_text(doc)
if (dist / 'img').exists(): shutil.rmtree(dist / 'img')
shutil.copytree(root / 'img', dist / 'img', ignore=shutil.ignore_patterns('*-original.png'))
shutil.copy(root / 'case.html', dist / 'case.html')
print('built', len(doc))
