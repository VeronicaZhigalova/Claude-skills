// "Video" of a scene without Playwright's ffmpeg: a CDP screencast saves frames with timestamps.
// Usage: node rec.js URL out-dir  → frames f0001.jpg… (rest 5s at 18% of the page, then a glide down)
const { chromium } = require('playwright-core'); const fs = require('fs');
(async () => {
  const [url, dir] = process.argv.slice(2); fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch({ headless: false, executablePath: fs.readdirSync('/opt/pw-browsers').filter(d=>d.startsWith('chromium-')).map(d=>`/opt/pw-browsers/${d}/chrome-linux/chrome`)[0], args: ['--headless=new','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 960, height: 600 } });
  await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  await p.evaluate(h => scrollTo(0, h * .18), H); await p.waitForTimeout(2500);
  const cdp = await p.context().newCDPSession(p); let n = 0; const t0 = Date.now(); const log = [];
  cdp.on('Page.screencastFrame', async f => { n++; fs.writeFileSync(`${dir}/f${String(n).padStart(4,'0')}.jpg`, Buffer.from(f.data, 'base64')); log.push(Date.now() - t0); await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(()=>{}); });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 70, everyNthFrame: 1 });
  await p.waitForTimeout(5000);
  for (let i = 0; i < 40; i++) { await p.mouse.wheel(0, H / 60); await p.waitForTimeout(120); }
  await p.waitForTimeout(2500);
  await cdp.send('Page.stopScreencast');
  fs.writeFileSync(`${dir}/times.json`, JSON.stringify(log));
  console.log(n, 'frames in', ((Date.now() - t0) / 1000).toFixed(1), 's');
  await b.close();
})();
