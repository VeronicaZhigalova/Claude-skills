# Фронтенд-ремесло + техническое SEO (HTML/CSS/JS-лендинги)

Справочник для вёрстки маркетинговых сайтов на чистом HTML/CSS/JS. Каждый факт взят с открытой страницы, URL указан рядом.
Пометка «(не проверено)» означает мой собственный вывод, которого нет в источнике. Дата сбора: 2026-10.

---

## 1. Раскладка секций: grid / flex без брейкпоинтов

**Карточки, которые сами переносятся на новую строку (Grid).** Сниппет, который CSS-Tricks называет «самым известным во всём Grid»: `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));`.
`auto-fill` создаёт столько колонок, сколько поместится, даже пустые. `auto-fit` растягивает уже имеющиеся колонки на всё место. — https://css-tricks.com/snippets/css/complete-guide-grid/

**Subgrid.** `grid-template-columns: subgrid` у дочернего элемента: элемент получает линии родительской сетки, и его внутренние элементы встают на неё. — там же.
Применение: у карточек в ряду заголовки, тексты и кнопки выравниваются по одной линии (не проверено).

**Sidebar из Every Layout** (две колонки, на узком экране встают друг под друга, медиазапросы не нужны):
```css
.with-sidebar { display:flex; flex-wrap:wrap; gap:var(--s1); }
.sidebar      { flex-basis:20rem; flex-grow:1; }
.not-sidebar  { flex-basis:0; flex-grow:999; min-inline-size:50%; }
```
`flex-grow:999` заставляет основную колонку занять всё свободное место. `min-inline-size:50%` задаёт точку, где колонки встают друг под друга. Когда колонки стоят рядом, их высоты равны благодаря `align-items: stretch`. — https://every-layout.dev/layouts/sidebar/
Every Layout советует ставить брейкпоинты по контенту, а не по устройствам (не на 720/1024). Медиазапрос знает только ширину вьюпорта, а не место, доступное компоненту. — там же.

**Switcher** (ряд элементов превращается в колонку при пороговой ширине контейнера):
```css
.switcher { display:flex; flex-wrap:wrap; gap:var(--space); }
.switcher > * { flex-grow:1; flex-basis:calc((var(--threshold) - 100%) * 999); }
.switcher > :nth-last-child(n+5), .switcher > :nth-last-child(n+5) ~ * { flex-basis:100%; }
```
Последнее правило выстраивает элементы в колонку, если их 5 и больше. Обычный `flex:1 1 20rem` даёт сетку без брейкпоинтов, но элемент, перенесённый на новую строку и растянутый, выглядит «выделенным», и Switcher этого избегает. — https://every-layout.dev/layouts/switcher/
Подходит для блоков «3 тарифа», «3 преимущества» и шагов процесса (не проверено).

## 2. Container queries

- Объявить контейнер: `container-type: inline-size` (или `size`) либо шорткат `container`. Затем `@container (10em <= width <= 20em) {…}`. Запросить можно `width`, `height`, `inline-size`, `block-size`, `aspect-ratio` и `orientation`. — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_size_and_style_queries
- Именованный контейнер: `container-name: card;` → `@container card (orientation: landscape)`. Безымянный запрос срабатывает по ближайшему предку-контейнеру. — там же.
- Объявление контейнера добавляет containment. Это нужно для производительности: иначе браузеру пришлось бы постоянно опрашивать размер каждого элемента. — там же.
- Style queries: `@container style(--theme: dark) {…}`. По данным MDN (февраль 2024), в `style()` работают только custom properties. Любой элемент может быть style-контейнером, `container-type` для этого не нужен. — там же.
- Есть ещё scroll-state queries (например, «контейнер прокручен» или «элемент примагничен scroll-snap») и anchored queries. — там же.
- Практика: карточка товара одинаково хорошо смотрится в сетке на 3 колонки и в узком сайдбаре. Медиазапросы оставить для каркаса страницы (не проверено).

## 3. Fluid sizing: clamp()

- `clamp(MIN, PREFERRED, MAX)`, например `font-size: clamp(1rem, 2.5vw, 2rem)`. Работает и для width: `clamp(20rem, 30vw, 70rem)`. — https://developer.mozilla.org/en-US/docs/Web/CSS/clamp
- Тот же приём подходит для margin, padding и gap, не только для шрифта. — https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/
- Доступность (Smashing со ссылкой на Adrian Roselli): границы в px и чистые `vw` в предпочтительном значении недоступны. Используйте rem и `vw + rem`, например `clamp(2rem, 4vw + 1rem, 3rem)`. Если `vw` или потолок clamp мешают увеличить текст до 200%, это нарушение WCAG 1.4.4, поэтому зум надо тестировать. — там же.
- Формула предпочтительного значения `[v]vw + [r]rem` для заданного диапазона вьюпорта: v = 100·(max−min)/(vpMax−vpMin), r = (vpMin·max − vpMax·min)/(vpMin − vpMax), все значения в rem. Формулу я вывел по описанию в статье Smashing (не проверено), удобнее брать калькулятор Utopia.

## 4. aspect-ratio и object-fit

- `aspect-ratio: 16 / 9`. `auto 3/4` означает «для replaced-элементов берём их собственное соотношение, иначе 3/4». Baseline с сентября 2021. — https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio
- `object-fit`: `fill` (по умолчанию, растягивает), `contain` (вписывает с полями), `cover` (заполняет и обрезает), `none`, `scale-down`. Положение кадра задаёт `object-position`. На `<iframe>` и `<embed>` не действует. — https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
- Рецепт для hero-картинки: `aspect-ratio` на обёртке плюс `img{width:100%;height:100%;object-fit:cover}`, фокус кадра через `object-position` (не проверено).

## 5. Логические свойства

- `inline` — ось, вдоль которой идёт строка текста, `block` — перпендикулярная ей. `inline-size` вместо `width` ведёт себя одинаково при любом `writing-mode`. — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values/Basic_concepts_of_logical_properties_and_values
- `margin-inline: auto` центрирует по горизонтали и не трогает верх и низ. Первое значение относится к началу оси, второе к концу. — поиск по CSS-Tricks/MDN, https://developer.mozilla.org/docs/Web/CSS/margin-inline
- Для наших сайтов: использовать `padding-inline`, `margin-block` и `inset-inline` с первого дня, тогда RTL-версия обойдётся почти бесплатно (не проверено).

## 6. :has() — «родительский» селектор

- Baseline Widely available с декабря 2023. Специфичность равна специфичности самого специфичного аргумента. `:has()` нельзя вкладывать в `:has()`, псевдоэлементы внутри не работают. Если браузер не знает `:has()`, отбрасывается весь блок правил, поэтому `:has()` в списке селекторов стоит оборачивать в `:is()`/`:where()`. — https://developer.mozilla.org/en-US/docs/Web/CSS/:has
- Паттерны из гайда Ahmad Shadeed — https://ishadeed.com/article/css-has-guide/ :
  - `figure:has(figcaption)`, `.card:has(> img)` (только прямой потомок), `.card:not(:has(img))` для карточек без картинки;
  - `.section:has(.sectionContent:empty)` — скрыть пустую секцию;
  - `.main:has(.alert) .header` — сменить шапку, если на странице есть алерт;
  - `body:has(.banner) .fab` — сдвинуть плавающую кнопку, когда показан баннер;
  - количественные запросы: `.wrapper:has(li:nth-last-child(n + 5))`, `.submenu:has(li:nth-last-child(n + 6))` — меняют раскладку в зависимости от числа пунктов;
  - формы: `.question:has(input[data-correct="true"]:checked)`, `:has(input[type="checkbox"]:checked)`;
  - `.card:has(.button:hover)` — подсветить всю карточку, когда наведена кнопка.

## 7. View Transitions (между страницами MPA)

- Включить так: `@view-transition { navigation: auto; }`, причём в CSS **обеих** страниц. Работает только на том же origin, без cross-origin редиректов, для навигаций traverse/push/replace (push/replace должен запускать пользователь). Есть дескриптор `types`. — https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition
- Анимацию настраивают через `@keyframes` на псевдоэлементах `::view-transition-old()` и `::view-transition-new()`. Статус: не Baseline (Limited availability). — там же.
- По caniuse (из выдачи поиска): Chrome/Edge 126+, Safari 18.2+, Firefox частично. Значит, это прогрессивное улучшение: сайт обязан нормально работать и без него (вывод не проверено).

## 8. Scroll-driven animations на чистом CSS

- `animation-timeline: view()` создаёт анонимную view progress timeline: прогресс 0% в момент, когда элемент появляется у края скроллера, и 100%, когда он доходит до противоположного края. Параметры: ось (`block` по умолчанию, `inline`, `x`, `y`) и до двух insets, например `view(block 50% 10%)`. Если по выбранной оси нет скролла, таймлайн неактивен. — https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/view
- Статус: **не Baseline** (Limited availability). — там же.
- В гайде WebKit (выдача поиска) сказано, что `animation` нужно писать до `animation-timeline`, потому что шорткат сбрасывает таймлайн. — https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/
- Рецепт (не проверено): `@supports (animation-timeline: view()) { … }` плюс `@media (prefers-reduced-motion: no-preference)`. Сложные сцены по-прежнему делать на GSAP ScrollTrigger.

## 9. Адаптивные изображения

- **Resolution switching:** `srcset="a-480w.jpg 480w, a-800w.jpg 800w"` + `sizes="(width <= 600px) 480px, 800px"`. Браузер берёт первое истинное условие в `sizes`, затем файл, ширина которого равна ширине слота, или ближайший больший. В `sizes` можно писать `vw`, но нельзя `%`. — https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images
- **Плотность пикселей:** для картинки фиксированного размера достаточно `srcset="a.jpg, a-1.5.jpg 1.5x, a-2.jpg 2x"` без `sizes`. — там же.
- **Art direction:** `<picture>` с `<source media="(width < 800px)" srcset="crop.jpg">`. Последним всегда идёт `<img src alt>`, без него ничего не покажется. Атрибут `media` использовать только для art direction и не смешивать его с media-условиями в `sizes`. — там же.
- **Форматы:** `<source srcset="photo.avif" type="image/avif">`, `<source srcset="photo.webp" type="image/webp">`, затем `<img src="photo.jpg" alt>`. Браузер пропускает форматы, которые не поддерживает. Для Retina лучше `srcset` на `<img>`, а не `<picture>`: так браузер сможет взять облегчённую версию в режиме экономии трафика. — https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture
- Ширина нужного файла = ширина слота × device pixel ratio. — там же.
- Google индексирует в `<img src>` форматы BMP, GIF, JPEG, PNG, WebP, SVG и AVIF. CSS-фоновые картинки Google **не индексирует**. — https://developers.google.com/search/docs/appearance/google-images

## 10. Загрузка шрифтов

Источник раздела: https://web.dev/articles/font-best-practices
- `@font-face` сам по себе ничего не скачивает: шрифт грузится, только когда его использует применённый стиль.
- Объявления `@font-face` и критичные стили лучше инлайнить в `<head>`, а сами файлы шрифтов не инлайнить.
- Для стороннего хоста ставить `preconnect`. У Google Fonts два origin: `<link rel="preconnect" href="https://fonts.googleapis.com">` и `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`. Шрифты всегда грузятся через CORS. Подключать через `<link>` лучше, чем через `@import`.
- `preload` использовать осторожно: он отбирает ресурсы у других загрузок и игнорирует `unicode-range`, поэтому одним preload грузят один формат. Для внешних стилей предзагрузка самых важных шрифтов очень эффективна.
- Нужен только WOFF2: он сжимает на 30% лучше WOFF. Также помогают сабсеттинг и `unicode-range` (латиница и кириллица отдельными файлами). Для сабсеттинга есть subfont и glyphhanger, но сначала проверить лицензию.
- Self-hosting выигрывает только при CDN и HTTP/2. Web Almanac даже фиксировал более быстрый рендер у сторонних шрифтов.
- Вариативный шрифт выгоден, только если реально нужно много начертаний: сам файл тяжелее одного обычного начертания.
- `font-display`: `block` скрывает текст 2–3 с (Safari — бесконечно), `swap` (0 мс блокировки), `fallback` (100 мс / 3 с), `optional` (100 мс, без подмены позже). Рекомендации: важнее всего скорость → `optional`; сразу показать текст, но в веб-шрифте → `swap` и доставить шрифт пораньше. Можно комбинировать: `swap` для бренда и заголовков, `optional` для основного текста.
- Иконочные шрифты заменить на SVG.
- Сдвиг между fallback-шрифтом и веб-шрифтом убирается через `size-adjust`, `ascent-override`, `descent-override` и `line-gap-override`. Всегда указывать generic-fallback: `"Brand", sans-serif`. — https://web.dev/articles/optimize-cls

## 11. Core Web Vitals: цели и исправления

**Пороги** (оцениваются по 75-му перцентилю просмотров): LCP ≤ 2500 мс хорошо, > 4000 мс плохо. INP ≤ 200 мс / > 500 мс. CLS ≤ 0.1 / > 0.25. Метрика считается «хорошей», если порог выполняют ≥ 75% просмотров. — https://web.dev/articles/defining-core-web-vitals-thresholds

**LCP** — https://web.dev/articles/optimize-lcp
- LCP складывается из четырёх частей. Ориентир: TTFB ≈ 40%, resource load delay < 10%, load duration ≈ 40%, render delay < 10%.
- LCP-ресурс должен быть виден preload-сканеру прямо в HTML: `<img src/srcset>` в разметке, а для CSS-фона или шрифта нужен `<link rel="preload">`.
- **Никогда не ставить `loading="lazy"` на LCP-картинку.** Добавить ей `fetchpriority="high"`.
- Render-blocking CSS уменьшить или заинлайнить.
- `fetchpriority` (Chrome 102, Safari 17.2, Firefox 132): в тесте Google Flights LCP снизился с 2.6 до 1.9 с. В карусели `high` нужен только первому видимому слайду, остальным можно `low`. Для LCP-картинки в CSS-фоне: preload + `fetchpriority="high"`. — https://web.dev/articles/fetch-priority

**CLS** — https://web.dev/articles/optimize-cls
- У `<img>` и `<video>` всегда указывать `width` и `height` (или `aspect-ratio`): браузер вычислит `aspect-ratio: auto W / H` ещё до загрузки. В CSS при этом `width:100%; height:auto`.
- Атрибуты `width`/`height` можно ставить и на `<source>` внутри `<picture>`, если пропорции разные.
- Под эмбеды, рекламу и баннеры заранее резервировать место (`min-height` или `aspect-ratio`) и не схлопывать его, если контент не пришёл.
- Не вставлять контент над текущим без действия пользователя. Сдвиги в пределах 500 мс после взаимодействия в CLS не считаются.
- Анимировать `transform`, а не `top`/`left`, `box-shadow` и т. п.

**INP** — https://web.dev/articles/optimize-inp
- Взаимодействие = input delay + processing duration + presentation delay.
- Делать в обработчиках минимум работы и чаще отдавать управление главному потоку (yield), например разбивая задачу через `setTimeout`.
- Пока страница грузится, input delay растёт из-за длинных задач при выполнении скриптов, так что тяжёлые скрипты надо уменьшать.

## 12. SEO: head-разметка

**`<title>`** — https://developers.google.com/search/docs/appearance/title-link
- У каждой страницы свой `<title>`: описательный и краткий. Нельзя ставить «Home»/«Profile», набивать ключевые слова или повторять шаблонный текст на всех страницах.
- Ограничения длины нет, но в выдаче заголовок обрезается по ширине устройства.
- Бренд добавлять кратко. На главной уместна пара слов о сайте.
- Google может переписать title, если тот не соответствует контенту. Помогает, когда главный заголовок на странице заметный и отличается от других.

**Meta description** — https://developers.google.com/search/docs/appearance/snippet
- Сниппет Google в основном берёт из контента страницы, meta description — если она описывает страницу лучше.
- Описание уникально для каждой страницы. Это короткий релевантный «питч», можно со структурированными фактами (цена, автор).
- Длина не ограничена, но обрезается. Строки из одних ключевых слов вряд ли попадут в сниппет. Управление: `nosnippet`, `max-snippet:[n]`, `data-nosnippet`.

**Мифы** — https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- `meta keywords` Google не использует. Магического объёма текста нет.
- Порядок заголовков H1–H6 важен для скринридеров, но для ранжирования Google он «не имеет значения». Держим правильный порядок ради доступности.
- E-E-A-T — не фактор ранжирования. За дубли контента не наказывают: делайте редирект на основной URL или `rel="canonical"`.
- URL должны быть с понятными словами (`/pets/cats.html`): части URL показываются в выдаче как breadcrumbs. Текст ссылок (anchor) должен быть описательным.

**Open Graph** — https://ogp.me/
- Обязательные свойства: `og:title`, `og:type`, `og:image`, `og:url` (`og:url` — канонический URL).
- Опциональные: `og:description` (1–2 предложения), `og:site_name`, `og:locale`. Синтаксис: `<meta property="og:title" content="…">`.
- Размеры превью у разных платформ свои, их в спецификации OGP нет (вывод из выдачи поиска, не проверено).

## 13. Семантика и alt

- `alt` — самый важный атрибут метаданных изображения. Google понимает картинку по alt, computer vision и окружающему тексту страницы. — https://developers.google.com/search/docs/appearance/google-images
- Писать конкретно, без набивки ключевыми словами. Пример Google: alt «Dalmatian puppy playing fetch», а не список терминов.
- Картинку ставить рядом с релевантным текстом. Имя файла — короткое и описательное (`my-new-black-kitten.jpg`, а не `IMG00023.JPG`), при локализации его тоже переводить. Для картинок с CDN подойдёт image sitemap.
- Контентные изображения — только через `<img>`, а не `background-image`: CSS-картинки Google не индексирует. — там же.
- Семантический каркас: `header`/`nav`/`main`/`section` с заголовком/`footer`, один `h1` на страницу, кнопки — `<button>`, ссылки — `<a href>` (не проверено, это общепринятая практика, а не цитата Google).

## 14. Structured data (JSON-LD)

**LocalBusiness** — https://developers.google.com/search/docs/appearance/structured-data/local-business
- Обязательные поля: `name`, `address` (`PostalAddress`, заполнить как можно полнее).
- Рекомендуемые: `telephone`, `url`, `geo`, `openingHoursSpecification`, `priceRange`, `aggregateRating`, `review`, `menu`, `department`.
- Брать максимально конкретный подтип (`Restaurant`, `DaySpa`, `HealthClub`…). Несколько типов задаются массивом `"@type": ["Electrician","Plumber"]`, `additionalType` не поддерживается. LocalBusiness — подтип Organization.
- Если часы работают круглый год, `validFrom`/`validThrough` не указывать.
- Проверка: Rich Results Test, затем URL Inspection. Страница не должна быть закрыта robots.txt, noindex или логином.
- Для сервисного бизнеса Google советует LocalBusiness, а не Product (Mueller в пересказе SEJ, из выдачи поиска).

**Product (product snippet)** — https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- Обязательны `name` и хотя бы одно из трёх: `review`, `aggregateRating`, `offers`. Если есть только `offers`, Rich Results Test может выдать предупреждение.
- В `Offer` обязателен `price` (или `priceSpecification.price`) вместе с `priceCurrency`. Плюсы и минусы в обзоре задаются через `positiveNotes`/`negativeNotes` (ItemList, минимум 2 утверждения).

## 15. sitemap.xml и robots.txt

**Sitemap** — https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Лимит: 50 МБ (без сжатия) или 50 000 URL на файл, если больше — нужен sitemap index. Кодировка UTF-8.
- Без отправки через Search Console sitemap действует только на потомков своей папки, поэтому кладите его в корень.
- `<priority>` и `<changefreq>` Google **игнорирует**. `<lastmod>` учитывается, только если он стабильно точен.
- Строка в robots.txt: `Sitemap: https://example.com/sitemap.xml` (таких строк может быть сколько угодно).

**robots.txt** — https://developers.google.com/search/docs/crawling-indexing/robots/intro
- Файл управляет сканированием и не защищает от индексации. Заблокированный URL всё равно может попасть в выдачу, просто без описания.
- Чтобы убрать страницу из поиска, нужен `noindex` (meta-тег или заголовок) или пароль.
- Не сочетать Disallow и noindex на одной странице: если сканирование запрещено, бот не увидит noindex (вывод из «правила могут противоречить друг другу», не проверено).

## 16. Чек-лист перед сдачей лендинга (сводка моих выводов, не проверено)

1. Hero-картинка: `<picture>` AVIF→WebP→JPG, `width`/`height`, `fetchpriority="high"`, без lazy. Всё ниже первого экрана — `loading="lazy"`.
2. Шрифты: WOFF2 с сабсетом, `@font-face` в `<head>`, preload 1–2 ключевых файлов, `font-display: swap` или `optional`, fallback подогнан через `size-adjust`.
3. Сетка: auto-fit/minmax, Sidebar и Switcher, у компонентов container queries, отступы через `clamp()` в rem + vw. Проверить зум 200%.
4. Анимации только `transform` и `opacity`. Scroll-driven и View Transitions обернуть в `@supports` и `prefers-reduced-motion`.
5. Head: уникальные title и description, canonical, OG-теги (4 обязательных + description), favicon.
6. JSON-LD LocalBusiness или Product, проверка в Rich Results Test, `sitemap.xml` и строка Sitemap в robots.txt.
7. Замерить PageSpeed Insights: LCP ≤ 2.5 с, INP ≤ 200 мс, CLS ≤ 0.1.

---

## Открытые и прочитанные страницы
1. https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_size_and_style_queries
2. https://web.dev/articles/defining-core-web-vitals-thresholds
3. https://web.dev/articles/font-best-practices
4. https://every-layout.dev/layouts/sidebar/
5. https://every-layout.dev/layouts/switcher/
6. https://ishadeed.com/article/css-has-guide/
7. https://developer.mozilla.org/en-US/docs/Web/CSS/:has
8. https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/view
9. https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition
10. https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images
11. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture
12. https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
13. https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio
14. https://developer.mozilla.org/en-US/docs/Web/CSS/clamp
15. https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values/Basic_concepts_of_logical_properties_and_values
16. https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/
17. https://css-tricks.com/snippets/css/complete-guide-grid/
18. https://web.dev/articles/optimize-lcp
19. https://web.dev/articles/optimize-cls
20. https://web.dev/articles/optimize-inp
21. https://web.dev/articles/fetch-priority
22. https://developers.google.com/search/docs/appearance/title-link
23. https://developers.google.com/search/docs/appearance/snippet
24. https://developers.google.com/search/docs/appearance/google-images
25. https://developers.google.com/search/docs/appearance/structured-data/local-business
26. https://developers.google.com/search/docs/appearance/structured-data/product-snippet
27. https://developers.google.com/search/docs/fundamentals/seo-starter-guide
28. https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
29. https://developers.google.com/search/docs/crawling-indexing/robots/intro
30. https://ogp.me/
Известны только из выдачи поиска (сами страницы не открывал): webkit.org/blog/17101, caniuse cross-document-view-transitions, SEJ о Product и LocalBusiness.
