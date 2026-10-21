// Feel check: scroll a page the way a person does and report how it feels, not just how it looks.
// Usage: NODE_PATH=/tmp/pw/node_modules CHROME=... node tools/feel-check.js <url> [outDir] [--mobile]
// Note: the container has no GPU, so heavy full-screen layers stutter more here than on a laptop.
//   Read the smoothness line as relative (before/after a change), the last word is a real device.
// Output: filmstrip.png (a frame every ~3 wheel notches, in scroll order) and a report in the console:
//   - first 3 seconds: is there a visible next action without scrolling (button / link / hint in view)?
//   - smoothness: share of frames slower than 25 ms (a visible stutter) and the worst frame
//   - layout shifts while scrolling (things that jump), long main-thread tasks
//   - dead zones: stretches of scrolling where almost nothing on screen changes (the visitor thinks it's broken)
const { chromium } = require('playwright-core');
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');

(async () => {
  const url = process.argv[2], out = process.argv[3] && !process.argv[3].startsWith('--') ? process.argv[3] : '/tmp/feel';
  const mobile = process.argv.includes('--mobile');
  const vp = mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 };
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME, args: ['--headless=new'] });
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__f = []; window.__ls = 0; window.__lt = []; window.__src = {};
    let last = performance.now();
    const tick = t => { window.__f.push([t - last, scrollY]); last = t; requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    new PerformanceObserver(l => l.getEntries().forEach(e => { if (e.hadRecentInput) return;
      // GSAP pins swap an element to position:fixed without moving it on screen: that is not a jump
      const srcs = (e.sources || []).filter(x => !(x.node && x.node.parentElement && x.node.parentElement.classList.contains('pin-spacer')));
      if (e.sources && e.sources.length && !srcs.length) return;
      window.__ls += e.value;
      srcs.forEach(x => { const n = x.node; if (!n || !n.tagName) return; const k = n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + (n.className && typeof n.className === 'string' ? '.' + n.className.trim().split(/\s+/).join('.') : ''); window.__src[k] = (window.__src[k] || 0) + e.value; }); })).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(l => l.getEntries().forEach(e => window.__lt.push(Math.round(e.duration)))).observe({ type: 'longtask', buffered: true });
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // 1. First impression: what can a visitor act on without scrolling?
  const first = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e);
      return r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0 && s.visibility !== 'hidden' && +s.opacity > .3; };
    const acts = [...document.querySelectorAll('a,button,[role=button]')].filter(vis).map(e => (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ')).filter(Boolean);
    const hint = acts.find(t => /scroll|step inside|explore|discover|see|book|check|start|try/i.test(t));
    return { actions: acts.slice(0, 12), hint: hint || null, pageH: document.documentElement.scrollHeight };
  });

  await page.mouse.move(vp.width / 2, vp.height / 2);  // wheel goes where the pointer is, like a real hand
  // 2. Scroll like a person (wheel notches with small pauses) and only measure: screenshots would stall frames
  await page.evaluate(() => { window.__f = []; window.__ls = 0; window.__lt = []; window.__src = {}; });
  const steps = Math.ceil((first.pageH - vp.height) / 120) + 4;
  for (let i = 0; i < steps; i++) {
    if (mobile) await page.evaluate(() => scrollBy({ top: 120, behavior: 'instant' })); else await page.mouse.wheel(0, 120);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(800);
  const m = await page.evaluate(() => ({ f: window.__f.slice(2), ls: window.__ls, lt: window.__lt, src: window.__src, vh: innerHeight }));

  // 3. Second pass from the top for the filmstrip and dead zones
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(1200);
  const shots = [], diffs = []; let prev = null;
  for (let i = 0; i < steps; i += 3) {
    await page.evaluate(y => scrollTo(0, y), i * 120); await page.waitForTimeout(350);
    const buf = await page.screenshot({ type: 'jpeg', quality: 40 });
    shots.push(buf); if (prev) diffs.push(Math.abs(buf.length - prev.length) / prev.length); prev = buf;
  }
  await ctx.close(); await browser.close();

  const f = m.f.map(x => x[0]).filter(x => x < 1000), slow = f.filter(x => x > 25).length;
  // where the stutter happens, in screens from the top
  const where = {}; m.f.forEach(([d, y]) => { if (d > 25 && d < 1000) { const k = Math.floor(y / m.vh); where[k] = (where[k] || 0) + 1; } });
  const hot = Object.entries(where).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, n]) => `screen ${k}: ${n}`).join(', ');
  const jumpers = Object.entries(m.src).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k} ${v.toFixed(2)}`).join('; ');
  // a run of 6+ captures (about 2 screens of scrolling) where the frame barely changes = a dead zone
  let run = 0, dead = 0; diffs.forEach(d => { run = d < .004 ? run + 1 : 0; if (run === 6) dead++; });

  // filmstrip from the frames captured while scrolling, so motion can be read in order
  shots.forEach((buf, i) => fs.writeFileSync(path.join(out, `f${String(i).padStart(3, '0')}.jpg`), buf));
  try { execSync(`ffmpeg -y -loglevel error -framerate 1 -i ${out}/f%03d.jpg -vf "scale=${mobile ? 130 : 240}:-1,tile=10x${Math.ceil(shots.length / 10)}" -frames:v 1 ${out}/filmstrip.png`); } catch (e) {}

  const pct = f.length ? (slow / f.length * 100).toFixed(1) : '0';
  const verdict = [];
  verdict.push(first.hint ? `OK  first screen offers an action: «${first.hint}»` : 'FAIL first screen: no visible next action or scroll hint');
  verdict.push(+pct < 5 ? `OK  smooth: ${pct}% slow frames, worst ${Math.round(Math.max(...f))} ms` : `FAIL stutter: ${pct}% frames over 25 ms, worst ${Math.round(Math.max(...f))} ms (${hot})`);
  verdict.push(m.ls < .05 ? `OK  nothing jumps (layout shift ${m.ls.toFixed(3)})` : `FAIL things jump while scrolling (layout shift ${m.ls.toFixed(3)}: ${jumpers})`);
  verdict.push(m.lt.filter(x => x > 100).length ? `WARN long tasks: ${m.lt.filter(x => x > 100).join(', ')} ms` : 'OK  no long main-thread tasks');
  verdict.push(dead ? `WARN ${dead} dead zone(s): scrolling for ~2 screens with almost no change` : 'OK  no dead zones');
  console.log((mobile ? 'mobile' : 'desktop') + '\n' + verdict.join('\n') + `\nfilmstrip: ${out}/filmstrip.png`);
})();
