// Lists every work on horizonx.so/explore (the page loads more on scroll). Prints one /explore/<slug> per line.
// Run: NODE_PATH=/tmp/pw/node_modules node tools/hx-list.js   (playwright-core, Chromium from /opt/pw-browsers)
const { chromium } = require('playwright-core');
const fs = require('fs');
(async () => {
  const exe = fs.readdirSync('/opt/pw-browsers').filter(d => d.startsWith('chromium-')).map(d => `/opt/pw-browsers/${d}/chrome-linux/chrome`)[0];
  const b = await chromium.launch({ headless: false, executablePath: exe, args: ['--headless=new'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('https://horizonx.so/explore', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  let last = 0;
  for (let i = 0; i < 40; i++) {
    await p.mouse.wheel(0, 2500); await p.waitForTimeout(700);
    const n = await p.$$eval('a[href*="/explore/"]', a => a.length);
    if (n === last && i > 8) break; last = n;
  }
  const slugs = await p.$$eval('a[href*="/explore/"]', a => [...new Set(a.map(x => new URL(x.href).pathname))]);
  console.log(slugs.filter(s => s.split('/').length === 3).join('\n'));
  await b.close();
})();
