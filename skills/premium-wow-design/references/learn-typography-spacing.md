> Статус: собрано исследователем 22.10 в основном по памяти о первоисточниках, большая часть ссылок не открывалась. Цифры — ориентиры; правила Вероники (taste.md, human-made.md) важнее этого файла.

# Типографика и отступы для премиальных маркетинговых сайтов

Справочник для применения «как есть» в чистом HTML/CSS. Студии, бутики, отели/рестораны, D2C-бренды.
Принцип: премиальность = сдержанность + точность + воздух. Вау = один смелый типографический жест, а не десять.

## 1. Базовые величины
- Body на десктопе: 17–20px (Butterick: 15–25px для веба; премиум-сайты чаще 18px). Мобайл: 16–17px, никогда <16px (iOS зумит инпуты <16px).
- Мелкий текст (подписи, лейблы): не меньше 13–14px; caps-лейблы 11–13px только с трекингом.
- Задавай размеры в rem, база `html{font-size:100%}`; не фиксируй `px` у html — ломает пользовательский зум.
- Вес body: 400 (на тёмном фоне 300–350 у вариативных шрифтов, т.к. светлый текст «полнеет»).
- Цвет текста не #000 на #fff: ~#111–#1a1a1a или тёплый тёмный; вторичный текст через непрозрачность/тон, контраст ≥4.5:1 (WCAG AA).

## 2. Модульная шкала
- Соотношения: 1.2 (minor third) — плотный UI/контент; 1.25 (major third) — универсально; 1.333 (perfect fourth) — маркетинг; 1.5–1.618 — editorial, крупные дисплейные hero.
- Fluid-подход (Utopia): разные ratio на мин/макс экране. Пример: 360px → ratio 1.2, base 16; 1440px → ratio 1.333, base 19. Мобайл шкала сжимается, десктоп раскрывается.
- Формула clamp: `clamp(MIN, calc(A + B*vw), MAX)`, где B = (max−min)/(vwMax−vwMin)*100, A = min − B*vwMin/100. Добавляй rem в preferred-значение (`1rem + 2vw`), чтобы работал зум (WCAG 1.4.4).
- Готовая шкала (360→1440px, 1.2→1.333):
```css
:root{
  --step--1: clamp(0.83rem, 0.80rem + 0.15vw, 0.94rem);
  --step-0:  clamp(1rem, 0.95rem + 0.25vw, 1.19rem);
  --step-1:  clamp(1.2rem, 1.11rem + 0.42vw, 1.58rem);
  --step-2:  clamp(1.44rem, 1.29rem + 0.68vw, 2.11rem);
  --step-3:  clamp(1.73rem, 1.48rem + 1.08vw, 2.81rem);
  --step-4:  clamp(2.07rem, 1.69rem + 1.67vw, 3.75rem);
  --step-5:  clamp(2.49rem, 1.91rem + 2.55vw, 5rem);
  --step-hero: clamp(3rem, 1.8rem + 6vw, 9rem); /* дисплейный жест */
}
```
- Refactoring UI: шкала — это ограниченный набор, а не формула-догма; 6–8 размеров на весь сайт достаточно. Никаких 15/17/22/27px «на глаз».
- Иерархию строй не только размером: вес, цвет, регистр, трекинг. Часто достаточно 2–3 размеров на экране.

## 3. Длина строки (measure)
- Body: 45–75 знаков, идеал ~60–66 (Bringhurst/Butterick). CSS: `max-width: 65ch` (для широких гротесков 60ch).
- Лид/интро: 35–50ch. Заголовки: 10–20ch, `max-width: 14ch–18ch` для h1, чтобы ломались в 2–3 строки.
- Мобайл: 30–45 знаков — нормально.
- `text-wrap: balance` для заголовков (≤6 строк), `text-wrap: pretty` для абзацев (убирает висячие слова).
- Не растягивай текст на всю колонку 12-колоночной сетки — текст живёт в 6–7 колонках.

## 4. Межстрочный интервал (line-height)
- Обратная зависимость: чем крупнее кегль, тем меньше интерлиньяж.
- Body 16–20px: 1.5–1.7 (длинные строки → ближе к 1.7; узкие колонки → 1.45).
- Лид 20–24px: 1.4–1.5. H3–H4: 1.25–1.35. H1–H2: 1.05–1.2. Дисплей 64px+: 0.9–1.05 (у serif с высокими выносными — не ниже 0.95).
- Caps-строки и кнопки: 1–1.2.
- Безразмерное значение (`1.5`), не px/em — иначе наследуется криво.
- Формула для fluid: `line-height: calc(1em + 0.5rem)` — автоматически плотнее на крупных кеглях.

## 5. Трекинг (letter-spacing)
- Body: 0. Никогда не разреживай строчной текст основного кегля.
- Дисплей 40px+: отрицательный −0.01…−0.03em (гротески типа Inter/Neue Montreal до −0.04em при 80px+). Serif-дисплей: 0…−0.02em.
- ВЕРСАЛЬНЫЕ лейблы/eyebrow/навигация: +0.05…+0.15em (Butterick: 5–12%). Маленькие капсы 11–12px: +0.08–0.14em.
- Мелкий текст 12–14px строчными: +0.01em допустимо.
- Цифры в ценах/таблицах: `font-variant-numeric: tabular-nums` (lining-nums для гротеска, oldstyle-nums — для изысканного serif-текста).
- Не используй фейковый bold/italic: подключай реальные начертания; `font-synthesis: none`.

## 6. Сколько шрифтов и начертаний
- 1–2 семейства (максимум 3, если третий — моно для деталей). Один суперсемейный шрифт — тоже премиально.
- 3–4 начертания на весь сайт: например Regular 400, Medium 500, Semibold 600 и дисплейный вес. Без italic.
- Контраст через роли: display (характер) + text (нейтральная читабельность). Два «характерных» шрифта = конфликт.
- Логика пары: контраст по классификации (serif ↔ grotesque), сходство по пропорциям (x-height, ширина, «эпоха»). Похожие-но-разные (две гуманистические гротески) — худший вариант.
- Акцент на 1–2 словах заголовка: цвет, вес, подчёркивание-линия, другой кегль. **Курсив запрещён правилом Вероники** — он выдаёт ИИ-сайт.
- Self-host woff2 или Google Fonts с `display=swap`; подгружай только нужные веса; вариативный шрифт если >3 весов; `preload` для шрифта hero.

## 7. Пары Google Fonts (премиальные)
Display / Text — характер — где уместно:
1. Fraunces (opsz, SOFT≈50, WONK 0) / Inter Tight — тёплый editorial — кафе, D2C-еда.
2. Cormorant Garamond (500–600, крупно!) / Manrope — тонкий люкс — отели, ювелирка. Cormorant только ≥32px.
3. Instrument Serif / Instrument Sans — модный editorial — студии, косметика.
4. Newsreader (opsz) / Geist или Hanken Grotesk — интеллигентно, журнально.
5. Bodoni Moda (opsz) / Jost — фэшн, высокий контраст — бутики одежды.
6. EB Garamond / Work Sans — классика, спокойствие — винодельни, книжные.
7. DM Serif Display / DM Sans — крепко, доступно-премиально (но уже частый выбор).
8. Libre Caslon Display / Libre Franklin — американский heritage — barbershop, ремёсла.
9. Gloock / Figtree — контрастный современный serif — бутик-отели.
10. Syne (700–800) / Space Grotesk или Inter — арт/студия, вау-гротеск.
11. Archivo (вариативная ширина, Expanded/Black) / Archivo — гротеск-моносемья — спорт, D2C-техника.
12. Bricolage Grotesque (opsz) / Albert Sans — характерный, дружелюбный — D2C, wellness.
13. Unbounded / Onest — широкий дисплей — молодёжные бренды (дозировано).
14. Marcellus (только лого/eyebrow/короткие заголовки) / Karla — спокойный антик — спа, wellness.
15. Один шрифт: Inter Tight или Geist (300–600) с жёсткой шкалой — минималистичный tech-премиум; Hanken Grotesk — мягче.
Более редкая премиальность — платные/бесплатные вне Google (Fontshare: Satoshi, General Sans, Clash Display, Cabinet Grotesk, Zodiak, Erode, Gambetta) — ощущаются «не шаблонно».

### Затёртые / «AI-шаблонные» сочетания (избегать или оправдывать)
- Playfair Display + Inter / Lato / Raleway / Montserrat — главный маркер «сгенерировано».
- Inter везде, Inter + Inter, Poppins везде, Montserrat заголовки + Open Sans текст.
- Roboto/Open Sans/Lato как «премиум» — нет, это дефолт 2014.
- Space Grotesk + Inter на «креативных» лендингах, DM Serif + DM Sans без кастомизации.
- Cinzel, Great Vibes, Dancing Script, Pacifico для «роскоши» — дёшево. Скрипты только в лого.
- Если выбираешь популярный шрифт — уводи от дефолта: opsz, отрицательный трекинг, необычный вес (300/600 вместо 400/700), stylistic sets (`font-feature-settings: "ss01"`).

## 8. Система отступов
- База 4px, шаг 8px (8pt grid). Шкала: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160, 192. Ничего между (Refactoring UI: шаги должны отличаться ≥~25%).
- Fluid-отступы (Utopia space): пары значений мобайл→десктоп, например:
```css
:root{
  --space-xs: clamp(0.5rem, 0.45rem + 0.2vw, 0.75rem);
  --space-s:  clamp(1rem, 0.9rem + 0.4vw, 1.5rem);
  --space-m:  clamp(1.5rem, 1.3rem + 0.8vw, 2.25rem);
  --space-l:  clamp(2rem, 1.6rem + 1.8vw, 4rem);
  --space-xl: clamp(3rem, 2.2rem + 3.5vw, 6rem);
  --space-section: clamp(4.5rem, 3rem + 7vw, 10rem);
  --gutter: clamp(1rem, 0.6rem + 2vw, 2.5rem);
}
```
- Every Layout: используй «Stack» — `.stack > * + * { margin-block-start: var(--space, 1.5rem) }`; отступы задаёт родитель, а не компонент. Только margin-block-start (одно направление).
- Начинай с избытка воздуха и убирай (Refactoring UI: «start with too much white space»). Премиум почти всегда «больше воздуха, чем кажется нужным».

## 9. Вертикальный ритм и группировка
- Закон близости: расстояние внутри группы < расстояния между группами минимум в 2 раза.
- Над заголовком отступ больше, чем под ним (≈2:1). Заголовок «притянут» к своему тексту.
- Eyebrow → H2: 8–16px. H1 → лид: 16–32px. H2 → абзац: 16–24px (0.5–0.75em от размера H2). H3 → текст: 8–12px.
- Абзац → абзац: 1em (= line-height-ish) или 0.75–1em; не используй и красную строку, и отступ одновременно.
- Текст → кнопка: 32–48px. Между кнопками: 12–16px.
- Строгая baseline-сетка в вебе не обязательна; важна консистентность токенов. Ритм = повтор одних и тех же интервалов.
- `margin-trim`/обнуление: убирай margin-top у первого и margin-bottom у последнего ребёнка секции.

## 10. Секции, контейнер, поля
- Padding секций: десктоп 96–160px (премиум-лендинги 120–200px), планшет 72–112, мобайл 56–80px. Hero — может быть 100svh или 80–90svh.
- Чередуй ритм: не все секции одинаковой высоты — плотная/воздушная/полноэкранная.
- Боковые поля: мобайл 16–24px (20px — хорошо), планшет 32–48, десктоп 48–96px или контейнер 1200–1440px + поля. Editorial-сайты: полноширинная сетка с полями 2–5vw.
- Сетка: 12 колонок десктоп, gap 20–32px; 4–6 колонок мобайл.
- Карточки: внутренний padding 24–40px; радиус согласован с padding (внутренний радиус = внешний − padding).
- Отступы между карточками ≤ внутреннего padding карточки.

## 11. Кнопки и тап-зоны
- Тап-цель ≥44×44px (Apple HIG), Material 48×48dp; WCAG 2.2 минимум 24×24 (AA). Ориентируйся на 44–48.
- Кнопка: высота 44–56px; padding ~ `0.875em 1.75em`; горизонтальный ≈ 2× вертикального.
- Текст кнопки 15–17px, weight 500; caps-кнопки — +0.06–0.1em трекинг и 13–14px.
- Между тап-целями ≥8px.
- Ссылки в тексте: подчёркивание `text-underline-offset: 0.2em; text-decoration-thickness: 1px` — аккуратно и премиально.

## 12. Тонкости, отличающие профи
- Настоящие кавычки “ ” / « », апостроф ’, тире — (en – для диапазонов 10–12), многоточие …, × в размерах, неразрывный пробел перед единицами и после коротких предлогов.
- `hanging-punctuation: first` (Safari) или отрицательный text-indent для висячих кавычек в цитатах.
- Оптический кернинг: `font-kerning: normal`; лигатуры включены по умолчанию — не отключай.
- Крупный дисплей выравнивай оптически: левый край буквы часто отстоит — сдвиг −0.02…−0.05em.
- Заголовки по левому краю; центрирование — только для коротких блоков (≤3 строк). Никогда не центрируй абзацы body.
- Caps только для коротких лейблов (≤3–4 слов), не для заголовков из 8 слов.
- `-webkit-font-smoothing: antialiased` на тёмном фоне; на светлом — по вкусу.
- Размер цифр в статистике/ценах — дисплейный шрифт, но tabular-nums.

## 13. Типичные любительские / AI-признаки
- Playfair+Inter, Poppins, Montserrat; градиентный текст в заголовке; эмодзи в заголовках.
- Все заголовки по центру, все секции одинаковой структуры «eyebrow-H2-абзац-3 карточки».
- Одинаковые отступы везде (py-16 на каждой секции) — нет ритма; или наоборот хаотичные 37/43px.
- Bold 700 на всём, слишком много весов; заголовки и текст одного веса и цвета (нет иерархии) — или иерархия только размером.
- Разреженный строчной текст; caps без трекинга; дисплей с положительным трекингом и line-height 1.5.
- Body 14px на десктопе, строки 120+ знаков, серый текст #999 на белом (низкий контраст).
- Висячие одиночные слова в заголовках, «вдовы» в абзацах.
- Прямые кавычки "", дефис вместо тире, тройная точка.
- Псевдо-bold/italic, FOUT/скачок макета без `size-adjust`/fallback-метрик.
- Иконки и текст не выровнены по оптической оси; кнопки разной высоты рядом.
- Маленький tap-target в мобильном меню; отступ мобайл = десктоп ÷ 1 (огромные пустоты) или ÷ 4 (тесно).

## 14. Чек-лист аудита
- [ ] ≤2 семейства, ≤4 начертания; пара не из «затёртого» списка или уведена от дефолта.
- [ ] Все размеры из шкалы (токены `--step-*`), fluid через clamp с rem-частью; зум 200% не ломает.
- [ ] Body ≥16px мобайл / 17–20px десктоп; контраст ≥4.5:1 (крупный ≥3:1).
- [ ] Measure 45–75ch (`max-width: 65ch`); h1 ≤ ~18ch; `text-wrap: balance/pretty`.
- [ ] Line-height: body 1.5–1.7, заголовки 1.05–1.2, дисплей ≤1.05.
- [ ] Трекинг: дисплей отрицательный, caps положительный, body 0.
- [ ] Все отступы из шкалы 4/8 (`--space-*`); над заголовком > под заголовком; группировка по близости.
- [ ] Section padding: десктоп ≥96px, мобайл 56–80px; секции различаются ритмом.
- [ ] Боковые поля мобайл 16–24px; нет горизонтального скролла на 320–375px.
- [ ] Тап-цели ≥44px, промежутки ≥8px; кнопки одинаковой высоты.
- [ ] Типографские знаки: кавычки, тире, nbsp, tabular-nums в ценах.
- [ ] Нет фейковых начертаний; шрифты woff2, swap, preload hero-шрифта, ограниченный набор весов.
- [ ] Есть один осознанный типографический «вау»-жест (огромный дисплей, цветовой акцент, широкий гротеск) — и только один.
- [ ] Проверено на 375, 768, 1280, 1440, 1920px.

## Источники
- https://practicaltypography.com/typography-in-ten-minutes.html
- https://practicaltypography.com/line-length.html
- https://practicaltypography.com/line-spacing.html
- https://practicaltypography.com/letterspacing.html
- https://practicaltypography.com/all-caps.html
- https://www.refactoringui.com/
- https://www.refactoringui.com/previews/building-your-color-palette (серия статей Refactoring UI)
- https://every-layout.dev/layouts/stack/
- https://every-layout.dev/rudiments/modular-scale/
- https://utopia.fyi/type/calculator/
- https://utopia.fyi/space/calculator/
- https://utopia.fyi/blog/designing-with-fluid-type-scales/
- https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/
- https://www.smashingmagazine.com/2023/06/build-fluid-typography-scale-calculator/
- https://typescale.com/
- https://fonts.google.com/knowledge
- https://fonts.google.com/knowledge/using_type/choosing_a_type_scale
- https://fonts.google.com/knowledge/readability_and_accessibility/introducing_parameters_for_readability
- https://www.typewolf.com/google-fonts
- https://www.typewolf.com/cheatsheet
- https://www.fontshare.com/
- https://webtypography.net/ (Richard Rutter, по Bringhurst)
- https://m3.material.io/foundations/layout/understanding-layout/spacing
- https://developer.apple.com/design/human-interface-guidelines/accessibility
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap
- https://www.wix.com/blog/worst-website-font-pairings
- https://uxdesign.cc/is-ai-better-at-picking-and-pairing-fonts-than-you-b8a05c029cc6
- https://www.inspoai.io/blog/best-font-pairings-for-websites

## Проверено по источникам 22.10
- Utopia (utopia-core, npmjs.com/utopia-core): fluid-шкала строится между min/max ширинами с отдельными ratio для мобайла и десктопа; пример в пакете 1.2 → 1.25, 320–1240px, проверка зума 200% (WCAG 1.4.4). Рекомендацию «1.333 на десктопе» источник не подтверждает — это выбор дизайнера; для премиальных лендингов ставить 1.25–1.333.
