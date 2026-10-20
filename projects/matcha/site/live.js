// Layo live cup: a drink built from real photographs.
// Three aligned photos per drink (empty cup with ice, milk over fruit, finished drink) are revealed
// through animated masks: the purée rises, milk pours in, and the matcha sinks in clouds like a real pour.
// Real cut-out fruit pieces drop in; a photographed milk jug and katakuchi pour on top.
(function(){
  const W = 700, H = 900;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cache = {};
  const img = src => cache[src] || (cache[src] = new Promise(r => { const i = new Image(); i.decoding = "async"; i.onload = () => r(i); i.onerror = () => r(null); i.src = src; }));
  const json = src => cache[src] || (cache[src] = fetch(src).then(r => r.json()).catch(() => null));

  // value noise for the cloud mask
  const P = new Uint8Array(512); { const p = [...Array(256).keys()]; for (let i=255;i>0;i--){ const j = (i*7919 + 13) % (i+1); [p[i],p[j]] = [p[j],p[i]]; } for (let i=0;i<512;i++) P[i] = p[i & 255]; }
  const fade = t => t*t*(3 - 2*t);
  function vn(x, y){ const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const h = (a,b) => P[(P[a & 255] + b) & 255] / 255;
    const a = h(xi,yi), b = h(xi+1,yi), c = h(xi,yi+1), d = h(xi+1,yi+1), u = fade(xf), v = fade(yf);
    return a + (b - a)*u + (c - a)*v + (a - b - c + d)*u*v; }
  const fbm = (x, y) => vn(x,y)*.55 + vn(x*2.1+5,y*2.1+3)*.3 + vn(x*4.3+9,y*4.3+1)*.15;

  window.LiveCup = function(canvas, opt = {}){
    const ctx = canvas.getContext("2d");
    const MW = 100, MH = 128;
    const mk = () => { const c = document.createElement("canvas"); c.width = MW; c.height = MH; const g = c.getContext("2d"); return {c, g, d: g.createImageData(MW, MH)}; };
    const mFruit = mk(), mMilk = mk(), mCloud = mk(); const mask = mCloud.c, mctx = mCloud.g, md = mCloud.d;
    const layer = document.createElement("canvas"); layer.width = W; layer.height = H; const lctx = layer.getContext("2d");
    let meta = null, drink = null, A = {}, bits = [], sprites = {}, jugs = {};
    const st = { fruit:H, milk:H, front:-1, wob:0, pour:null, t:0 };
    let scale = 1, ox = 0, oy = 0, dpr = 1;

    function resize(){
      dpr = Math.min(devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
      canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
      scale = Math.min(w/W, h/H*(opt.fit || 1)); ox = (w - W*scale)/2; oy = h - H*scale - (opt.bottom || 0);
    }
    new ResizeObserver(resize).observe(canvas); resize();

    async function load(key){
      meta = meta || await json(opt.base + "meta.json");
      const [e,m,f] = await Promise.all(["empty","milk","full"].map(n => img(`${opt.base}${key}-${n}.webp`)));
      A[key] = {e,m,f};
      if (key !== "plain" && !sprites[key]){ const [s,b] = await Promise.all([img(`${opt.base}bits-${key}.webp`), json(`${opt.base}bits-${key}.json`)]); sprites[key] = {s, boxes:b || []}; }
    }
    [].forEach(async n => { const i = await img(opt.base + n + ".webp"); if (!i) return;
      // find where the stream leaves the bottom of the picture so it can be aimed at the cup
      const c = document.createElement("canvas"); c.width = i.width; c.height = 40; const g = c.getContext("2d"); g.drawImage(i, 0, i.height - 40, i.width, 40, 0, 0, i.width, 40);
      const d = g.getImageData(0, 20, i.width, 1).data; let sx = 0, n2 = 0; for (let x=0;x<i.width;x++) if (d[x*4+3] > 128){ sx += x; n2++; }
      jugs[n] = {i, sx: n2 ? sx/n2 : i.width/2}; });

    function wave(y, x, amp){ return y + Math.sin(x*.035 + st.t*3.1)*amp + Math.sin(x*.07 - st.t*2.3)*amp*.5; }
    function clipBelow(c, surface, amp){
      c.beginPath(); c.moveTo(0, H); for (let x=0;x<=W;x+=20) c.lineTo(x, wave(surface, x, amp)); c.lineTo(W, H); c.closePath(); c.clip();
    }
    // matcha clouds: the front moves down from the surface, broken up by drifting noise
    // a soft, slightly uneven liquid surface: everything below it shows
    function surfaceMask(M, surface, soft, rough, speed){
      const d = M.d.data, t = st.t;
      for (let j=0;j<MH;j++){ const y = j/MH*H;
        for (let i=0;i<MW;i++){ const x = i/MW*W;
          const n = fbm(x*.008 + t*speed, y*.01 - t*.4) - .5;
          const s2 = surface + Math.sin(x*.035 + t*3.1)*(2 + st.wob*7) + n*rough;
          d[(j*MW+i)*4+3] = Math.max(0, Math.min(1, (y - s2)/soft + .5))*255; } }
      M.g.putImageData(M.d, 0, 0); return M.c;
    }
    function reveal(im, maskCanvas){
      lctx.globalCompositeOperation = "copy"; lctx.drawImage(im, 0, 0);
      lctx.globalCompositeOperation = "destination-in"; lctx.imageSmoothingEnabled = true; lctx.drawImage(maskCanvas, 0, 0, W, H);
      ctx.drawImage(layer, 0, 0);
    }
    function cloudMask(m){
      const front = st.front, top = m.liquid, span = H - top, d = md.data, t = st.t;
      for (let j=0;j<MH;j++){ const y = j/MH*H;
        for (let i=0;i<MW;i++){ const x = i/MW*W;
          const n = fbm(x*.006, y*.0045 - t*.18) - .5, n2 = fbm(x*.012 + 7, y*.01 - t*.3) - .5;
          const edge = front + n*360 + n2*140;             // ragged, sinking tongues of matcha
          let a = Math.max(0, Math.min(1, (edge - y)/150 + .5));
          if (y < top - 6) a = 1;
          d[(j*MW+i)*4+3] = a*255; } }
      mctx.putImageData(md, 0, 0);
    }
    function frame(now){
      requestAnimationFrame(frame);
      const dt = Math.min(.1, Math.max(0, (now - (frame.last || now))/1000)); frame.last = now; st.t += dt;
      if (!drink || !A[drink] || !meta) return;
      const m = meta[drink], a = A[drink];
      // levels ease towards their targets
      const ease = (v, t, k) => v + (t - v)*(1 - Math.pow(k, dt));
      st.fruit = ease(st.fruit, st.fruitT, .12); st.milk = ease(st.milk, st.milkT, .2);
      if (st.frontT !== undefined) st.front = ease(st.front, st.frontT, .55);
      st.wob *= Math.pow(.3, dt);
      const amp = 2 + st.wob*7;

      ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.setTransform(dpr*scale,0,0,dpr*scale,dpr*ox,dpr*oy);
      // soft shadow under the cup
      const g = ctx.createRadialGradient(W/2, m.bot + 6, 10, W/2, m.bot + 6, 260); g.addColorStop(0,"rgba(34,53,28,.22)"); g.addColorStop(1,"rgba(34,53,28,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(W/2, m.bot + 6, 260, 36, 0, 0, Math.PI*2); ctx.fill();
      ctx.drawImage(a.e, 0, 0);
      // fruit, then milk: the milk photo already carries the fruit at the bottom
      const settled = st.front > H && st.milk < m.liquid + 2;
      if (settled){ ctx.drawImage(a.f, 0, 0); }
      else {
        if (st.fruit < m.bot - 2 && st.milk >= m.fruit - 2) reveal(a.m, surfaceMask(mFruit, Math.max(st.fruit, m.fruit - 20), 26, 40, .05));
        // milk rises over the fruit with a soft, cloudy front, so the fruit blushes up into it
        if (st.milk < m.fruit - 2) reveal(a.m, surfaceMask(mMilk, st.milk, 34, 70, .08));
      // matcha
      if (st.front > m.liquid - 40){
        cloudMask(m);
        lctx.globalCompositeOperation = "copy"; lctx.drawImage(a.f, 0, 0);
        lctx.globalCompositeOperation = "destination-in"; lctx.imageSmoothingEnabled = true; lctx.drawImage(mask, 0, 0, W, H);
        ctx.save(); clipBelow(ctx, st.milk - 6, amp*1.2); ctx.drawImage(layer, 0, 0); ctx.restore();
      }
      }
      // pieces of fruit falling in, fading as they sink into the purée
      for (let i = bits.length - 1; i >= 0; i--){ const b = bits[i]; b.vy += 2200*dt; b.y += b.vy*dt; b.r += b.vr*dt;
        const surf = Math.min(st.fruit, st.milk);
        if (b.y > surf && !b.in){ b.in = 1; b.vy *= .15; st.wob = Math.min(1, st.wob + .1); }
        if (b.in){ b.vy = Math.min(b.vy, 220); b.a -= dt*2.2; }
        if (b.a <= 0 || b.y > m.bot){ bits.splice(i,1); continue; }
        const sp = sprites[drink]; if (!sp || !sp.s) continue; const bx = sp.boxes[b.k % sp.boxes.length];
        ctx.save(); ctx.globalAlpha = Math.max(0, b.a); ctx.translate(b.x, b.y); ctx.rotate(b.r); const s = b.s;
        ctx.drawImage(sp.s, bx[0], bx[1], bx[2], bx[3], -bx[2]*s/2, -bx[3]*s/2, bx[2]*s, bx[3]*s); ctx.restore(); }
      // the pour: just a stream of milk or matcha falling into the cup, no vessel
      const p = st.pour;
      if (p){ p.t += dt; const k = Math.min(1, p.t/.25) - Math.max(0, (p.t - (p.dur - .3))/.3);
        if (k > 0){ const surf = Math.min(st.milk, st.fruit), x = W/2 + 18, top = -(opt.headroom || 300);
          const wdt = (p.kind === "milk" ? 13 : 10)*k, g2 = ctx.createLinearGradient(x - wdt, 0, x + wdt, 0);
          const c = p.kind === "milk" ? ["#e8dcc4","#fbf6ec","#ddcfb4"] : ["#4f7a1e","#8dbb45","#456e18"];
          g2.addColorStop(0,c[0]); g2.addColorStop(.45,c[1]); g2.addColorStop(1,c[2]);
          ctx.fillStyle = g2; ctx.beginPath();
          for (let y = top; y <= surf; y += 20){ const sw = Math.sin(y*.05 + st.t*9)*1.2; ctx.lineTo(x - wdt*.8 + sw, y); }
          for (let y = surf; y >= top; y -= 20){ const sw = Math.sin(y*.05 + st.t*9)*1.2; ctx.lineTo(x + wdt*.8 + sw, y); }
          ctx.fill(); st.wob = Math.min(1, st.wob + dt*.8); }
        if (p.t > p.dur) st.pour = null; }
    }
    requestAnimationFrame(frame);

    let job = 0;
    const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
    function drop(key, n){ const sp = sprites[key]; if (!sp) return; for (let i=0;i<n;i++) bits.push({k:i, x:W/2 + (Math.random() - .5)*220, y:-60 - i*70, vy:0, r:Math.random()*6, vr:(Math.random() - .5)*4, s:.9 + Math.random()*.5, a:1}); }
    // build: fruit pieces and purée, then milk, then matcha. `from` skips the steps that did not change.
    async function build(key, from = "fruit"){
      const id = ++job; await load(key); if (id !== job) return; const m = meta[key];
      if (drink !== key || from === "fruit"){ drink = key; st.fruit = st.fruitT = m.bot; st.milk = st.milkT = m.fruit + 1; st.front = st.frontT = m.liquid - 60; }
      if (reduce){ st.fruit = st.fruitT = m.fruit; st.milk = st.milkT = m.liquid - 4; st.front = st.frontT = H + 300; return; }
      if (from === "fruit"){
        if (key !== "plain"){ drop(key, 9); await wait(500); if (id !== job) return; st.fruitT = m.fruit; await wait(1100); }
        else { st.fruit = st.fruitT = m.fruit; }
        if (id !== job) return; from = "milk";
      }
      if (from === "milk"){
        st.front = st.frontT = m.liquid - 60; st.milk = st.milkT = m.fruit + 1;
        st.pour = {kind:"milk", t:0, dur:1.6}; await wait(250); if (id !== job) return; st.milkT = m.liquid - 4; await wait(1500); if (id !== job) return; from = "matcha";
      }
      if (from === "matcha"){
        st.front = st.frontT = m.liquid - 60;
        st.pour = {kind:"matcha", t:0, dur:1.4}; await wait(300); if (id !== job) return;
        st.frontT = m.matcha;            // clouds bloom down through the top of the milk
        await wait(2600); if (id !== job) return;
        st.frontT = H + 300;             // and settle into the finished drink
      }
    }
    function show(key){ return load(key).then(() => { drink = key; const m = meta[key]; st.fruit = st.fruitT = m.fruit; st.milk = st.milkT = m.liquid - 4; st.front = st.frontT = H + 300; }); }
    return { build, show, preload: load };
  };
})();
