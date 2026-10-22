> Статус: собрано исследователем 22.10.2026. Каждый факт взят с открытой страницы, её URL стоит в скобках или в списке в конце. Выводы и советы без источника помечены «(не проверено)». Файл дополняет `3d-pipeline.md` (кто что делает), но не заменяет его. Правила Вероники (taste.md, balance-matrix.md) важнее этого файла.

# 3D, WebGL и шейдеры для премиального маркетингового сайта

Главная мысль: 3D оправдан, когда объясняет продукт, задаёт настроение бренда или даёт ощущение «живого» материала. Когда он просто «крутится», это трюк. Почти любой эффект ниже делается одним полноэкранным или карточным квадом (plane) и фрагментным шейдером, без тяжёлой сцены.

---

## 1. Какой инструмент выбрать

| Задача | Инструмент | Почему |
|---|---|---|
| 1 эффект на картинке (hover, depth-параллакс, градиентный фон) | чистый WebGL или OGL | Квад на чистом WebGL — это 4 вершины и буфер (Codrops, Artiukh 2019). OGL весит 8 kb Core / 29 kb всё вместе, minzip (README OGL) |
| Продукт GLB, свет, отражения, постобработка | three.js | Загрузчики glTF/Draco/KTX2, PMREM, RoomEnvironment есть в addons (docs three.js) |
| Дизайнер собирает сцену руками | Spline → экспорт | Экспорт в Vanilla JS, Three.js, React, Next.js, r3f; анимации и события работают только в Vanilla JS и React (docs Spline) |
| Просто покрутить товар, AR, минимум кода | `<model-viewer>` | poster, lazy-загрузка, Draco/KTX2-декодеры подгружаются по требованию (modelviewer.dev) |
| Проект на React | React Three Fiber | uniforms через `useMemo`, анимация в `useFrame` (Maxime Heckel) |

- OGL описывает себя так: «tightly coupled with WebGL and comes with much fewer features», API похож на three.js (README OGL). Хорошо подходит, когда пишем свои шейдеры, а сцены и загрузчики не нужны.
- Spline по умолчанию рисует через WebGPU и сам падает обратно на WebGL, если WebGPU нет (docs Spline, Exporting as Code).
- Для нашего стека (чистый HTML/CSS): one-off эффект пишем на OGL или чистом WebGL, продукт показываем на three.js через ES-модули/importmap, React не используем (не проверено).

---

## 2. Каталог эффектов: где уместно, где трюк

### 2.1 Искажение картинки на hover (displacement / RGB-shift)
- **Как устроено.** Либо шейдер на плоскости картинки (переход между двумя изображениями по карте смещения, Codrops 2018 — по выдаче поиска, не открывалось), либо пост-проход по всему экрану. Во втором случае рендер three.js — «just another image», поверх него `EffectComposer` + `ShaderPass`, и каналы R/G/B берутся со сдвигом по скорости мыши (Codrops, Artiukh 2020).
- **Синхронизация с DOM.** Пробегаем по `.js-image`, читаем `getBoundingClientRect()`, прячем `<img>` и ставим в 3D-сцену плоскость того же размера. Пересчёт: ширина объекта = px × (ширинаПлоскости / ширинаЭкрана) (Codrops 2020).
- **Уместно:** портфолио студий, фэшн, галереи, где картинка и есть продукт.
- **Трюк:** каталог e-commerce, меню ресторана, любые страницы, где картинку надо рассмотреть. Сильный RGB-сдвиг выглядит как «2019 год на Awwwards» (не проверено).
- **Мера:** смещение 2–5% от размера, затухание за 300–600 мс (не проверено).

### 2.2 Depth-map параллакс («fake 3D photo»)
- **Рецепт.** Рисуем ч/б карту глубины: чем ближе к камере, тем светлее. Во фрагментном шейдере пишем `texture2D(originalImage, uv + mouse*depth.r)`: светлые пиксели двигаются с мышью, тёмные остаются на месте. Это чистый WebGL без библиотек (Codrops, Artiukh 2019).
- **Уместно:** hero с фото интерьера, пейзажа или продукта на чистом фоне, отели, винодельни.
- **Трюк:** портреты (рвутся края лица), сильное смещение. На мобильных мыши нет, поэтому привязываем к скроллу или гироскопу либо отключаем (не проверено).
- Карту глубины можно рисовать вручную в Photoshop (Codrops 2019) или генерировать нейросетью (не проверено).

### 2.3 Turntable продукта (GLB)
- three.js рекомендует glTF (.glb/.gltf): формат «focused on runtime asset delivery, compact to transmit and fast to load» (manual, Loading 3D Models).
- Для металла и стекла обязательно нужен environment map, иначе PBR-материалам нечего отражать (см. §4).
- Статичный turntable, который крутят мышью, рисуем по запросу, а не в постоянном цикле (manual, Rendering on Demand, §5).
- **Уместно:** ювелирка, косметика (флакон), гаджеты, мебель: когда форма и материал продают.
- **Трюк:** если товар плоский (одежда, текстиль, еда), фото и видео покажут его лучше (не проверено).

### 2.4 Частицы
- Частицы — это `points = geometry + material`. Позиции хранятся в `Float32Array(count*3)` (Maxime Heckel, Particles).
- Если обновлять массив позиций на CPU в каждом кадре, это «pretty expensive». Движение лучше перенести в вершинный шейдер. Для сотен тысяч частиц используют FBO: симуляция позиций идёт во фрагментном шейдере и пишется в текстуру (Maxime Heckel).
- **Уместно:** одна сцена-метафора (дым над кофе, пыльца, звёзды у бренда про ночь), морфинг логотипа.
- **Трюк:** «облако точек ради облака», частицы под текстом, которые мешают читать (не проверено).

### 2.5 Шейдерный фон: градиент, шум, «жидкость»
- Шейдер — это функция «позиция → цвет», которая выполняется для каждого пикселя параллельно (Book of Shaders, гл. 1).
- Органичная случайность получается из шума. Value noise выглядит «блочно», gradient noise (Perlin, 1985) мягче, simplex noise (2001) ещё лучше. Плавность даёт `smoothstep` или квинтическая кривая `6x^5-15x^4+10x^3` (Book of Shaders, гл. 11). Анимируем через uniform времени `u_time` (Book of Shaders, Maxime Heckel).
- Анимированный mesh-gradient в духе Stripe — WebGL-эффект; в треде форума GSAP пишут, что он «uses a lot of battery» (поиск, тред не открывался; не проверено).
- **Уместно:** SaaS, финтех, wellness, ароматы: фон медленный, низкоконтрастный и за текстом.
- **Трюк:** быстрые кислотные переливы, фон, который спорит с заголовком.
- **Дёшево:** рендерить фон в уменьшенный буфер (MDN, §5); при reduced-motion показывать один статичный кадр (не проверено).

### 2.6 Переходы между страницами и картинками
- Codrops описывает приём: canvas three.js не пересоздаётся при навигации Barba.js, камера едет по X от одной модели к другой (Codrops, Mael Ruffini, по пересказу Abduzeedo; не открывалось, не проверено).
- Переходы между изображениями делаются шейдером на полноэкранной плоскости (Codrops «Creative WebGL Image Transitions», найдено поиском, не открывалось).
- **Уместно:** портфолио, кейсы студии, лукбук.
- **Трюк:** лендинг с одной целевой кнопкой. Переход длиннее ~800 мс мешает навигации (не проверено).

---

## 3. Пайплайн ассета: Blender/Spline → glTF → сжатие → three.js

1. **Моделирование.** glTF экспортируют Blender, Substance Painter, Cinema 4D, Houdini и другие (manual, Loading 3D Models). В курсе three.js journey (Bruno Simon) есть отдельная глава Portal Scene: «Creating a scene in Blender» → «Baking and exporting» → «Importing and optimizing» (threejs-journey.com/lessons). Запекание света в текстуру — главный способ получить «дорогой» свет почти бесплатно (не проверено).
2. **Spline.** В Performance-панели смотрим размер экспорта, полигоны, материалы, свет, текстуры. Советы Spline (docs Spline, How to optimize):
   - не больше 3 уровней subdivision (обычно хватает 1–2);
   - меньше 3 источников света;
   - повторяющиеся объекты делаем компонентами и инстансами: 1 компонент и 100 инстансов хранят одну геометрию;
   - материалы-ассеты вместо копий материала на каждом объекте;
   - включить Compression → Geometry Quality «Performance»; сжатие картинок иногда уменьшает файл в 4 раза;
   - 1–2 встраивания на страницу, не больше 3; `spline-viewer` вместо iframe, потому что он умеет lazy-loading; не делать несколько полноэкранных встраиваний.
3. **Проверка.** `gltf-transform inspect input.glb` показывает, где тяжело: геометрия, текстуры, «too many draw calls» (gltf-transform.dev/cli).
4. **Сжатие одной командой:** `gltf-transform optimize input.glb output.glb --compress draco --texture-compress webp`. Значения по умолчанию подходят не всем сценам, смотрим `optimize -h` (gltf-transform.dev/cli). Отдельные команды: `draco`, `meshopt` (сжимает ещё и анимацию), `simplify`, `weld`, `resize`, `etc1s`, `uastc`, `webp`, `avif`.
5. **Draco (геометрия).** Сжатая геометрия «significantly smaller, at the cost of additional decoding time on the client» (docs DRACOLoader). Создаём один экземпляр `DRACOLoader` и переиспользуем его. Декодер весит больше 100 КБ, поэтому Draco имеет смысл, только если экономия больше размера декодера (modelviewer.dev). Для мелкой модели в 300 КБ Draco не нужен (не проверено).
6. **KTX2 / Basis Universal (текстуры).** JPG и PNG GPU не умеет читать напрямую: их распаковывают в полный размер в видеопамяти. KTX2 перекодируется на устройстве в родной сжатый формат GPU. ETC1S даёт минимальный размер, UASTC — качество, подходит для normal maps (пресс-релиз Khronos, 2021). MDN подтверждает: сжатые форматы GPU занимают меньше видеопамяти и быстрее читаются, но по качеству хуже JPG (MDN, WebGL best practices). В three.js: `KTX2Loader().setTranscoderPath(...)`, затем `.detectSupport(renderer)` перед загрузкой; нужен WASM (docs KTX2Loader).
7. **Правило выбора (не проверено):** цветовые текстуры → ETC1S или WebP; normal/roughness → UASTC; hero-модель целиком ≤ 3–5 МБ (как в `3d-pipeline.md`).

---

## 4. Свет и окружение для реализма

- **Минимальный «студийный» свет без HDR-файла:** `const env = new RoomEnvironment(); scene.environment = new THREE.PMREMGenerator(renderer).fromScene(env).texture;` (docs RoomEnvironment). Класс взят из model-viewer.
- PMREM — это предфильтрованная mip-карта окружения: шероховатый материал берёт размытый уровень, глянцевый — чёткий (docs PMREMGenerator). Генератор фактически статический, второй экземпляр не нужен. Для кубической карты идеален вход 256×256.
- **HDR-окружение** даёт лучший свет ценой производительности и веса. Берём минимальное разрешение; если окружение не служит фоном, разрешение можно сильно снизить, и пользователь не заметит (three.js journey, Realistic render).
- **Tone mapping** переводит HDR в LDR и делает картинку реалистичной; яркость регулирует `renderer.toneMappingExposure`. В новых версиях интенсивность окружения задаётся через `scene.environmentIntensity` (three.js journey, Realistic render).
- Премиальный приём: мягкий RoomEnvironment, один ключевой свет с тенью или запечённая тень-«подложка» под объектом, нейтральный фон в цвет страницы (не проверено).

---

## 5. Бюджет производительности

**Цель:** 60 fps минимум. Ограничений два: CPU и GPU. Тестировать на нескольких устройствах, включая мобильные; следить за весом сайта (three.js journey, Performance tips).

| Параметр | Ориентир | Источник |
|---|---|---|
| Draw calls | «the less draw calls you have, the better»; смотреть Spector.js и `renderer.info` | three.js journey |
| Много объектов | merge геометрии: 19 000 боксов дали меньше 20 fps, после `mergeGeometries` стало 60 fps | manual, Optimize Lots of Objects |
| Батчинг | 1000 спрайтов рисовать одним `drawArrays`; текстурные атласы | MDN |
| DPR | при DPR 3 пикселей в 9 раз больше. `setPixelRatio(devicePixelRatio)` «strongly NOT RECOMMENDED», лучше считать размер вручную и ограничивать потолок (пример: maxPixelCount = 3840×2160) | manual, Responsive |
| Задний буфер | рендерить в меньший canvas.width/height при прежнем CSS-размере | MDN |
| Видеопамять | считать per-pixel VRAM budget (приём команды Google Maps) | MDN |
| Mipmaps | для 3D-текстур: всего +30% памяти, часто сильный выигрыш; для 2D без уменьшения не нужны | MDN |
| Шейдер | переносить работу во вершинный шейдер, потому что фрагментный выполняется намного чаще | MDN |
| `alpha:false` | избегать, на некоторых платформах дорого; лучше писать alpha = 1.0 | MDN |
| Рабочие цифры (не проверено) | DPR ≤ 1.5 на мобильных, ≤ 2 на десктопе; < 100 draw calls; текстуры ≤ 2K (1K на мобильных); ≤ 50 тыс. полигонов на hero-модель | — |

**Не рендерить зря:**
- Если ничего не движется, рисовать только по изменению: загрузка, `controls` 'change', resize. С `enableDamping` использовать флаг `renderRequested` и rAF, иначе получится бесконечный цикл (manual, Rendering on Demand).
- При `visibilitychange` → `hidden` останавливать UI-обновления и фоновые задачи (MDN visibilitychange).
- Когда canvas уходит с экрана, ставить цикл на паузу через `IntersectionObserver` (не проверено, стандартная практика).
- Тяжёлую инициализацию можно перенести в worker: `canvas.transferControlToOffscreen()`. Анимация в worker не дёргается, даже когда главный поток занят (web.dev, OffscreenCanvas).

**Память:** geometry, material, texture и render target не освобождаются сами. Нужно вызывать `.dispose()` у каждого; `material.dispose()` текстуры не освобождает (manual, How to dispose). Для ImageBitmap дополнительно нужен `close()`. WebGL-контексты, которые больше не нужны, можно освободить заранее через `WEBGL_lose_context`, но не в обработчике unload (MDN).

---

## 6. Фолбэки: мобильные, без GPU, без WebGL

- **Проверка до старта:** `WebGL.isWebGL2Available()` из `three/addons/capabilities/WebGL.js`. Если `false`, показываем `getWebGL2ErrorMessage()` (manual, WebGL Compatibility Check). Для маркетингового сайта вместо сообщения об ошибке показываем постер или видео (не проверено).
- **Потеря контекста:** слушать `webglcontextlost` на canvas; проверить можно через `WEBGL_lose_context.loseContext()` (MDN). При потере прятать canvas и показывать постер (не проверено).
- **Постер прежде всего:** model-viewer показывает poster, пока модель не загрузилась, а модель может грузиться только после действия пользователя. Для страниц со многими моделями это рекомендуется прямо: «load them after user action» (modelviewer.dev, Lazy Loading). Тот же паттерн годится для three.js: `<img>`/AVIF-кадр рендера стоит в HTML, сцена подгружается lazy (не проверено).
- **Слабое устройство (не проверено):** эвристики `navigator.hardwareConcurrency <= 4`, `deviceMemory <= 4`, `saveData`, плюс замер fps в первые 2 секунды. Если меньше 45 fps, снижаем DPR, потом выключаем постобработку, потом ставим постер.
- **Headless без GPU** (наш Chromium здесь) WebGL может не поднять. Скриншоты для QA делаем с фолбэком и отдельно смотрим на реальном устройстве Вероники (не проверено).

---

## 7. Доступность

- `prefers-reduced-motion: reduce` означает, что человек просит убрать, уменьшить или заменить анимации. Масштабирование и панорамирование больших объектов могут вызвать вестибулярный дискомфорт (MDN prefers-reduced-motion). При `reduce`: фон-шейдер показывает статичный кадр, turntable не крутится сам, параллакс выключен (не проверено).
- Canvas для скринридера пустой. Текст и CTA должны жить в DOM, а не внутри WebGL. Codrops-подход с картинками прячет `<img>` через `visibility:hidden` (Codrops 2020), поэтому нужно сохранить alt-смысл, например `aria-label` на контейнере (не проверено).
- У model-viewer есть атрибут `alt` для описания модели (найдено поиском во вторичных источниках, официальная страница не открывалась; не проверено).
- Управление моделью должно работать с клавиатуры либо не быть единственным способом увидеть товар: рядом нужны фото (не проверено).
- Контраст текста поверх шейдерного фона проверяем на самом светлом кадре анимации (не проверено).

---

## 8. Чек-лист решения «нужен ли 3D»

1. **Зачем?** 3D объясняет продукт (форма, материал, механизм) или передаёт характер бренда? Если ни то ни другое, не нужен.
2. **Балансы** (balance-matrix): при вау < 60 берём максимум один лёгкий шейдерный акцент; полноценную сцену оставляем для вау ≥ 60.
3. **Есть ли ассет?** Нужна чистая GLB или фото с местом для карты глубины. Нет ассета → нет 3D, генерацию обсуждаем отдельно.
4. **Самый лёгкий вариант?** CSS/видео → чистый WebGL/OGL-квад → three.js → Spline. Берём первый, который решает задачу.
5. **Бюджет:** JS-движок + модель + текстуры укладываются в ≤ 3–5 МБ; LCP-элемент — HTML-постер, а не canvas (не проверено).
6. **Рендер:** по требованию или с паузой вне экрана и при `hidden`; DPR ограничен.
7. **Фолбэк:** постер в HTML; есть проверки на WebGL2, context lost и reduced-motion.
8. **Доступность:** текст в DOM, alt/aria, контраст, 3D не единственный носитель информации.
9. **Тест:** iPhone Вероники и слабый Android, проверить fps, нагрев и батарею (не проверено).
10. **Вкус:** один 3D-момент на страницу, а не на каждой секции. Если эффект замечают раньше продукта, его стоит убрать (не проверено).

---

## 9. Учиться дальше
- The Book of Shaders: гл. 5 Shaping functions, гл. 11 Noise.
- Maxime Heckel: «The Study of Shaders with React Three Fiber» (uniforms, varyings, attributes, memo для uniforms) и «The magical world of Particles…» (FBO).
- three.js journey: уроки 24 Environment map, 25 Realistic render, 27–28 Shaders, 46 Performance tips, 49–51 Blender bake.
- Codrops: тег webgl, авторы Yuri Artiukh и другие.

## Открытые URL (прочитаны)
- https://threejs.org/manual/pages/rendering-on-demand.html
- https://threejs.org/manual/pages/responsive.html
- https://threejs.org/manual/pages/how-to-dispose-of-objects.html
- https://threejs.org/manual/pages/optimize-lots-of-objects.html
- https://threejs.org/manual/pages/webgl-compatibility-check.html
- https://threejs.org/manual/pages/loading-3d-models.html
- https://threejs.org/docs/pages/PMREMGenerator.html
- https://threejs.org/docs/pages/RoomEnvironment.html
- https://threejs.org/docs/pages/KTX2Loader.html
- https://threejs.org/docs/pages/DRACOLoader.html
- https://threejs-journey.com/lessons
- https://threejs-journey.com/lessons/performance-tips (бесплатная часть)
- https://threejs-journey.com/lessons/realistic-render (бесплатная часть)
- https://tympanus.net/codrops/2019/02/20/how-to-create-a-fake-3d-image-effect-with-webgl/
- https://tympanus.net/codrops/2020/04/14/interactive-webgl-hover-effects/
- https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/
- https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/
- https://thebookofshaders.com/01/ · https://thebookofshaders.com/05/ · https://thebookofshaders.com/11/
- https://docs.spline.design/exporting-your-scene/web/exporting-as-code.md
- https://docs.spline.design/exporting-your-scene/how-to-optimize-your-scene.md
- https://gltf-transform.dev/cli
- https://github.com/oframe/ogl (README) · https://github.com/google/draco (README)
- https://www.khronos.org/news/press/khronos-ktx-2-0-textures-enable-compact-visually-rich-gltf-3d-assets
- https://modelviewer.dev/examples/loading/
- https://web.dev/articles/offscreen-canvas
- https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
- Не открылись (Cloudflare): Codrops 2018 «WebGL Distortion Hover Effects», Codrops 2026 parallax gallery и relighting. Факты о них взяты только из поисковой выдачи.
