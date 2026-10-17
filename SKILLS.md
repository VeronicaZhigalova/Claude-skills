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

Все сторонние навыки — MIT, лицензии лежат в их папках.

## Установлены как плагины в окружении (проверено)
- ui-ux-pro-max (nextlevelbuilder/ui-ux-pro-max-skill) — ставится setup-скриптом `uipro init --ai claude`
- frontend-design (anthropics/skills)
- impeccable (pbakaus/impeccable)
- awesome-design-md (voltagent/awesome-design-md)
- playwright-cli (microsoft/playwright-cli)
- emil-design-eng и анимационные навыки Эмиля (anthropic-skills)
- taste-skill, audit-suite, a11y-enforcer, hzblj-skills (GSAP, motion, typography), figma

Если окружение новое и плагинов нет — сказать Claude «установи плагины из SKILLS.md».

## Библиотеки (не навыки, а инструменты кода)
- GSAP + ScrollTrigger, Lenis (`references/lenis-readme.md`), anime.js — анимации и скролл
- React Three Fiber (pmndrs/react-three-fiber) — 3D на React; для чистого HTML используем Three.js напрямую (плагин parallax-threejs для отладки)
- Real-ESRGAN (через torch + spandrel) — апскейл фото до 4K (`references/workflow-rules.md`)
