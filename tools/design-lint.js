// Обязательная проверка перед сдачей: node tools/design-lint.js <url> (нужен playwright-core и Chromium)
// Ловит наши запрещённые приёмы и тесные отступы. Любая строка FAIL = ошибка, исправить без исключений.
const { chromium } = require('playwright-core');
(async () => {
  const url = process.argv[2]; const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium', headless:false, args:['--headless=new','--use-gl=swiftshader','--enable-unsafe-swiftshader'] });
  for (const w of [1440, 390]) {
    const p = await b.newPage({ viewport:{ width:w, height:900 } }); await p.goto(url); await p.waitForTimeout(3000); await p.addStyleTag({content:'*{transform:none!important;translate:none!important;clip-path:none!important}'});
    const out = await p.evaluate(() => {
      const f = [], vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width && r.height && s.display !== 'none' && s.visibility !== 'hidden'; };
      const name = e => (e.id ? '#'+e.id : e.tagName.toLowerCase()) + ' «' + e.textContent.trim().slice(0,40) + '»';
      document.querySelectorAll('h1,h2,h3').forEach(h => { if (!vis(h)) return;
        [h, ...h.querySelectorAll('*')].forEach(n => { if (getComputedStyle(n).fontStyle === 'italic') f.push('курсив в заголовке: ' + name(h)); });
        const fs = parseFloat(getComputedStyle(h).fontSize), nx = h.nextElementSibling;
        if (nx && vis(nx) && nx.textContent.trim().length > 0 && nx.getBoundingClientRect().left < h.getBoundingClientRect().right - 4 && h.getBoundingClientRect().right > 0 && h.getBoundingClientRect().left < innerWidth) { const gap = nx.getBoundingClientRect().top - h.getBoundingClientRect().bottom, need = Math.max(20, Math.min(40, fs*.4));
          if (h.tagName !== 'H3' && gap < need) f.push(`тесно ${Math.round(gap)}px < ${Math.round(need)}px после ${name(h)}`); }
        const par = h.parentElement, sib = [...par.children].find(c => c !== h && /^P$/.test(c.tagName) && vis(c));
        if (sib && h.tagName === 'H2') { const a = h.getBoundingClientRect(), c = sib.getBoundingClientRect(); if (c.left > a.right - 4 && Math.abs(c.top - a.top) < a.height) f.push('пояснение в правой колонке у ' + name(h)); }
        const pr = h.previousElementSibling; if (pr && vis(pr) && pr.textContent.trim().length < 40 && /uppercase/.test(getComputedStyle(pr).textTransform) && pr.querySelector('i,hr,span:empty')) f.push('надзаголовок-лейбл с полоской над ' + name(h)); });
      document.querySelectorAll('p,li').forEach(e => { if (!vis(e)) return; const s = getComputedStyle(e), lh = parseFloat(s.lineHeight)/parseFloat(s.fontSize); if (e.textContent.length > 80 && lh < 1.35) f.push(`межстрочный ${lh.toFixed(2)} в тексте ${name(e)}`); });
      document.querySelectorAll('body *').forEach(n => { if (vis(n) && n.childNodes.length && [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim()) && getComputedStyle(n).fontStyle === 'italic') f.push('курсив (запрещён везде): ' + name(n)); });
      const tx = document.body.innerText; (tx.match(/[€$£][ \u00a0]?\d[\d.,]*/g) || []).forEach(m => f.push('цена валютой вперёд «' + m + '» → пиши «число €»'));
      if (document.documentElement.scrollWidth > innerWidth + 1) f.push('горизонтальный скролл');
      return [...new Set(f)]; });
    console.log(`\n${w}px: ${out.length ? out.map(x => 'FAIL ' + x).join('\n') : 'OK'}`); await p.close(); }
  await b.close(); })();
