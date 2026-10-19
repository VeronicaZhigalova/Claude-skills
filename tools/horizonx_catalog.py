"""Rebuilds skills/premium-wow-design/references/horizonx-catalog.md from the live horizonx.so/explore.
Run before every new project (and weekly):  python3 tools/horizonx_catalog.py
Needs: node + playwright-core (in /tmp/pw or NODE_PATH), curl. Marks works that are new since the last run."""
import subprocess, re, os, pathlib, concurrent.futures as cf, datetime
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'skills/premium-wow-design/references/horizonx-catalog.md'
env = dict(os.environ, NODE_PATH=':'.join(filter(None, [os.environ.get('NODE_PATH'), '/tmp/pw/node_modules'])))
slugs = []
for attempt in range(3):   # the explore page sometimes loads slowly; retry before giving up
    res = subprocess.run(['node', str(ROOT / 'tools/hx-list.js')], capture_output=True, text=True, env=env); slugs = res.stdout.split()
    if not slugs: print('retry:', res.stderr[-300:])
    if slugs: break
if not slugs: raise SystemExit('horizonx.so/explore returned no works; the old catalog was kept')
old = set(re.findall(r'^\| ([a-z0-9-]+) \|', OUT.read_text(), re.M)) if OUT.exists() else set()

def get(path):
    slug = path.rsplit('/', 1)[1]
    h = subprocess.run(['curl', '-sSL', '-A', 'Mozilla/5.0', 'https://horizonx.so' + path], capture_output=True, text=True).stdout
    t = (re.search(r'<title>([^<]*)', h) or [None, slug])[1].split(' | HorizonX')[0]
    d = (re.search(r'<meta name="description" content="([^"]*)', h) or [None, ''])[1]
    v = sorted({u for u in re.findall(r'https://cdn\.horizonx\.so/[^"\\ ]+\.mp4', h) if f'/{slug}/' in u})
    name, _, typ = t.partition(': ')
    return dict(slug=slug, name=name, type=typ, desc=d, vids=v)

rows = list(cf.ThreadPoolExecutor(12).map(get, slugs))
NICHE = {
 'банк/финтех': r'fintech|bank|card|wealth|trading|finance|pay|crypto|invest|ledger|money|credit',
 'ИИ/SaaS': r'\bai\b|saas|agent|dashboard|analytics|intelligence|data|platform|app\b|assistant|neural',
 'парфюм/косметика': r'perfume|fragrance|scent|skin|beauty|cosmetic|serum|botanical',
 'мода/одежда': r'jacket|clothing|fashion|wear|apparel|sneaker|shoe',
 'авто/транспорт': r'\bcar\b|roadster|\bev\b|motor|fleet|vehicle|drive|auto|helmet|bike|freight',
 'архитектура/недвижимость': r'architect|estate|home|interior|stone|building|villa|house|space',
 'еда/напитки': r'food|sandwich|burger|coffee|wine|drink|restaurant|chicken|tea|juice|roaster',
 'часы/украшения': r'watch|jewel|ring\b|gem|luxury',
 'техника/гаджеты': r'headphone|device|gadget|speaker|glasses|vr\b|robot|tech|hardware|prosthesis',
 'портфолио/студия': r'studio|portfolio|agency|creative|designer|kit',
 'здоровье/спорт': r'health|vital|fitness|sport|medical|wellness|focus',
 'путешествия': r'travel|expedition|hotel|paris|destination|journey',
}
MOT = ('landing page', 'hero', 'template', 'video', 'gsap', 'three', 'webgl', 'simulator', 'motion', 'code')
for r in rows:
    t = (r['name'] + ' ' + r['desc'] + ' ' + r['slug']).lower()
    r['tags'] = [k for k, v in NICHE.items() if re.search(v, t)]
    r['motion'] = any(k in (r['type'] + ' ' + r['desc']).lower() for k in MOT) and 'Figma' not in r['type'] and 'Image Pack' not in r['type']
    r['new'] = r['slug'] not in old and bool(old)
today = datetime.date.today().isoformat()
L = ['# Каталог HorizonX (живой, пересобирается перед каждым проектом)', '',
     f'Снято {today}: {len(rows)} работ с https://horizonx.so/explore (порядок сайта: сверху новые). Работа: `https://horizonx.so/explore/<slug>`. '
     '★ — появилась с прошлой сборки. Если превью нет в таблице, оно грузится скриптом — взять Playwright (`video.currentSrc` на странице).', '',
     '## Как пользоваться (обязательно на старте проекта)',
     '1. `python3 tools/horizonx_catalog.py` — пересобрать каталог (новые работы отметятся ★). Старую версию файла не использовать.',
     '2. Выбрать строки по нише клиента (и смежным), сначала раздел «Движение», новые ★ — в приоритете.',
     '3. Для 8–12 кандидатов скачать превью-видео и смотреть **видео целиком** (кадры 2–4/с, плюс страница работы в браузере): ритм, физика, переходы. Стоп-кадров мало.',
     '4. Предложить Веронике 3–5 приёмов: что движется, почему это работает на бизнес клиента, какой рецепт из `motion-library.md` ближе.',
     '5. Если по нише в HorizonX пусто — остальные источники `research.md`.', '',
     '## Движение (лендинги, hero, шаблоны с кодом, видео)', '', '| slug | тип | ниши | превью |', '|---|---|---|---|']
order = {s.rsplit('/', 1)[1]: i for i, s in enumerate(slugs)}
for r in sorted([r for r in rows if r['motion']], key=lambda r: order[r['slug']]):
    L.append(f"| {r['slug']} | {('★ ' if r['new'] else '') + r['type']} | {', '.join(r['tags']) or '—'} | {r['vids'][0] if r['vids'] else '—'} |")
L += ['', '## Остальное (Figma-киты, экраны, картинки, бенто) — для UI и композиции', '', '| slug | тип | ниши |', '|---|---|---|']
for r in sorted([r for r in rows if not r['motion']], key=lambda r: order[r['slug']]):
    L.append(f"| {r['slug']} | {('★ ' if r['new'] else '') + r['type']} | {', '.join(r['tags']) or '—'} |")
OUT.write_text('\n'.join(L) + '\n')
print(len(rows), 'works,', sum(r['new'] for r in rows), 'new')
