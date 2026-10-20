// Layo 3D cup: a clear plastic cup with the Layo print and a layered drink inside.
// The layers are painted with real textures cut from our product photos (purée, milk, matcha),
// shaped by noise so the matcha sinks into the milk in clouds, like a real pour.
// In the builder the matcha is poured from a ceramic katakuchi; fruit drops in and sinks.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const H = 2.6, RT = 1.0, RB = 0.74, WALL = 0.035;
const rAt = (y, inset = 0) => RB + (RT - RB) * (y / H) - inset;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const MILK_AVG = new THREE.Color("#dec6a6"), MATCHA_AVG = new THREE.Color("#56710f");

const NOISE = `
float h31(vec3 p){ p = fract(p*vec3(.1031,.1030,.0973)); p += dot(p, p.yxz+33.33); return fract((p.x+p.y)*p.z); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x), mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x), f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x), mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x), f.y), f.z); }
float fbm3(vec3 p){ float v = 0., a = .5; for (int i=0;i<5;i++){ v += a*vn3(p); p = p*2.02 + 11.7; a *= .5; } return v; }`;

function liquidMaterial(u){
  return new THREE.ShaderMaterial({
    uniforms: u, side: THREE.DoubleSide,
    vertexShader: `varying vec3 vP; varying vec3 vN; varying vec3 vV;
      void main(){ vP = position; vec4 w = modelMatrix*vec4(position,1.); vN = normalize(mat3(modelMatrix)*normal); vV = normalize(cameraPosition - w.xyz);
        gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `uniform sampler2D tTop, tMid, tBot0, tBot1; uniform vec3 tintTop, tintMid; uniform float botMix;
      uniform float yAB, yBC, yTop, t, wob, hasFruit, cloud;
      varying vec3 vP; varying vec3 vN; varying vec3 vV; ${NOISE}
      vec3 tex(sampler2D s, float a, float v){ return texture2D(s, vec2(a/3.14159*1.5, clamp(v,.02,.98))).rgb; }
      void main(){
        float a = atan(vP.z, vP.x);
        vec3 q = vP;
        if (vP.y > yTop + (sin(a*3.+t*2.3)*.006 + sin(a*5.-t*1.7)*.004)*(1.+min(wob,1.)*1.5)) discard;
        // where the matcha meets the milk: soft uneven tongues
        float bAB = yAB + (fbm3(vec3(q.x*1.4, q.y*1.1 - t*.04, q.z*1.4))-.5)*.36 + (fbm3(q*vec3(5.,2.,5.) - t*.03)-.5)*.1;
        float bBC = yBC + (fbm3(q*vec3(3.,4.,3.) + 4.)-.5)*.1;
        float tAB = smoothstep(-.06,.05, vP.y - bAB);
        float tBC = smoothstep(-.02,.02, vP.y - bBC);
        // real textures, stretched over each layer's height
        vec3 top = tex(tTop, a, (vP.y - bAB)/max(yTop - bAB, .05)) * tintTop;
        vec3 mid = tex(tMid, a + 1.3, (vP.y - bBC)/max(bAB - bBC, .05)) * tintMid;
        vec3 b0 = tex(tBot0, a + .6, (vP.y - .07)/max(bBC - .07, .05)), b1 = tex(tBot1, a + .6, (vP.y - .07)/max(bBC - .07, .05));
        vec3 bot = mix(mid, mix(b0, b1, botMix), hasFruit);
        // matcha clouds billowing down through the milk while it is poured, then settling into threads
        float c = fbm3(vec3(q.x*2.1, q.y*1.5 + t*.35, q.z*2.1) + 5.);
        float depth = smoothstep(bAB - (.25 + 1.1*cloud), bAB, vP.y);
        float cl = smoothstep(.52 - .18*cloud, .72 - .1*cloud, c) * depth;
        float thread = smoothstep(.6,.82, fbm3(vec3(q.x*3.2, q.y*1.2 - t*.05, q.z*3.2) + 2.)) * smoothstep(bAB - .5, bAB, vP.y);
        mid = mix(mid, mix(top, mid, .35), clamp(cl*(.35 + .65*cloud) + thread*.55, 0., .9));
        vec3 col = mix(mix(bot, mid, tBC), top, tAB);
        // the textures carry their own light; add only the roundness and a darker edge
        vec3 L = normalize(vec3(-.6,.45,.65));
        float d = dot(vN, L)*.5 + .5;
        float rim = pow(1. - max(dot(vN, vV), 0.), 2.);
        col *= .8 + .32*d;
        col *= 1. - rim*.35;
        gl_FragColor = vec4(col, 1.);
        #include <colorspace_fragment>
      }`
  });
}
function foamMaterial(u){
  return new THREE.ShaderMaterial({
    uniforms: u,
    vertexShader: `varying vec2 vU; void main(){ vU = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform sampler2D tTop, tMid, tBot0, tBot1; uniform vec3 tintTop, tintMid; uniform float t, cloud, botMix, yAB, yBC, yTop, hasFruit; varying vec2 vU; ${NOISE}
      void main(){ float r = length(vU);
        // the surface shows whichever layer is on top right now
        vec3 m = texture2D(tTop, vU*.35 + .5).rgb * tintTop;
        vec3 mk = texture2D(tMid, vU*.35 + .5).rgb * tintMid;
        vec3 fr = mix(texture2D(tBot0, vU*.4 + .5).rgb, texture2D(tBot1, vU*.4 + .5).rgb, botMix);
        vec3 under = mix(mk, fr, step(yAB - yBC, .06) * hasFruit);
        m = mix(under, m, smoothstep(.03, .08, yTop - yAB));
        vec3 foam = mix(m, m*1.3 + vec3(.03,.04,.0), .45*smoothstep(.03,.08, yTop - yAB));
        float b = fbm3(vec3(vU*6., t*.05)); float bubbles = smoothstep(.62,.7, vn3(vec3(vU*40., 3.)));
        vec3 c = mix(foam*.9, foam*1.06, b); c = mix(c, foam*.78, bubbles*.5);
        c = mix(c, m*.85, smoothstep(.72,1., r));
        gl_FragColor = vec4(c,1.);
        #include <colorspace_fragment>
      }`
  });
}
function shadowTexture(){
  const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d");
  const r = g.createRadialGradient(64,64,4,64,64,64); r.addColorStop(0,"rgba(34,53,28,.42)"); r.addColorStop(.55,"rgba(34,53,28,.12)"); r.addColorStop(1,"rgba(34,53,28,0)");
  g.fillStyle = r; g.fillRect(0,0,128,128); return new THREE.CanvasTexture(c);
}
// the Layo print on the cup: the wordmark drawn into a canvas that wraps around the wall
function printTexture(svg){
  const c = document.createElement("canvas"); c.width = 2048; c.height = 400; const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const img = new Image();
  img.onload = () => { const g = c.getContext("2d"), h = 230, w = h*img.width/img.height; g.drawImage(img, 1024 - w/2, (400 - h)/2, w, h); tex.needsUpdate = true; };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  return tex;
}
// a white ceramic katakuchi: a round bowl with a pouring lip
function pitcher(){
  const g = new THREE.Group();
  const p = []; for (let i=0;i<=16;i++){ const a = i/16*Math.PI*.55; p.push(new THREE.Vector2(.02 + Math.sin(a)*.62, .62 - Math.cos(a)*.62)); }
  p.push(new THREE.Vector2(.6, .5)); p.push(new THREE.Vector2(.56, .5));
  for (let i=16;i>=0;i--){ const a = i/16*Math.PI*.55; p.push(new THREE.Vector2(.02 + Math.sin(a)*.56, .64 - Math.cos(a)*.56)); }
  const mat = new THREE.MeshPhysicalMaterial({color:0xf3efe7, roughness:.38, clearcoat:.5, clearcoatRoughness:.3, side:THREE.DoubleSide});
  const bowl = new THREE.Mesh(new THREE.LatheGeometry(p, 64), mat); g.add(bowl);
  const lip = new THREE.Mesh(new THREE.ConeGeometry(.16, .34, 24, 1, true, -Math.PI/2, Math.PI), mat); lip.rotation.z = Math.PI/2 + .25; lip.position.set(-.68, .46, 0); g.add(lip);
  const tea = new THREE.Mesh(new THREE.CircleGeometry(.5, 48), new THREE.MeshStandardMaterial({color:0x5c8a22, roughness:.5})); tea.rotation.x = -Math.PI/2; tea.position.y = .38; g.add(tea);
  g.userData.spout = new THREE.Vector3(-.82, .5, 0);
  return g;
}

export function createCup(canvas, opt = {}){
  let renderer;
  try { renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:"high-performance"}); }
  catch(e){ return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.NeutralToneMapping || THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(renderer), .04).texture;
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2c4, 1.1)); const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-3,5,4); scene.add(key);
  const cam = new THREE.PerspectiveCamera(opt.fov || 22, 1, .1, 50);
  const look = new THREE.Vector3(0, H*.5, 0);
  const root = new THREE.Group(); scene.add(root);
  const spin = new THREE.Group(); root.add(spin);

  const loader = new THREE.TextureLoader(), base = opt.base || "tex/";
  const texCache = {};
  const T = n => { if (texCache[n]) return texCache[n]; const t = loader.load(base + n + ".jpg"); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.MirroredRepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping; t.anisotropy = 4; return texCache[n] = t; };

  // cup
  const pts = [new THREE.Vector2(0, 0)];
  for (let i=0;i<=6;i++){ const a = Math.PI*1.5 + i/6*Math.PI*.5; pts.push(new THREE.Vector2(RB - .07 + Math.cos(a)*.07, .07 + Math.sin(a)*.07)); }
  pts.push(new THREE.Vector2(RT, H));
  for (let i=0;i<=8;i++){ const a = i/8*Math.PI; pts.push(new THREE.Vector2(RT + .018 + Math.cos(a)*.018, H + Math.sin(a)*.03)); }
  pts.push(new THREE.Vector2(RT - WALL, H)); pts.push(new THREE.Vector2(RB - WALL, .06)); pts.push(new THREE.Vector2(0, .05));
  const cupMat = new THREE.MeshPhysicalMaterial({color:0xffffff, roughness:.04, transparent:true, opacity:.14, depthWrite:false,
    clearcoat:1, clearcoatRoughness:.04, envMapIntensity:1.6, side:THREE.DoubleSide});
  const cup = new THREE.Mesh(new THREE.LatheGeometry(pts, 96), cupMat); cup.renderOrder = 2; spin.add(cup);
  const glintMat = new THREE.ShaderMaterial({transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    vertexShader:`varying vec3 vN; varying vec3 vV; varying float vY; void main(){ vec4 w = modelMatrix*vec4(position,1.); vN = normalize(mat3(modelMatrix)*normal); vV = normalize(cameraPosition - w.xyz); vY = position.y; gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader:`varying vec3 vN; varying vec3 vV; varying float vY;
      void main(){ vec3 r = reflect(-vV, vN); float x = r.x;
        float s = exp(-pow((x + .5)/.13, 2.))*.2 + exp(-pow((x - .6)/.08, 2.))*.08;
        s *= smoothstep(.08,.35, vY) * (1. - smoothstep(2.35, 2.62, vY));
        s += pow(1. - max(dot(vN, vV), 0.), 4.)*.12;
        gl_FragColor = vec4(vec3(s), s); }`});
  const glint = new THREE.Mesh(new THREE.LatheGeometry(pts.slice(0, 9), 96), glintMat); glint.scale.set(1.003,1,1.003); glint.renderOrder = 4; root.add(glint);

  // print: a band just outside the wall, front at u = .5
  if (opt.logo){
    const y0 = 1.45, y1 = 2.2, band = [];
    for (let i=0;i<=8;i++){ const y = y0 + (y1 - y0)*i/8; band.push(new THREE.Vector2(rAt(y) + .004, y)); }
    const pm = new THREE.MeshBasicMaterial({map:printTexture(opt.logo), transparent:true, opacity:.92, depthWrite:false, side:THREE.FrontSide});
    const print = new THREE.Mesh(new THREE.LatheGeometry(band, 128, Math.PI, Math.PI*2), pm); print.renderOrder = 3; spin.add(print);
  }

  // drink
  const u = { tTop:{value:T("matcha")}, tMid:{value:T("milk")}, tBot0:{value:T("puree-strawberry")}, tBot1:{value:T("puree-strawberry")}, botMix:{value:0},
    tintTop:{value:new THREE.Vector3(1,1,1)}, tintMid:{value:new THREE.Vector3(1,1,1)},
    yAB:{value:1.6}, yBC:{value:.8}, yTop:{value:2.2}, t:{value:0}, wob:{value:0}, hasFruit:{value:1}, cloud:{value:0} };
  const lp = [new THREE.Vector2(0, .07)]; const IN = WALL + .012;
  for (let i=0;i<=40;i++){ const y = .07 + (H - .07)*i/40; lp.push(new THREE.Vector2(rAt(y, IN) - (i===0 ? .05 : 0), y)); }
  const liq = new THREE.Mesh(new THREE.LatheGeometry(lp, 128), liquidMaterial(u)); spin.add(liq);
  const foam = new THREE.Mesh(new THREE.CircleGeometry(1, 96), foamMaterial(u)); foam.rotation.x = -Math.PI/2; spin.add(foam);

  const iceMat = new THREE.MeshPhysicalMaterial({color:0xffffff, roughness:.12, transparent:true, opacity:.5, envMapIntensity:1.6, clearcoat:1, clearcoatRoughness:.1, depthWrite:false});
  const iceGeo = new THREE.BoxGeometry(.34,.30,.34, 2,2,2);
  { const p = iceGeo.attributes.position; for (let i=0;i<p.count;i++){ const v = new THREE.Vector3().fromBufferAttribute(p,i); v.multiplyScalar(.9 + .1*Math.sin(v.x*20 + v.y*13 + v.z*7)); p.setXYZ(i, v.x, v.y, v.z); } iceGeo.computeVertexNormals(); }
  const ice = []; [[.32,.12,.6],[-.38,-.2,1.9],[.05,.42,3.3],[-.12,-.46,4.6]].forEach(([x,z,r]) => { const m = new THREE.Mesh(iceGeo, iceMat); m.userData = {x,z,r}; m.rotation.set(r, r*1.7, r*.6); spin.add(m); ice.push(m); });

  // pour: a stream (milk straight from above, matcha from the katakuchi) and fruit pieces
  const streamMat = new THREE.MeshStandardMaterial({color:0xffffff, roughness:.3});
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(.045,.03,1,20,1,true), streamMat); stream.visible = false; root.add(stream);
  const jug = opt.pitcher ? pitcher() : null; if (jug){ jug.visible = false; root.add(jug); }
  const bitGeo = new THREE.IcosahedronGeometry(.075, 1);
  { const p = bitGeo.attributes.position; for (let i=0;i<p.count;i++){ const v = new THREE.Vector3().fromBufferAttribute(p,i); v.multiply(new THREE.Vector3(1.15,.8,1)).multiplyScalar(.8 + .35*Math.abs(Math.sin(v.x*41 + v.y*23 + v.z*17))); p.setXYZ(i, v.x, v.y, v.z); } bitGeo.computeVertexNormals(); }
  const bits = [];
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2), new THREE.MeshBasicMaterial({map:shadowTexture(), transparent:true, depthWrite:false}));
  sh.rotation.x = -Math.PI/2; sh.position.y = .002; root.add(sh);

  const lv = { bc:{y:.07,v:0,t:.07}, ab:{y:.07,v:0,t:.07}, top:{y:.07,v:0,t:.07} };
  const tint = { top:new THREE.Vector3(1,1,1), mid:new THREE.Vector3(1,1,1) }, tintT = { top:new THREE.Vector3(1,1,1), mid:new THREE.Vector3(1,1,1) };
  let wob = 0, auto = opt.sway ?? .3, dragV = 0, slide = null, curFruit = "strawberry", fruitTarget = 1, botMixT = 0, cloudT = 0, pourJob = null;
  const lum = c => c.r*.2126 + c.g*.7152 + c.b*.0722;
  // keep the photo's own colour; only nudge brightness and a little hue towards the chosen ingredient
  const ratio = (hex, avg) => { const c = new THREE.Color(hex), k = lum(c)/lum(avg); const v = new THREE.Vector3(c.r/avg.r, c.g/avg.g, c.b/avg.b);
    return new THREE.Vector3(k + (Math.min(1.6, Math.max(.6, v.x)) - k)*.25, k + (Math.min(1.6, Math.max(.6, v.y)) - k)*.25, k + (Math.min(1.6, Math.max(.6, v.z)) - k)*.25); };

  function setFruit(id, instant){
    if (!id){ fruitTarget = 0; if (instant) u.hasFruit.value = 0; return; }
    fruitTarget = 1; if (instant) u.hasFruit.value = 1;
    if (id === curFruit && !instant) return; curFruit = id;
    if (instant){ u.tBot0.value = u.tBot1.value = T("puree-" + id); u.botMix.value = botMixT = 0; return; }
    // fade to the new purée in whichever slot is not showing
    if (botMixT < .5){ u.tBot1.value = T("puree-" + id); botMixT = 1; } else { u.tBot0.value = T("puree-" + id); botMixT = 0; }
  }
  // layers: {top, mid, fruit, bit}; levels: {bc, ab, top}
  function set(layers, levels, how = {}){
    tintT.top.copy(ratio(layers.top, MATCHA_AVG)); tintT.mid.copy(ratio(layers.mid, MILK_AVG));
    setFruit(layers.fruit, how.instant);
    if (levels){ lv.bc.t = levels.bc; lv.ab.t = levels.ab; lv.top.t = levels.top; }
    if (how.instant){ tint.top.copy(tintT.top); tint.mid.copy(tintT.mid); Object.values(lv).forEach(s => { s.y = s.t; s.v = 0; }); u.cloud.value = cloudT = 0; }
    if (how.drop && layers.fruit) dropFruit(layers.bit);
    if (how.milk) pourJob = {kind:"milk", t:0, dur:1.1, col:layers.mid};
    if (how.matcha){ pourJob = {kind:"matcha", t:0, dur:jug ? 2.6 : 1.2, col:layers.top}; cloudT = 1; }
    wob = Math.min(1, wob + (how.splash ?? .4));
  }
  function dropFruit(c){
    const m = new THREE.MeshPhysicalMaterial({map:T("puree-" + curFruit), color:0xffffff, roughness:.35, clearcoat:.6, clearcoatRoughness:.3});
    for (let i=0;i<10;i++){ const b = new THREE.Mesh(bitGeo, m); const a = Math.random()*6.28, r = Math.random()*.5;
      b.position.set(Math.cos(a)*r, H + .6 + i*.22, Math.sin(a)*r); b.scale.setScalar(.7 + Math.random()*.7); b.userData = {v:0, s:Math.random()*4}; root.add(b); bits.push(b); }
  }
  function swap(layers, levels){
    if (reduce){ set(layers, levels, {instant:true}); return; }
    if (slide && !slide.swapped){ slide.layers = layers; slide.levels = levels; return; }
    slide = {t:0, layers, levels, swapped:false};
  }

  let dragging = false, lx = 0;
  if (opt.drag){
    canvas.style.touchAction = "pan-y"; canvas.style.cursor = "grab";
    canvas.addEventListener("pointerdown", e => { dragging = true; lx = e.clientX; canvas.style.cursor = "grabbing"; });
    addEventListener("pointerup", () => { dragging = false; canvas.style.cursor = "grab"; });
    addEventListener("pointermove", e => { if (!dragging) return; const dx = e.clientX - lx; lx = e.clientX; dragV = dx*.012; spin.rotation.y += dx*.012; });
  }
  function resize(){
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); cam.aspect = w/h;
    const tan = Math.tan(cam.fov*Math.PI/360), dist = Math.max((H*(opt.fit || 1.3))/(2*tan), (RT*2.6)/(2*tan*cam.aspect));
    const el = opt.elev ?? .26;
    cam.position.set(0, look.y + Math.sin(el)*dist, Math.cos(el)*dist); cam.lookAt(look.x, look.y - (opt.lookDown ?? .08), look.z); cam.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas); resize();

  let visible = true, last = performance.now(), TT = 0;
  new IntersectionObserver(es => visible = es[0].isIntersecting).observe(canvas);
  const tmp = new THREE.Vector3();
  function frame(now){
    requestAnimationFrame(frame);
    const dt = Math.max(0, Math.min(.1, (now - last)/1000)); last = now; if (!visible) return; TT += dt;
    for (let s = 0, n = Math.ceil(dt/.016); s < n; s++){ const h = dt/n; Object.values(lv).forEach(L => { const a = (L.t - L.y)*30 - L.v*7.5; L.v += a*h; L.y += L.v*h; }); }
    wob = Math.min(1, wob*Math.pow(.18, dt));
    const k = 1 - Math.pow(.02, dt);
    tint.top.lerp(tintT.top, k); tint.mid.lerp(tintT.mid, k); u.tintTop.value.copy(tint.top); u.tintMid.value.copy(tint.mid);
    u.hasFruit.value += (fruitTarget - u.hasFruit.value)*k; u.botMix.value += (botMixT - u.botMix.value)*(1 - Math.pow(.05, dt));
    // clouds bloom while matcha is poured and settle over a few seconds
    cloudT *= Math.pow(.55, dt); u.cloud.value += (cloudT - u.cloud.value)*(1 - Math.pow(.1, dt));
    u.yBC.value = lv.bc.y; u.yAB.value = lv.ab.y; u.yTop.value = lv.top.y; u.t.value = TT; u.wob.value = wob;
    const ty = lv.top.y, r = rAt(ty, WALL + .012);
    foam.position.y = ty; foam.scale.setScalar(r); foam.visible = liq.visible = ty > .12;
    ice.forEach((m,i) => { const d = m.userData, rr = r*.62; m.position.set(d.x/.6*rr*.6, ty - .07 + Math.sin(TT*1.3 + i)*.012*(1 + wob*3), d.z/.6*rr*.6); m.rotation.y = d.r + Math.sin(TT*.4 + i)*.08; m.visible = ty > 1.0; });
    // pouring
    stream.visible = false; if (jug) jug.visible = false;
    if (pourJob){ const P = pourJob; P.t += dt; const p = P.t/P.dur;
      if (P.kind === "matcha" && jug){
        // the katakuchi comes in, tips, pours, and goes back
        const inn = Math.min(1, P.t/.45), out = Math.max(0, (P.t - (P.dur - .45))/.45), e = inn - out;
        jug.visible = true; jug.position.set(1.15 + (1 - e)*1.2, H + .95 + (1 - e)*.6, .1); jug.rotation.z = e*.95;
        jug.updateMatrixWorld(); tmp.copy(jug.userData.spout).applyMatrix4(jug.matrixWorld);
        if (e > .85 && p < .9){ stream.visible = true; streamMat.color.set(P.col); const top = tmp.y, x = tmp.x;
          stream.scale.y = top - ty; stream.position.set(x*.5, (top + ty)/2, 0); stream.rotation.z = Math.atan2(x, top - ty)*-1 + 0; cloudT = 1; wob = Math.min(1, wob + dt*1.2); }
      } else if (p < 1){ stream.visible = true; streamMat.color.set(P.col); const top = H + 1.8; stream.rotation.z = 0; stream.scale.y = top - ty; stream.position.set(.12, (top + ty)/2, 0); wob = Math.min(1, wob + dt*1.2); }
      if (P.t > P.dur) pourJob = null; }
    for (let i = bits.length - 1; i >= 0; i--){ const b = bits[i], d = b.userData;
      const inLiquid = b.position.y < ty; d.v += (inLiquid ? -2.5 : -14)*dt; if (inLiquid) d.v *= Math.pow(.02, dt);
      if (!d.hit && inLiquid){ d.hit = 1; wob = Math.min(1, wob + .12); }
      b.position.y += d.v*dt; b.rotation.x += dt*d.s; b.rotation.z += dt*d.s*.6;
      if (b.position.y < lv.bc.y - .05 || b.position.y < .15){ root.remove(b); bits.splice(i,1); } }
    if (slide){ slide.t += dt/1.5; const p = slide.t;
      if (p < .5){ const e = p/.5, ee = e*e; root.position.x = -ee*4.2; root.rotation.z = ee*.12; }
      else { if (!slide.swapped){ slide.swapped = true; set(slide.layers, slide.levels, {instant:true}); }
        const e = Math.min(1,(p - .5)/.5), ee = 1 - Math.pow(1 - e, 3); root.position.x = (1 - ee)*4.2; root.rotation.z = -(1 - ee)*.12; if (e >= 1){ slide = null; wob = .6; } } }
    // the cup sways gently so the print stays in view; a drag spins it and it eases back
    if (!dragging){ const target = reduce ? 0 : Math.sin(TT*.35)*auto; spin.rotation.y += dragV; dragV *= Math.pow(.05, dt);
      if (Math.abs(dragV) < .002){ const tw = Math.round(spin.rotation.y/(Math.PI*2))*Math.PI*2 + target; spin.rotation.y += (tw - spin.rotation.y)*(1 - Math.pow(.25, dt)); } }
    renderer.render(scene, cam);
  }
  requestAnimationFrame(frame);
  return { set, swap, H };
}
