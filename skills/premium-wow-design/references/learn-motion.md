> Статус: собрано исследователем 22.10 в основном по памяти о первоисточниках, большая часть ссылок не открывалась. Цифры — ориентиры; правила Вероники (taste.md, human-made.md) важнее этого файла.

# Motion & Interaction для премиальных «вау»-сайтов

Справочник для агента-дизайнера. Стек: HTML/CSS/JS, плюс GSAP (+ScrollTrigger, SplitText), Lenis, WebGL — только когда это оправдано.
Главный принцип: **одно сильное движение в hero, дальше по странице движения всё меньше.** Анимация должна объяснять (иерархию, причинность, пространство), а не украшать.

---

## 1. Хореография страницы

- **Hero = 1 главный жест** (reveal заголовка, раскрытие картинки или WebGL-сцена) и 1–2 вторичных (появление nav/CTA). На загрузке весь hero укладывается в **≤ 1.2–1.6 с**.
- **Ниже первого экрана**: спокойные reveal'ы (fade + translateY 16–40px), без 3D. Каждая секция получает максимум один акцентный приём (pin, горизонтальная галерея, маска).
- **Порядок**: сначала структура (фон, медиа), потом заголовок, потом подзаголовок/CTA. Глаз ведёт движение — порядок движения совпадает с порядком чтения.
- **Не анимируй то, что пользователь увидит 100 раз** (nav-hover, меню, кнопки форм): там 120–200 мс или вообще мгновенно.
- **Повторный reveal не нужен**: `once: true`. Повтор при скролле вверх выглядит дёшево.
- **Контент виден без JS**: начальное скрытое состояние ставить классом `.js` на `<html>`, иначе при сбое скрипта страница пустая.

## 2. Easing и длительности

### Кривые (сохранить как токены)
```css
:root{
  --ease-out-quart: cubic-bezier(.25,1,.5,1);     /* основной для появления */
  --ease-out-expo:  cubic-bezier(.16,1,.3,1);     /* премиальные reveal'ы, маски */
  --ease-in-out-quart: cubic-bezier(.76,0,.24,1); /* перемещение по экрану, переходы страниц */
  --ease-out-soft:  cubic-bezier(.22,1,.36,1);    /* hover, мелочи */
}
```
GSAP-эквиваленты: `power3.out`/`power4.out`, `expo.out`, `power3.inOut`; для scrub — `ease: "none"`.

### Правила
- **Вход → ease-out** (быстро стартует, мягко садится). **Выход → ease-in, но короче** (≈ 60–75% длительности входа). **Перемещение A→B на экране → ease-in-out.**
- **ease-in для появления не использовать** — ощущается как лаг. `linear` — только для бесконечных (marquee, вращение) и scrub.
- Bounce/elastic — только для игривых брендов и мелочей; в премиуме почти никогда.

### Длительности по типам
| Элемент | Длительность |
|---|---|
| Hover, нажатие, цвет, тултип | 120–200 мс (press 100–150, release чуть дольше) |
| Дропдаун, тост, небольшой поповер | 180–250 мс |
| Модалка, drawer | 250–400 мс (drawer до 500) |
| Reveal текста/блока при скролле | 600–900 мс |
| Hero-reveal заголовка (маска) | 900–1400 мс |
| Clip-path раскрытие крупной картинки | 1000–1600 мс |
| Переход страницы | 600–1000 мс суммарно |
| Чем больше расстояние/площадь — тем дольше; UI-интеракции держать < 300 мс. |

### Stagger
- Строки заголовка: **0.08–0.12 с**; слова: 0.03–0.06; символы: **0.015–0.03** (иначе длинный текст «ползёт»).
- Карточки в сетке: 0.06–0.1 с, общий хвост stagger ≤ 0.5–0.6 с. Для сеток — `stagger: {each: .08, from: "start", grid: "auto"}`.
- Правило: **общее время группы ≤ 2× длительности одного элемента.**

## 3. Каталог hero-техник

Для каждой: когда работает / когда гиммик / подход.

**3.1 Text mask reveal (строки «выезжают» из-под маски)**
- Работает: крупная дисплейная типографика, короткий заголовок 2–6 слов. Самый «дорогой» и безопасный приём.
- Гиммик: на абзацах, на каждом заголовке страницы, по символам на длинном тексте.
- Подход: SplitText (`type:"lines", mask:"lines"`) → `gsap.from(lines,{yPercent:110, duration:1.1, ease:"expo.out", stagger:.1})`. Без GSAP: каждая строка в `span{display:block;overflow:hidden}`, внутренний span `transform:translateY(110%)` → 0. Пересчитывать split на resize (SplitText `autoSplit`). Оригинальный текст оставить для screen reader (`aria-label` на контейнере, куски `aria-hidden`).

**3.2 Clip-path image reveal**
- Работает: одна hero-картинка/видео, раскрытие снизу вверх или из центра, плюс лёгкий обратный scale картинки (1.2→1) — даёт ощущение «объектива».
- Гиммик: каждой картинке в галерее разные направления «шторок».
- Подход: `clip-path: inset(100% 0 0 0)` → `inset(0)`; внутри `img` `scale(1.2)`→`1`, 1.2–1.6 с, `expo.out`/`power4.inOut`. clip-path на одном элементе нормален по производительности; на десятках одновременно — нет.

**3.3 Scroll-linked zoom / pin**
- Работает: «вход в кадр» — картинка из окна растёт до fullscreen, продуктовое повествование в 3–5 шагов.
- Гиммик: pin на каждой секции; pin длиннее 150–200% высоты экрана без новой информации.
- Подход: `ScrollTrigger({trigger, start:"top top", end:"+=150%", pin:true, scrub:0.5–1})`, анимировать `scale`/`clip-path`, а не width/height. На мобильных — короче или без pin (`gsap.matchMedia`).

**3.4 Горизонтальная галерея**
- Работает: портфолио, кейсы, таймлайн — 4–8 крупных карточек.
- Гиммик: если важный контент (тексты, формы) спрятан в горизонталь; на тач-устройствах с pin.
- Подход: pin обёртки + `x: -(track.scrollWidth - innerWidth)`, `ease:"none"`, `scrub:1`, `end: () => "+=" + distance`, `invalidateOnRefresh:true`. Внутренние анимации — `containerAnimation`. На мобиле — нативный `overflow-x:auto` + `scroll-snap-type:x mandatory`.

**3.5 Cursor-follow (кастомный курсор, превью при наведении на список)**
- Работает: список проектов с превью-картинкой за курсором; студии/портфолио.
- Гиммик: замена системного курсора везде, тормозящий «хвост», курсор, скрывающий текст под ним.
- Подход: `gsap.quickTo(el,"x",{duration:.4–.6, ease:"power3"})` на `pointermove`; включать только при `(hover:hover) and (pointer:fine)`; системный курсор не прятать на интерактивных элементах.

**3.6 WebGL image distortion / depth**
- Работает: фотографический бренд, fashion, архитектура; hover-дисторсия (displacement), RGB-split при скролле по скорости, depth-parallax по карте глубины. Один «вау» на сайт.
- Гиммик: ради «технологичности», если контент — текст/SaaS; если скрывает фото.
- Подход: Three.js / OGL (лёгкая), плоскость на месте DOM-картинки (синхронизировать позицию с DOM), шейдер с `uniform uProgress/uVelocity`. Фолбэк — обычный `<img>`. Ограничить `devicePixelRatio` до `min(dpr, 2)`, пауза рендера вне вьюпорта (IntersectionObserver), не грузить на low-end и при reduced motion.

**3.7 Split-text (по символам/словам)**
- Работает: короткие слова-акценты, цифры-счётчики, scramble на ховере ссылки.
- Гиммик: по символам на всём подряд, вращение букв в 3D.
- Подход: SplitText `chars`, `stagger .02`, `yPercent`+`opacity`. Не больше ~40 символов в одной анимации.

**3.8 Marquee (бегущая строка)**
- Работает: логотипы клиентов, манифест-строка, разделитель секций; лёгкое ускорение/смена направления от скорости скролла.
- Гиммик: несколько marquee на экране, мелкий текст, который нужно прочитать.
- Подход: CSS `@keyframes` translateX(-50%) на дублированном треке, `linear`, 20–40 с за цикл; пауза на hover; при reduced motion — стоп. Добавлять `aria-hidden` на дубль.

**3.9 Magnetic buttons**
- Работает: 1–2 главных CTA, иконки соцсетей в футере.
- Гиммик: на всех кнопках; сильное смещение (> 10–15px), из-за которого промахиваешься.
- Подход: на `pointermove` смещение = (курсор − центр) × 0.2–0.4, внутренний текст × 0.1 доп.; `quickTo` 0.3–0.5 с; на `pointerleave` возврат `elastic.out(1,.4)` или `power3.out`. Только `pointer:fine`.

**3.10 Smooth scroll (Lenis)**
- Работает: сайты с большим количеством scroll-анимаций — сглаживает scrub, убирает рывки.
- Гиммик/вред: `lerp` слишком низкий (ощущение «плыву в мёде»), сломанный якорный/клавиатурный скролл, мобила.
- Подход: `lerp: 0.08–0.12` или `duration ~1.0–1.2`; синхронизация: `lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0)` — без второго rAF-цикла. На тач оставить нативный (`syncTouch:false`). При reduced motion Lenis не инициализировать.

**3.11 Page transitions** — View Transitions API (`@view-transition {navigation:auto}` для MPA) или Barba/«шторка»; 600–1000 мс, общий элемент (картинка кейса) «перелетает» — дороже, чем просто fade.

## 4. «Дёшево» vs «дорого»

**Дёшево:**
- 3D-tilt/wobble карточек, вращение по Y, «желе»-bounce.
- Параллакс на всём подряд, разные скорости у каждого блока.
- Scroll-jacking: подмена скролла пошаговыми слайдами, блокировка прокрутки, перехват колёсика.
- Всё появляется с одинаковым fade-up 100px; одинаковая длительность у всего.
- Анимации длиннее, чем терпение: тексты, которые надо ждать, чтобы прочитать.
- Preloader > 2–3 с без причины; «loading 0–100%» ради эффекта.
- Дефолтный `ease` / `ease-in-out` везде, linear на появлениях.
- Дёрганые 30 fps, прыжки layout, мерцание шрифта при split.

**Дорого:**
- Сдержанность: мало движения, но с точным easing (expo/quart out) и длинным мягким «приземлением».
- Малые амплитуды: translateY 20–40px, scale 1.05–1.2, не больше.
- Движение связано с контентом: маска повторяет строку, картинка раскрывается по сетке, переходы сохраняют объект.
- Ритм: согласованная система длительностей (токены), stagger по строкам.
- Отзывчивость: hover-реакция < 100 мс до старта, движение прерываемо (не ждать окончания).
- Скорость скролла как параметр (skew/blur 1–3°/px лёгкий от velocity), а не захват скролла.
- 60 fps стабильно, на мобиле — упрощённая, но цельная версия.

## 5. Производительность

- **Анимировать только `transform` и `opacity`** (композитинг, без layout/paint). Не трогать `width/height/top/left/margin`, `box-shadow` (вместо — opacity псевдоэлемента с тенью), большие `filter: blur()` (дорого, особенно на мобиле).
- **`will-change: transform`** — точечно и временно (перед анимацией, снять после); не на сотнях элементов — каждый слой ест видеопамять. GSAP сам ставит `force3D` на время твина.
- **Layout thrash**: не чередовать чтение (`getBoundingClientRect`, `offsetHeight`) и запись стилей в цикле. Читать всё, потом писать; в scroll-хендлерах — только rAF/ScrollTrigger, никаких `scroll`-листенеров с изменением DOM.
- `gsap.quickSetter/quickTo` для курсора/частых обновлений; IntersectionObserver для запуска/пауз.
- **Слабые устройства без GPU**: детектировать (`navigator.hardwareConcurrency <= 4`, `deviceMemory <= 4`, `matchMedia('(pointer:coarse)')`, проваленный WebGL-контекст) → отключать WebGL, Lenis, курсор, уменьшать pin. Ограничить DPR канваса ≤ 2 (на мобиле 1.5).
- **Видео**: hero-видео — H.264/HEVC + WebM/AV1, 1080p максимум, 3–8 Мб, `muted playsinline autoplay loop`, `preload="metadata"`, постер-картинка. Декодирование нескольких видео одновременно грузит CPU — ставить на паузу вне экрана. Не скрабить видео по скроллу через `currentTime` без all-keyframe кодирования (иначе рывки) — для scrub лучше секвенция кадров в canvas.
- Шрифты для split-text: дождаться `document.fonts.ready` перед split, иначе строки перелягут.
- CSS scroll-driven animations (`animation-timeline: view()`) — вне главного потока, хороший выбор для простых reveal'ов; GSAP — для сложной хореографии.
- Бюджет: LCP не задерживать анимацией (hero-текст должен отрисоваться сразу, opacity 0 на LCP-элементе вредит). CLS = 0 от анимаций. Проверять Performance-панелью с 4× CPU throttling.

## 6. Доступность (prefers-reduced-motion)

- **Reduced ≠ ноль**: убрать движение в пространстве (параллакс, zoom, pin, горизонталь, marquee, smooth scroll, WebGL-дисторсию), оставить мягкие fade/цвет 150–200 мс.
```css
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;
    transition-duration:.01ms!important;scroll-behavior:auto!important}
}
```
```js
gsap.matchMedia().add({
  full:"(prefers-reduced-motion: no-preference)",
  reduce:"(prefers-reduced-motion: reduce)"
},(ctx)=>{ const {full}=ctx.conditions; /* full ? сложная хореография : просто opacity */ });
```
- WCAG 2.3.3: движение, запущенное взаимодействием, должно отключаться. WCAG 2.2.2: всё, что движется > 5 с (marquee, авто-карусели, видео-фон), — с паузой.
- Никаких вспышек > 3 раз/с (2.3.1). Не прятать фокус кастомным курсором; magnetic/hover-эффекты дублировать для `:focus-visible`.
- Горизонтальная галерея и pin не должны ломать клавиатурную навигацию (Tab, PageDown, якоря).
- Split-текст читается целиком скринридером (aria-label на родителе).

## 7. Аудит-чеклист

**Концепция**
- [ ] В hero один главный жест; понятно, что он «говорит» о бренде.
- [ ] Ниже первого экрана движение спокойнее; ≤ 1 акцентного приёма на секцию.
- [ ] Нет 3D-tilt, тотального параллакса, scroll-jacking.
- [ ] Каждый приём проходит тест «если убрать — станет хуже?».

**Тайминг**
- [ ] Easing из токенов; появления ease-out, выход короче входа; scrub — `none`.
- [ ] UI-интеракции < 300 мс; hero ≤ ~1.5 с; stagger строк 0.08–0.12 с.
- [ ] Анимации прерываемы; reveal'ы `once`.

**Производительность**
- [ ] Только transform/opacity (проверить Performance → нет Layout/Paint на кадрах).
- [ ] 60 fps при 4× CPU throttling; на мобиле упрощённая версия.
- [ ] will-change точечный; WebGL/видео на паузе вне экрана; DPR ≤ 2.
- [ ] LCP не ждёт анимации; CLS = 0; шрифты загружены до split.
- [ ] Есть фолбэк без JS/WebGL — контент виден.

**Доступность**
- [ ] prefers-reduced-motion: выключены параллакс, pin, marquee, Lenis, WebGL-эффекты.
- [ ] Marquee/карусели/видео > 5 с с паузой.
- [ ] Клавиатура, якоря и фокус работают с Lenis и pin.
- [ ] Курсор-эффекты только для `pointer:fine`, системный курсор не потерян.

**Тач/мобайл**
- [ ] Нет hover-зависимых сценариев; горизонталь — нативный scroll-snap.
- [ ] Нативный скролл на тач; pin короче или отключён.

---

## Источники
- GSAP docs: https://gsap.com/docs/v3/ · ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/ · SplitText: https://gsap.com/docs/v3/Plugins/SplitText/ · gsap.matchMedia: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/ · Easing: https://gsap.com/docs/v3/Eases/
- GSAP forum (Lenis + anchors): https://gsap.com/community/forums/topic/36731-gsap-lenis-smoothscroll-scrolling-to-anchor-breaks-tweens/
- Lenis: https://lenis.darkroom.engineering/ · https://github.com/darkroomengineering/lenis
- Codrops, GSAP + Lenis infinite scroll (2026): https://tympanus.net/codrops/2026/05/28/the-never-ending-story-building-a-seamless-infinite-scroll-experience-with-gsap-lenis/
- Codrops tutorials (WebGL, distortion, reveals): https://tympanus.net/codrops/category/tutorials/
- Next.js + Lenis + GSAP sync: https://www.hontran.dev/blog/nextjs-smooth-scroll-gsap-lenis
- Emil Kowalski, animations.dev и skills: https://animations.dev/ · https://emilkowal.ski/ui/great-animations · сводка правил: https://instagit.com/emilkowalski/skills/how-does-animation-duration-affect-perceived-speed/ · https://instagit.com/emilkowalski/skills/how-to-choose-right-easing-curve-ui-animations.md
- Rauno Freiberg, Invisible Details of Interaction Design: https://rauno.me/craft/interaction-design
- Material motion (durations/easing): https://m3.material.io/styles/motion/easing-and-duration
- Val Head, Designing Interface Animation; A List Apart: https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/
- web.dev, animations guide и performance: https://web.dev/articles/animations-guide · https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count · https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing
- MDN prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion · Scroll-driven animations: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations
- WCAG 2.3.3 Animation from Interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions · 2.2.2 Pause, Stop, Hide: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide
- easings.net: https://easings.net/ · Awwwards SOTD: https://www.awwwards.com/websites/sites_of_the_day/

## Проверено по источникам 22.10
- Правила Emil Kowalski известны по пересказам (skills.sh/mrmps/smry/emilkowal-animations, open-design.ai/skills/emil-design-eng), первоисточник — курс animations.dev: UI-анимации до ~300 мс, по умолчанию ease-out и свои cubic-bezier, ease-in-out для перемещения по экрану, без ease-in для появления, разное время для нажатия и отпускания.
- Раскрытия картинок: GSAP-форум советует задавать clip-path в процентах; на Codrops есть «Pinned image mask reveal on scroll» и Layered Zoom Scroll (tympanus.net/codrops/2025/10/29/building-a-layered-zoom-scroll-effect-with-gsap-scrollsmoother-and-scrolltrigger/).
