// Layo 3D cup: a clear plastic cup with a layered drink inside.
// The drink is one lathe with a shader that paints the layers, the matcha bleeding into the milk,
// the fruit pulp and the light; the top is a foam disc; ice floats at the surface.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const H = 2.6, RT = 1.0, RB = 0.74, WALL = 0.035;
const rAt = (y, inset = 0) => RB + (RT - RB) * (y / H) - inset;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

const NOISE = `
float h31(vec3 p){ p = fract(p*vec3(.1031,.1030,.0973)); p += dot(p, p.yxz+33.33); return fract((p.x+p.y)*p.z); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x), mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x), f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x), mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x), f.y), f.z); }
float fbm3(vec3 p){ float v = 0., a = .5; for (int i=0;i<5;i++){ v += a*vn3(p); p = p*2.02 + 11.7; a *= .5; } return v; }
float vn(vec2 p){ return vn3(vec3(p, 0.)); }
float fbm(vec2 p){ return fbm3(vec3(p, 0.)); }`;

function liquidMaterial(u){
  return new THREE.ShaderMaterial({
    uniforms: u,
    vertexShader: `varying vec3 vP; varying vec3 vN; varying vec3 vV;
      void main(){ vP = position; vec4 w = modelMatrix*vec4(position,1.); vN = normalize(mat3(modelMatrix)*normal); vV = normalize(cameraPosition - w.xyz);
        gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `uniform vec3 cTop, cMid, cBot; uniform float yAB, yBC, yTop, t, wob, hasFruit;
      varying vec3 vP; varying vec3 vN; varying vec3 vV; ${NOISE}
      void main(){
        float a = atan(vP.z, vP.x);
        vec3 q = vP;
        if (vP.y > yTop + (sin(a*3.+t*2.3)*.006 + sin(a*5.-t*1.7)*.004)*(1.+min(wob,1.)*1.5)) discard;
        // matcha sinks into the milk in slow, uneven tongues
        float n1 = fbm3(vec3(q.x*1.4, q.y*1.1 - t*.04, q.z*1.4));
        float bAB = yAB + (n1-.5)*.42 + (fbm3(q*vec3(5.,2.,5.) - t*.03)-.5)*.12;
        float n2 = fbm3(q*vec3(3.,4.,3.) + 4.);
        float bBC = yBC + (n2-.5)*.12;
        float tAB = smoothstep(-.07,.05, vP.y - bAB);
        float tBC = smoothstep(-.02,.02, vP.y - bBC);
        // milk: creamy, cooler where ice sits, green threads hanging down from the matcha
        vec3 mid = cMid * (.94 + .08*fbm3(q*2.5));
        float thread = smoothstep(.56,.8, fbm3(vec3(q.x*3.2, q.y*1.2 - t*.05, q.z*3.2) + 2.)) * smoothstep(bAB-.6, bAB, vP.y);
        mid = mix(mid, mix(cTop, cMid, .45), thread*.85);
        float iceSh = smoothstep(.62,.78, vn3(q*vec3(2.6,3.2,2.6) + 7.)) * smoothstep(bBC+.1, bAB, vP.y);
        mid = mix(mid, mid*.86 + vec3(.02,.03,.04), iceSh*.6);
        // fruit purée: pulp clumps, juice streaks, seeds
        vec3 bot = cBot;
        float pulp = fbm3(q*vec3(6.,7.,6.) + 1.);
        bot = mix(bot*1.18, bot*.66, smoothstep(.3,.75,pulp));
        float clump = smoothstep(.62,.7, vn3(q*vec3(9.,10.,9.) + 3.));
        bot = mix(bot, bot*.55, clump*.55);
        float seeds = smoothstep(.9,.93, vn3(q*38.));
        bot = mix(bot, vec3(.92,.86,.6)*bot, seeds);
        bot = mix(cMid, bot, hasFruit);
        // matcha: deep green, lighter where it is frothy near the top
        vec3 top = cTop * (.82 + .3*fbm3(q*vec3(3.,5.,3.) + t*.02));
        top = mix(top, cTop*1.12, smoothstep(yTop-.12, yTop, vP.y)*.5);
        vec3 col = mix(mix(bot, mid, tBC), top, tAB);
        // light: soft key from the upper left, a darker right side, a little rim
        vec3 L = normalize(vec3(-.6,.45,.65));
        float d = dot(vN, L)*.5 + .5;
        float rim = pow(1. - max(dot(vN, vV), 0.), 2.2);
        col *= .62 + .55*d;
        col = mix(col, col*.8, rim*.5);   // more liquid to look through at the edge reads darker
        col *= .9 + .1*smoothstep(.0,.4, vP.y);
        gl_FragColor = vec4(col, 1.);
        #include <colorspace_fragment>
      }`
  });
}
function foamMaterial(u){
  return new THREE.ShaderMaterial({
    uniforms: u, transparent: false,
    vertexShader: `varying vec2 vU; void main(){ vU = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform vec3 cTop; uniform float t; varying vec2 vU; ${NOISE}
      void main(){ float r = length(vU);
        vec3 foam = mix(cTop, vec3(1.), .32);
        float b = fbm(vU*7. + t*.05); float bubbles = smoothstep(.62,.7, vn(vU*38. + 3.));
        vec3 c = mix(foam*.92, foam*1.05, b); c = mix(c, foam*.8, bubbles*.5);
        c = mix(c, cTop*.85, smoothstep(.75,1., r));   // the edge meets the cup a little darker
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

export function createCup(canvas, opt = {}){
  let renderer;
  try { renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:"high-performance"}); }
  catch(e){ return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.NeutralToneMapping || THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), .04).texture;
  const cam = new THREE.PerspectiveCamera(opt.fov || 22, 1, .1, 50);
  const look = new THREE.Vector3(0, H*.5, 0);
  const root = new THREE.Group(); scene.add(root);
  const spin = new THREE.Group(); root.add(spin);

  // cup: outer and inner wall of a thin clear plastic cup with a rolled lip
  const pts = [];
  pts.push(new THREE.Vector2(0, 0));
  for (let i=0;i<=6;i++){ const a = Math.PI*1.5 + i/6*Math.PI*.5; pts.push(new THREE.Vector2(RB - .07 + Math.cos(a)*.07, .07 + Math.sin(a)*.07)); }
  pts.push(new THREE.Vector2(RT, H));
  for (let i=0;i<=8;i++){ const a = i/8*Math.PI; pts.push(new THREE.Vector2(RT + .018 - Math.cos(a)*.018*-1 + .0, H + Math.sin(a)*.03)); }
  pts.push(new THREE.Vector2(RT - WALL, H)); pts.push(new THREE.Vector2(RB - WALL, .06)); pts.push(new THREE.Vector2(0, .05));
  const cupGeo = new THREE.LatheGeometry(pts, 96);
  // thin clear plastic: mostly see-through, with glossy reflections that grow at grazing angles
  const cupMat = new THREE.MeshPhysicalMaterial({color:0xffffff, metalness:0, roughness:.04, transparent:true, opacity:.14, depthWrite:false,
    clearcoat:1, clearcoatRoughness:.04, envMapIntensity:1.6, side:THREE.DoubleSide, ior:1.46, specularIntensity:1});
  const cup = new THREE.Mesh(cupGeo, cupMat); cup.renderOrder = 2; root.add(cup);
  // two tall softbox reflections, fixed to the camera side like in a studio
  const glintMat = new THREE.ShaderMaterial({transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    vertexShader:`varying vec3 vN; varying vec3 vV; varying float vY; void main(){ vec4 w = modelMatrix*vec4(position,1.); vN = normalize(mat3(modelMatrix)*normal); vV = normalize(cameraPosition - w.xyz); vY = position.y; gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader:`varying vec3 vN; varying vec3 vV; varying float vY;
      void main(){ vec3 r = reflect(-vV, vN); float x = r.x;
        float s = exp(-pow((x + .5)/.13, 2.))*.22 + exp(-pow((x - .6)/.08, 2.))*.09;
        s *= smoothstep(.08,.35, vY) * (1. - smoothstep(2.35, 2.62, vY));
        s += pow(1. - max(dot(vN, vV), 0.), 4.)*.12;
        gl_FragColor = vec4(vec3(s), s); }`});
  const glint = new THREE.Mesh(new THREE.LatheGeometry(pts.slice(0, 9), 96), glintMat); glint.scale.set(1.003,1,1.003); glint.renderOrder = 3; root.add(glint);

  // drink
  const u = { cTop:{value:new THREE.Color("#7fa34a")}, cMid:{value:new THREE.Color("#ece0c8")}, cBot:{value:new THREE.Color("#d9586b")},
    yAB:{value:1.6}, yBC:{value:.8}, yTop:{value:2.2}, t:{value:0}, wob:{value:0}, hasFruit:{value:1} };
  const lp = []; const IN = WALL + .012;
  for (let i=0;i<=40;i++){ const y = .07 + (H - .07)*i/40; lp.push(new THREE.Vector2(rAt(y, IN) - (i===0 ? .05 : 0), y)); }
  lp.unshift(new THREE.Vector2(0, .07));
  const lm = liquidMaterial(u); lm.side = THREE.DoubleSide; const liq = new THREE.Mesh(new THREE.LatheGeometry(lp, 128), lm); spin.add(liq);
  const foam = new THREE.Mesh(new THREE.CircleGeometry(1, 96), foamMaterial(u)); foam.rotation.x = -Math.PI/2; spin.add(foam);

  // ice: a few clear cubes floating at the surface
  const iceMat = new THREE.MeshPhysicalMaterial({color:0xffffff, roughness:.12, transparent:true, opacity:.5, envMapIntensity:1.6, clearcoat:1, clearcoatRoughness:.1, depthWrite:false});
  const iceGeo = new THREE.BoxGeometry(.34,.30,.34, 2,2,2);
  { const p = iceGeo.attributes.position; for (let i=0;i<p.count;i++){ const v = new THREE.Vector3().fromBufferAttribute(p,i); const k = .9 + .1*Math.sin(v.x*20 + v.y*13 + v.z*7); v.multiplyScalar(k); p.setXYZ(i, v.x, v.y, v.z); } iceGeo.computeVertexNormals(); }
  const ice = []; [[.32,.12,.6],[-.38,-.2,1.9],[.05,.42,3.3],[-.12,-.46,4.6]].forEach(([x,z,r]) => { const m = new THREE.Mesh(iceGeo, iceMat); m.userData = {x,z,r}; m.rotation.set(r, r*1.7, r*.6); spin.add(m); ice.push(m); });

  // a stream of milk or matcha, and fruit pieces that drop in
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(.05,.035,1,24,1,true), new THREE.MeshStandardMaterial({color:0xffffff, roughness:.35}));
  stream.visible = false; root.add(stream);
  const bitGeo = new THREE.IcosahedronGeometry(.065, 1);
  const bits = [];

  const sh = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2), new THREE.MeshBasicMaterial({map:shadowTexture(), transparent:true, depthWrite:false}));
  sh.rotation.x = -Math.PI/2; sh.position.y = .002; root.add(sh);

  // state: three levels on damped springs, colours that blend, a wobble that decays
  const lv = { bc:{y:.07,v:0,t:.07}, ab:{y:.07,v:0,t:.07}, top:{y:.07,v:0,t:.07} };
  const col = { top:u.cTop.value, mid:u.cMid.value, bot:u.cBot.value };
  const target = { top:new THREE.Color().copy(col.top), mid:new THREE.Color().copy(col.mid), bot:new THREE.Color().copy(col.bot), fruit:1 };
  let wob = 0, streamFor = 0, streamCol = new THREE.Color(), auto = opt.spin ?? .12, dragV = 0, slide = null;

  function set(layers, levels, how = {}){
    target.top.set(layers.top); target.mid.set(layers.mid); target.bot.set(layers.bot || layers.mid); target.fruit = layers.bot ? 1 : 0;
    if (levels){ lv.bc.t = levels.bc; lv.ab.t = levels.ab; lv.top.t = levels.top; }
    if (how.instant){ col.top.copy(target.top); col.mid.copy(target.mid); col.bot.copy(target.bot); u.hasFruit.value = target.fruit; Object.values(lv).forEach(s => { s.y = s.t; s.v = 0; }); }
    if (how.drop && layers.bot) dropFruit(layers.bit || layers.bot);
    if (how.stream) { streamFor = .9; streamCol.set(how.stream); stream.material.color.copy(streamCol); }
    wob = Math.min(1.2, wob + (how.splash ?? .5));
  }
  function dropFruit(c){
    const m = new THREE.MeshStandardMaterial({color:c, roughness:.45});
    for (let i=0;i<10;i++){ const b = new THREE.Mesh(bitGeo, m); const a = Math.random()*6.28, r = Math.random()*.5;
      b.position.set(Math.cos(a)*r, H + .6 + i*.22, Math.sin(a)*r); b.scale.setScalar(.7 + Math.random()*.7); b.userData = {v:0, s:Math.random()*4}; root.add(b); bits.push(b); }
  }
  // the hero swaps drinks by sliding the cup out and a new one in, never by changing colour in place
  function swap(layers, levels){
    if (reduce){ set(layers, levels, {instant:true}); return; }
    if (slide && !slide.swapped){ slide.layers = layers; slide.levels = levels; return; }
    slide = {t:0, layers, levels, swapped:false};
  }

  // drag to turn the cup
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
    // fit the cup in height (and width on narrow canvases)
    const dist = Math.max((H*(opt.fit || 1.3))/(2*Math.tan(cam.fov*Math.PI/360)), (RT*2.6)/(2*Math.tan(cam.fov*Math.PI/360)*cam.aspect));
    const el = opt.elev ?? .26;
    cam.position.set(0, look.y + Math.sin(el)*dist, Math.cos(el)*dist); cam.lookAt(look.x, look.y - (opt.lookDown ?? .08), look.z); cam.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas); resize();

  let visible = true, last = performance.now(), T = 0;
  new IntersectionObserver(es => visible = es[0].isIntersecting).observe(canvas);
  function frame(now){
    requestAnimationFrame(frame);
    const dt = Math.max(0, Math.min(.1, (now - last)/1000)); last = now; if (!visible) return; T += dt;
    // springs
    for (let k2 = 0, n = Math.ceil(dt/.016); k2 < n; k2++){ const h = dt/n; Object.values(lv).forEach(s => { const a = (s.t - s.y)*30 - s.v*7.5; s.v += a*h; s.y += s.v*h; }); }
    wob = Math.min(1, wob*Math.pow(.18, dt));
    const k = 1 - Math.pow(.02, dt);
    col.top.lerp(target.top, k); col.mid.lerp(target.mid, k); col.bot.lerp(target.bot, k); u.hasFruit.value += (target.fruit - u.hasFruit.value)*k;
    u.yBC.value = lv.bc.y; u.yAB.value = lv.ab.y; u.yTop.value = lv.top.y; u.t.value = T; u.wob.value = wob;
    const ty = lv.top.y, r = rAt(ty, WALL + .012);
    foam.position.y = ty; foam.scale.setScalar(r); foam.visible = ty > .12;
    ice.forEach((m,i) => { const d = m.userData, rr = r*.62; m.position.set(d.x/.6*rr*.6, ty - .07 + Math.sin(T*1.3 + i)*.012*(1 + wob*3), d.z/.6*rr*.6); m.rotation.y = d.r + Math.sin(T*.4 + i)*.08; m.visible = ty > 1.0; });
    // stream
    if (streamFor > 0){ streamFor -= dt; stream.visible = true; const top = H + 1.6, bot = ty; stream.scale.y = top - bot; stream.position.set(.15, (top + bot)/2, 0); wob = Math.min(1.2, wob + dt*1.5); }
    else stream.visible = false;
    // fruit bits fall, slow down in the liquid and sink into the purée
    for (let i = bits.length - 1; i >= 0; i--){ const b = bits[i], d = b.userData;
      const inLiquid = b.position.y < ty; d.v += (inLiquid ? -2.5 : -14)*dt; if (inLiquid) d.v *= Math.pow(.02, dt);
      if (!d.hit && inLiquid){ d.hit = 1; wob = Math.min(1.3, wob + .12); }
      b.position.y += d.v*dt; b.rotation.x += dt*d.s; b.rotation.z += dt*d.s*.6;
      if (b.position.y < lv.ab.y - .1){ b.material.opacity = 1; root.remove(b); bits.splice(i,1); } }
    // hero slide: out to the left, swap while hidden, in from the right
    if (slide){ slide.t += dt/1.5; const p = slide.t;
      if (p < .5){ const e = p/.5, ee = e*e; root.position.x = -ee*4.2; root.rotation.z = ee*.12; }
      else { if (!slide.swapped){ slide.swapped = true; set(slide.layers, slide.levels, {instant:true}); }
        const e = Math.min(1,(p - .5)/.5), ee = 1 - Math.pow(1 - e, 3); root.position.x = (1 - ee)*4.2; root.rotation.z = -(1 - ee)*.12; if (e >= 1){ slide = null; wob = .6; } } }
    if (!dragging){ spin.rotation.y += (reduce ? 0 : auto)*dt + dragV; dragV *= Math.pow(.05, dt); }
    renderer.render(scene, cam);
  }
  requestAnimationFrame(frame);
  return { set, swap, H };
}
