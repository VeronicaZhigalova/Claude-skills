# Навыки (skills) и инструменты

## В этом репозитории (подключаются автоматически в сессии с репозиторием)
Папка `.claude/skills/`:

| Навык | Откуда | Зачем |
|---|---|---|
| premium-wow-design | наш | главный процесс: бриф → баланс → направления → вёрстка → аудит |
| web-design-guidelines | vercel-labs/agent-skills | проверка UI по гайдлайнам Vercel |
| wcag-audit-patterns | wshobson/agents | аудит доступности WCAG 2.2 |
| emil-design-eng, emil-animation-performance, emil-review-animations, emil-pick-ui-library, emil-prototype | emilkowalski/skills | качество анимаций и деталей интерфейса |
| gstack-design-review, gstack-design-consultation, gstack-design-shotgun, gstack-design-html, gstack-qa | garrytan/gstack | дизайн-ревью «глазами дизайнера», варианты дизайна, QA. Рассчитаны на браузер gstack (`$B`) — вместо него используем Playwright |
| app-store-review | safaiyeh/app-store-review-skill | проверка мобильных приложений по правилам App Store (для iOS-проектов) |
| find-skills | vercel-labs/skills | поиск и установка новых скиллов (skills.sh, `npx skills find`) |
| humanizer | blader/humanizer | убирает «ИИ-интонацию» из текстов сайта |
| stop-slop | hardikpandya/stop-slop | стоп-лист шаблонных фраз в копирайте |
| web-typography | wondelai/skills | типографика для веба: шкала, пары шрифтов, читаемость |
| bencium-design-audit, bencium-typography | bencium/bencium-marketplace | дизайн-аудит и типографика |
| diagram-design | cathrynlavery/diagram-design | красивые схемы и диаграммы (для кейсов портфолио) |
| frontend-slides | zarazhangrui/frontend-slides | HTML-презентации для клиентов; скрипт деплоя удалён, только локально/PDF |
| owl-critique-* (7), owl-form-design, owl-loading-states, owl-microinteraction-spec, owl-navigation-patterns, owl-peak-end-rule | owl-listener/designer-skills | критика: цвет, типографика, композиция, иерархия, бренд; UX-паттерны |
| ux-designer | szilu/ux-designer-skill | UX-канон: законы UX, формы, навигация, исследования, онбординг, этика, 30+ справочников |
| ux-critique, ux-design-review, ux-design-qa, ux-a11y-audit, ux-writing, ux-grill-me, ux-redesign | plugin87/ux-ui-agent-skills | эвристики Нильсена, оценка по 6 измерениям, UX-тексты, «допрос» брифа, редизайн. Хуки плагина не ставили (запускали бы node-скрипты на каждую правку) |
| gsap-core, gsap-scrolltrigger, gsap-timeline, gsap-performance, gsap-plugins, gsap-utils | greensock/gsap-skills | официальные правила GSAP |
| transitions-dev | Jakubantalik/transitions.dev | готовые CSS-переходы (модалки, аккордеоны, тосты, чекбоксы). Pro-клиент с внешним API не ставили |
| make-interfaces-feel-better | jakubkrehel/make-interfaces-feel-better | детали полировки: тени, радиусы, оптика, иконки (есть и в audit-suite) |
| app-store-screenshots | ParthJadhav/app-store-screenshots | маркетинговые скриншоты для App Store / Google Play (для мобильных проектов) |
| pm-competitor-analysis, pm-user-personas, pm-customer-journey-map, pm-market-segments, pm-sentiment-analysis | phuryn/pm-skills | конкуренты, персоны, путь клиента, сегменты, анализ отзывов |
| customer-journey-mapping-workshop | deanpeters/Product-Manager-Skills | подробная карта пути клиента (воркшоп) |
| mk-cro, mk-copywriting, mk-copy-editing, mk-customer-research, mk-competitor-profiling, mk-offers, mk-pricing, mk-marketing-psychology, mk-site-architecture, mk-product-marketing | coreyhaines31/marketingskills | конверсия страниц, продающие тексты, исследование клиентов, офферы, цены, психология, структура сайта |
| ec-product-page-design, ec-checkout-flow-optimization, ec-conversion-rate-optimization, ec-social-proof-widgets, ec-product-reviews-ratings, ec-gift-cards, ec-returns-refund-policy, ec-free-shipping-thresholds, ec-cross-sell-upsell-engine, ec-guest-checkout, ec-product-comparison, ec-accessibility-commerce, ec-gdpr-ecommerce | finsilabs/awesome-ecommerce-skills (13 из 178) | UX интернет-магазина; технические (Shopify API, склад, бухгалтерия) не ставили — понадобятся при реальном подключении |

Не ставили: Understand-Anything (разбор кода, не дизайн). Уже были: taste-skill, web-design-guidelines, knowledge-work-plugins (design, marketing, product-management).

Все сторонние навыки — MIT, лицензии лежат в их папках.

## Установлены как плагины в окружении (проверено)
- ui-ux-pro-max (nextlevelbuilder/ui-ux-pro-max-skill) — ставится setup-скриптом `uipro init --ai claude`
- frontend-design (anthropics/skills)
- impeccable (pbakaus/impeccable)
- awesome-design-md (voltagent/awesome-design-md)
- playwright-cli (microsoft/playwright-cli)
- emil-design-eng и анимационные навыки Эмиля (anthropic-skills)
- web-design-guidelines (vercel), wcag-audit-patterns, humanizer, stop-slop, Understand-Anything (проверено, не нужно), knowledge-work-plugins
- taste-skill, audit-suite, a11y-enforcer, hzblj-skills (GSAP, motion, typography), figma

Если окружение новое и плагинов нет — сказать Claude «установи плагины из SKILLS.md».

## Библиотеки (не навыки, а инструменты кода)
- GSAP + ScrollTrigger, Lenis (`references/lenis-readme.md`), anime.js — анимации и скролл
- React Three Fiber (pmndrs/react-three-fiber) — 3D на React; для чистого HTML используем Three.js напрямую (плагин parallax-threejs для отладки)
- Real-ESRGAN (через torch + spandrel) — апскейл фото до 4K (`references/workflow-rules.md`)
