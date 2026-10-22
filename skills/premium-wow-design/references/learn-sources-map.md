# Карта источников: где что брать

Проверено 22.10.2026 с облачного сервера (curl + заголовки/разметка). Дополняет `reference-map.md` (по секциям) и `prototype-kit.md` (язык кита Vistora). Правило то же: берём **принцип**, а не картинку, и каждый приём должен продавать.

## 1. Источники по сайтам

### Движение, 3D, герои (вау-слой)
**figmaformotion.com** (Daniel Snows): Figma-шаблоны анимаций + статичные UI. Открывается (200), контент частично платный (Basic/Premium).
- Лучше всего для: hero-формулы, motion-идей, 3D-сцен.
- Примеры: «Product Spotlight» (один объект в центре + медленный поворот), «Scroll Stories» (история по скроллу), «Magnetic Interaction» (магнитная кнопка), «Infinite Gallery», «Kinetic Typography», «Seamless Transition» (переход между экранами); проекты «Arborea – Organic», «Secret – Japanese Torii gate», «BlueBird – Tech security».
- Брать: формулу «объект + оффер + 2–3 плавающие карточки фактов + одно медленное движение». Не брать неон и глянцевое 3D (см. отказ в prototype-kit).

**horizonx.so**: UI-киты, шейдерные фоны, текстуры, мокапы, React-компоненты. Открывается.
- Лучше всего для: hero-секций с шейдером/частицами, фоновых текстур, мокапов продукта.
- Примеры: «Lotus Perfume» (премиальный продукт-hero), «Crest Water Hero», «Yohaku Tunnel Hero» (туннель-глубина), «Alder & Stone» (спокойная материальная эстетика), шейдеры «Marble Signal», «Warm Press», «Tulip Study».
- Брать: тёплые матовые текстуры (Marble/Warm Press) как фон сцены; переписывать на CSS/лёгкий canvas. Орбы и plasma — почти никогда.

**lenis.dev/showcase**: витрина сайтов с плавным скроллом Lenis. Страница рендерится JS — curl видит только каркас, нужен headless-браузер.
- Лучше всего для: scroll-driven историй, передач секция→секция, pinned-сцен.
- Смотреть: как текст и фото меняются при закреплённой секции, скорость инерции (не «вязкая»).
- Ограничение: Lenis подключаем, только если ощущение лучше и feel-check проходит.

**neuro.kolpadesign.ru/vau**: «Папка вау-сайтов» с фильтрами ниша / настроение / приём. Открывается.
- Лучше всего для: быстрого подбора вау-приёма под нишу и настроение.
- Брать: фильтр «Близко по вкусу» → 3–5 сайтов той же ниши, затем один приём.

**motionsites.ai**: AI-промпты + motion-дизайн. Открывается.
- Примеры: «Animated backgrounds designed to convert», «Zenith Realty», «Glow Features», «EMBER.dsgn».
- Брать: идеи микро-движения и анимированных фонов; глоу-эффекты — с осторожностью.

**reactbits.dev / originkit.dev / 21st.dev**: библиотеки анимированных компонентов (React). Открываются.
- 21st.dev: раздел «Heroes that move», 12 000+ компонентов, категории. originkit: бесплатные анимированные блоки. reactbits: текстовые эффекты, фоны, курсоры.
- Брать: идею состояния/движения, переписывать на чистый CSS/GSAP (стек — HTML/CSS).

**particles.casberry.in**: 3D-симулятор частиц (рой, формации, экспорт). Открывается. Только для редкого «технологичного» вау; по умолчанию — нет.

**gsap.com, animejs.com**: документация и демо (открываются по reference-map). ScrollTrigger/SplitText — реализация scroll-историй.

### Галереи целых сайтов (качество, композиция, типографика)
**godly.design**: отборные сайты с видео-превью. Открывается. Примеры на 22.10: Gabriel, Timeless, Kineticbolt, Superpower. Лучше всего для: hero, типографики, общего «уровня».
**cssdesignawards.com**: WOTD, номинанты. Открывается. Примеры: «Arc Marumo» (WOTD 22.10), «Interactive 3D Locker Room» (3D-сцена), «metic. — Take a Closer Look». Для: 3D/WebGL и планки качества.
**awwwards.com**: заблокирован (нет ответа / редирект). Просить у Вероники ссылки на конкретные работы.
**minimal.gallery**: спокойные минималистичные сайты (Driessen Architectuur, Ev Astapov, Eli Horn). Для: тихой роскоши, белого поля, сеток.
**httpster.net, recent.design, siteinspire.com**: галереи для настроения и арт-дирекции. httpster/recent открываются, siteinspire — 429, повторить позже.
**onepagelove.com**: одностраничники и шаблоны (Stolaze, Resurf, Kizupi). Для: ритма лендинга целиком, порядка секций, proof-блоков.
**land-book.com, lapa.ninja**: 403 (Cloudflare). Обходить не пытаемся — просить скриншоты.
**dribbble.com, behance.net**: бот-проверка / блок. Только по ссылкам от Вероники.

### Галереи по секциям
**hero.gallery**: каталог hero с разбором layout / copy / CTA / тона. Лучше всего для: оффера в первые 5 секунд, связки фото + заголовок + кнопка.
**navbar.gallery**: типы навигации — static, dropdown, mega menu, sidebar, fullscreen, announcement bar, search bar, progress bar, tabs, breadcrumbs. Для: поведения меню при скролле, мобильного меню, вертикального рейла (как в ките).
**unsection.com**: поиск по секциям (SaaS, портфолио, e-commerce). Для: блоков proof, отзывов, фич.
**bentogrids.com**: бенто-сетки (страница почти пустая без JS — смотреть в браузере). Для: «бенто неравного веса» из кита.
**pricingpages.design**: «Pricing pages design vault» (URL Box, Huddlekit, Lyssna, Fey). Для: тарифов, рекомендованного плана, сравнения.
**cta.gallery**: категории CTA — creative button, call-to-buy, download, form, modal/popup, navigation CTA, subscription, pricing CTA. Для: финального призыва и кнопок в меню.
**footer.design**: «единственная галерея футеров» (The Content Architecture, Trove, Aperios Design, Decimals). Для: футера с гигантским вордмарком, контактов, финального CTA.
**404s.design**: креативные 404 (Edoardo Lunardi, UPCLOSE, Ente). Для: 404 и пустых состояний, которые ведут обратно к цели.

### Продуктовые экраны и флоу
**mobbin.com**: 621 500+ скриншотов мобильных и веб-приложений, флоу целиком; много за логином. Для: бронирования, чекаута, онбординга, форм, ошибок, подтверждений.
**saasframe.io**: SaaS-сайты и интерфейсы (Moss, Pangram, Tines, Lightspark, Glide). Для: дашбордов, тарифов SaaS, фич-секций.
**refero.design**: десятки тысяч экранов web/iOS с продвинутым поиском (страница на JS). Для: поиска конкретного паттерна по слову («booking», «calendar», «checkout»).
**collectui.com**: ежедневные UI-шоты по категориям. Для: отдельных компонентов (календарь, форма, карточка).
**daisyui.com**: состояния компонентов (button/input/toast) — проверка полноты состояний.

### Цвет, шрифты, Figma
**coolors.co, designspiration.com**: палитры и мудборды. **fonts.google.com, myfonts.com** (только free-fonts.md).
**Figma-кит Vistora** (prototype-kit.md): рамка с вырезами, сцена, продукт ломает рамку, призрачный шрифт, бенто, плавающий proof. Это основа языка — источники выше только дополняют.

## 2. Таблица решений: задача → куда идти → что смотреть

| Задача | Куда идти (по порядку) | Что именно смотреть |
|---|---|---|
| Спокойный люксовый hero | prototype-kit (Aurora, Haven, Diviny) → minimal.gallery → godly.design → horizonx «Lotus Perfume», «Alder & Stone» | Тонкий serif + вводное слово цветом (без курсива), много воздуха, одно фото продукта, одна кнопка; медленный fade, не больше |
| Hero, который продаёт за 5 секунд | hero.gallery → onepagelove → kit (рамка + плавающий proof) | Оффер + действие в первом экране, карточка рейтинга/цены/слота поверх фото |
| Hero-формула «объект + карточки» | figmaformotion «Product Spotlight» → horizonx hero-раздел | Один объект, 2–3 карточки фактов, одно медленное движение; без неона |
| 3D-объект | cssdesignawards (3D-номинанты) → figmaformotion (3D-проекты) → horizonx мокапы | Матовый материал, реальный свет, объект ломает рамку; проверить вес и fallback-картинку |
| Scroll-driven история | lenis.dev/showcase (в браузере) → figmaformotion «Scroll Stories» → gsap ScrollTrigger-демо → neuro.kolpadesign.ru/vau | Pinned-секция, смена 3–5 кадров, передача секция→секция; одно сигнатурное движение |
| Вау-приём под нишу | neuro.kolpadesign.ru/vau (фильтр ниша/настроение) → godly → cssdesignawards | Один приём, привязанный к главной ценности |
| Анимированный фон / шейдер | horizonx (Marble Signal, Warm Press) → motionsites → reactbits | Тёплая матовая текстура, низкий контраст; почти всегда — статичная картинка лучше |
| Микро-движение кнопок и карточек | figmaformotion «Magnetic Interaction» → reactbits → 21st.dev → originkit | Hover/pressed/loading/success, одинаково по всему сайту, переписать на CSS |
| Кинетическая типографика | figmaformotion «Kinetic Typography» → reactbits (text) → godly | Только для одного заголовка-сигнатуры, не в каждом блоке |
| Меню / навигация | navbar.gallery (по типу) → refero → kit (вертикальный рейл) | Где главная кнопка, поведение при скролле, мобильное меню, announcement bar |
| Сетка фич / бенто | bentogrids (в браузере) → kit (Voltra, PowerCube) → saasframe | Одна большая ячейка + 2–4 малых, цифры как контент, диагональный срез |
| Отзывы, цифры, логотипы | unsection → onepagelove → (lapa.ninja — заблокирован) | Какой proof продаёт в нише и где он стоит |
| Тарифы | pricingpages.design → saasframe → cta.gallery «pricing CTA» | Понятная цена, рекомендованный план, без сюрпризов, CTA в каждом плане |
| Флоу бронирования | mobbin (поиск «booking», флоу) → refero («calendar», «booking») → collectui (date picker) | Шаги, выбор слота, ошибки, экран подтверждения, сколько полей минимум |
| Чекаут / форма заявки | mobbin → refero → daisyui (состояния input) | Порядок полей, inline-ошибки, прогресс, успех |
| Финальный CTA | cta.gallery (call-to-buy, form, subscription) → footer.design | Одно действие + причина сделать сейчас |
| Футер | footer.design → kit (тёмная карточка + гигантский вордмарк) | Контакты, карта, CTA, вордмарк |
| 404 / пустое состояние | 404s.design | Полезный тупик, который ведёт обратно к цели |
| Палитра | фото клиента → coolors → designspiration | 6 цветов из фото + один насыщенный акцент, проверка контраста |
| Шрифтовая пара | recent.design / godly (что в тренде) → fonts.google.com | Новая пара на каждый проект, сверка с project-log.md |
| Планка качества | cssdesignawards WOTD → godly → critique.md | «Получит ли Honorable Mention и продаёт ли» |

## 3. Доступ (22.10.2026)
- **200, текст читается:** figmaformotion, horizonx, navbar.gallery, hero.gallery, godly, neuro.kolpadesign.ru/vau, unsection, onepagelove, minimal.gallery, pricingpages, cta.gallery, footer.design, 404s.design, mobbin (главная), saasframe, collectui, 21st.dev, reactbits, motionsites, particles.casberry, recent.design, httpster, cssdesignawards.
- **200, но контент на JS (нужен headless Chromium):** lenis.dev/showcase, bentogrids, refero, originkit.
- **Закрыто:** awwwards (нет ответа), land-book (403, Cloudflare challenge), lapa.ninja (403, Cloudflare block). Также по reference-map: behance (блок), dribbble (бот-проверка), siteinspire (429).
- **Частично платно / за логином:** figmaformotion (Premium), mobbin (полные флоу), refero (поиск).
- Для закрытых — просить у Вероники ссылки или скриншоты конкретных работ; не тратить время на обход.

## Дособрано в браузере 22.10
- lenis.dev/showcase: 45R Indigo Story, Shiftbrain, Ingraft, Supercolor, Granola, Good Fella, NY Philharmonic (Dudamel), Cartier Roadster, JKR, Aventura Dental Arts, Tenbin, Peach Web, Utsubo, OP–XY, Studio Cloudfairy — эталоны плавного скролла и scroll-историй; брать ритм секций и переходы, не перехват скролла.
- bentogrids.com: бенто у Pixelmator, Frame.io, Medusa, Huly, Neon, Tailwind UI, GLP Coaching, Unicorn.studio — для блоков «что внутри / почему мы» с ячейками разного веса.
- refero.design: экраны и флоу (Signing up & onboarding: Duolingo, Square, PayPal, Intercom; Testimonials: Linear, Homerun) — для флоу записи и блоков отзывов.
- originkit.dev: компоненты и секции (Trending / Most copied) — идеи компонентов, переписывать на чистый CSS.
