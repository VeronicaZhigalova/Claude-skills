# Figma: ремесло для дизайнера-агента

Собрано по открытым страницам (Figma Learn, figma.com, статьи практиков, страницы YouTube с главами). Номер в [скобках] ведёт к источнику в конце. Где пометка «(не проверено)», страницу открыть не удалось или там был только анонс.

## 1. Auto layout: база всех макетов [1]
- Включается через `Shift+A`. Три потока: **Vertical**, **Horizontal**, **Grid**.
- **Wrap** есть у горизонтального и вертикального потока: элементы переносятся в новый ряд или колонку. Vertical wrap не делает masonry, порядок элементов сохраняется.
- **Grid**: строки и колонки, элементы могут занимать несколько ячеек (span). Подходит для бенто, галерей, дашбордов.
- **Padding** задаётся одним значением, парой «вертикаль/горизонталь» или по каждой стороне. **Gap** задаётся числом или Auto (Between / Around / Evenly).
- Ресайз по каждой оси:
  - **Hug contents** — только у auto layout фреймов: фрейм обнимает детей с учётом паддингов. Пример из доки: текст 40px + паддинг 10+10 = 60px.
  - **Fill container** — только у детей auto layout: тянется на всё свободное место. Если хоть один ребёнок стоит на Fill, родитель по этой оси становится Fixed.
  - **Fixed**: любое ручное изменение размера включает Fixed.
  - **Min/Max width/height** работают поверх остальных режимов, в них можно подставить number-переменную.
- Быстрые жесты: двойной клик по краю рамки ставит Hug, `Alt` + двойной клик ставит Fill.
- **Ignore auto layout** (раньше назывался absolute position) выводит объект из потока, но оставляет его во фрейме. Такому объекту можно задать constraints. Нужен для бейджей, крестиков закрытия, плашек поверх.
- Вся сила в **вложенных** auto layout фреймах: у каждого свой padding и gap, направления можно смешивать.
- Детям auto layout constraints не задаются, вместо них работают Hug/Fill/Fixed. Самому auto layout фрейму внутри обычного фрейма constraints задать можно.
- **Canvas stacking** по умолчанию стоит в режиме «Last on top»: нижний слой рисуется поверх. Переключение: Auto layout settings → First on top [17].
- Видео: «Figma in 5: Auto Layout», главы: Basics → Using → Adding/Repositioning close buttons → Minimum width [24]. Mizko, «New Figma Auto Layout & Constraints», главы: Constraints → Center → Scale → Grids → Modal → Setting the constraints [24]. Чем Mizko советует решать конкретные задачи, я не знаю: транскрипт не открылся (YouTube вернул 429) (не проверено). Chris Lüders советует сначала видео Mizko, потом официальное видео о новинках auto layout 2022 года, файл «Figma Auto Layout Playground» и плагин Pro Layout Panel [20].

## 2. Constraints: поведение в обычных фреймах [2]
- По умолчанию стоит **Top + Left**.
- По горизонтали: Left, Right, Left and right (тянется), Center, Scale. Scale считает в процентах: слой 70px во фрейме 100px при ширине фрейма 200px станет 140px.
- По вертикали: Top, Bottom, Top and bottom, Center, Scale.
- Constraints работают только для слоёв внутри фрейма. На группы их не поставить: группа берёт границы у своих слоёв, и Figma применит constraints к каждому слою отдельно.
- `Shift` позволяет выбрать два constraint сразу (например, Left и Right). Если держать `Cmd/Ctrl` при ресайзе, constraints временно игнорируются.
- С layout guides типа Stretch constraints отсчитываются от ближайшей колонки или ряда, а не от края фрейма [7].

## 3. Layout guides (бывшие layout grids) [7]
- Три типа: **Uniform grid** (квадратная сетка, для иконок; по умолчанию 10px), **Columns**, **Rows**. Цвет по умолчанию #FF0000 с прозрачностью 10%.
- Для колонок есть типы Left/Center/Right/**Stretch**, для рядов Top/Center/Bottom/**Stretch**.
  - Stretch: ширина Auto, есть Margin и Gutter. Колонки тянутся вместе с фреймом.
  - Остальные типы считаются фиксированными: задаётся точная ширина или высота и Offset от края.
- На одном фрейме можно комбинировать несколько guides, например колонки и ряды. Guides можно ставить и в компоненты, потому что компонент тоже фрейм.
- `Shift+G` скрывает или показывает все guides в файле. Скрытые продолжают работать.
- Удачную сетку стоит сохранить как стиль layout guide. В count, width, margin, gutter и offset можно подставлять number-переменные [11].

## 4. Компоненты и варианты [5][6][15][16]
- **Вариант** — это компонент внутри **component set**. Все варианты набора используют одни свойства, и у каждого должна быть уникальная комбинация значений, иначе Figma покажет конфликт.
- Что выносить в варианты: **Style, Size, State**, то есть визуально или структурно разные состояния. Что выносить в свойства компонента: изменения на уровне контента [16].
- Разные иконки в варианты не объединяют. Варианты допустимы, только если это размеры одной иконки [5].
- Перевод старых компонентов в варианты по имени: `Button/Primary/Large/Default` превращается в набор Button со свойствами. Первое свойство Figma назовёт «Variant», следующие «Property 2», «Property 3»… Их обязательно переименовать. У всех компонентов должно быть одинаковое число слэшей [5].
- Внутрь component set нельзя класть текст, аннотации или фреймы. Подписи осей ставят рядом на холсте, а варианты раскладывают сеткой по свойствам [5].
- Быстрые клавиши: создать компонент `Cmd+Opt+K` (`Ctrl+Alt+K`), дублировать вариант `Cmd/Ctrl+D` [5].
- **Свойства компонента** [6]:
  - **Boolean** — сейчас только для видимости слоя (иконка в кнопке и т. п.). Важно: если два состояния схлопнуть в один компонент через boolean, между ними нельзя будет провести прототипную связь.
  - **Instance swap** + **preferred instances** — короткий список разрешённых подстановок. Пример из доки: из 100+ иконок для кнопки годятся 8.
  - **Text** — редактируемый текст прямо в правой панели.
  - **Variant**.
  - **Slot** — гибкая область, куда в инстансе можно добавлять и переставлять контент без detach. Хорошо подходит для списков [6]. GitLab советует, чтобы отступы в слоте задавал родительский компонент, а не вставляемый контент [22].
  - **Expose nested instances** выводит свойства вложенных инстансов на верхний уровень, и глубоко выделять слои уже не нужно.
- GitLab отказался от «base components» (компонент, где собраны все опции): они раздувают файл, тормозят прототипы и хуже сохраняют overrides. Плоская структура лучше [22].
- Видео Jesse Showalter «How to Master Figma and Design 10X FASTER!», главы: Design Systems → Auto Layout → Components → Grids & Guides → Bulk Image Upload → Custom Commands → Drag with Spacebar → Variables [24]. Содержимое глав (не проверено).

## 5. Именование [13][15][22][14]
- Слэш-нотация задаёт иерархию в Assets и в Swap instance: `Button/Active`, `Icon/Close`. Если включить **Show subfolders**, Assets покажет вложенные папки [13][15].
- Похожие компоненты Figma подбирает по имени и по расположению: компоненты в одном фрейме или секции считаются связанными. Страницы в Assets идут по алфавиту, а не в порядке файла [13].
- Компонент называют по тому, **чем он является**, а не как выглядит: `blue-large-button` сломается при первом ребрендинге [15].
- Конвенцию нужно решить заранее: регистр (Title / lower / camelCase), сокращения, термины (modal или dialog, toast или notification), формулировки boolean (Has Icon / Show Icon), значения (SM/MD/LG или Small/Medium/Large, Hover или Hovered) [15].
- Имена должны совпадать с кодом: компоненту `Button` соответствует `<Button>`. Если в Figma `CTA`, а в коде `<Action>`, при передаче будут ошибки [15].
- Слои внутри компонентов тоже называют: `card-thumbnail`, `user-avatar`, а не `Rectangle 4`. Это нужно разработчикам и AI-инструментам [15]. Массовое переименование: `Cmd/Ctrl+R` [21][24].
- Иерархия GitLab: страница = компонент, фрейм = компонент или категория, слой = `Property=Value` для вариантов. Размеры и брейкпойнты пишут как `xs…xl`, `≥md` [22].
- Префикс `.` или `_` прячет компонент из публикуемой библиотеки. Это я видел только в сводке поиска (не проверено).

## 6. Стили и переменные [9][10][11][12]
- **Переменная** хранит одно сырое значение на каждый режим (mode) и показывает только одно значение за раз. **Стиль** хранит набор значений и применяет их все сразу (шрифт + размер + вес; стопку заливок; градиент; изображение; блендинг) [9].
- Типы переменных: Color, Number, String, Boolean, а в новых версиях ещё Timing (мс) и Easing (кривая или spring) [10].
- Aliasing есть только у переменных: переменная может ссылаться на переменную того же типа. Переменные можно применять к стилям, а стили к переменным нельзя [9][11].
- Внутри стилей тоже можно использовать переменные. Пример: размер шрифта 16 в режиме mobile и 18 в режиме desktop внутри text style, и тогда режим переключает типографику [9]. То же у moonlearning: «Automating responsive typography with variables and modes», главы: Setting up modes → Use multiple modes at once → iOS → Android [24].
- **Scope** ограничивает, где можно применить переменную. Например, radius-токен виден только в corner radius, а color-токен только в text fill [11].
- **Code syntax**: для каждой переменной задаётся имя для Web, Android и iOS. Его видно в Dev Mode в сниппетах CSS, SwiftUI и Compose [11].
- В коллекции до 5000 переменных. Режим по умолчанию — самый левый столбец. Количество режимов зависит от тарифа: на Free режимы недоступны, на платных и Education доступны [10][11][12].
- Режимы ставятся на страницу, секцию, фрейм, группу, компонент или слой. Объект в режиме Auto наследует режим родителя или режим по умолчанию [12].
- Токены импортируются из JSON в формате **DTCG** [12].
- Официальное видео Figma «Intro to variables», главы: Color variables → Create tokens → Apply → Styles vs variables → Modes → Number variables → Themes [24].

## 7. Дизайн-токены и архитектура [14][19]
- Три слоя:
  - **Primitive** (`blue-500`, `space-8`) — значения без контекста.
  - **Semantic** (`text-secondary`, `color/action/primary`) — роль.
  - **Component** (фон primary-кнопки) — исполнение [14].
- Порядок в Figma [14]:
  1. Коллекция Primitives: сначала цвет, отступы, типографика.
  2. Коллекция Semantic: значения — алиасы на примитивы.
  3. Режимы Light/Dark и бренды внутри семантической коллекции.
  4. Dev Mode: `color/action/primary` показывается как `--color-action-primary`.
- Правила [14]:
  - Называть по роли, а не по виду: `text-secondary` переживёт ребрендинг, `gray-text` нет.
  - Семантические токены ссылаются на примитивы, а не на другие семантические. Цепочки алиасов трудно поддерживать.
  - Начинать с ролей text, background, border, action.
  - Схема имени `category/role/variant`. Единой правильной конвенции нет, главное применять одну везде.
  - Стили пока лучше подходят для градиентов и типографики.
- Курс Figma «Introduction to design systems» (4 урока, 7 видео): Audit → Principles/Foundations (accessibility, color, type, elevation, iconography, layouts, grids, spacing) → сборка в Figma (структура библиотеки, atomic design, naming, стили цвета/текста/эффектов, icon component sets, компоненты со свойствами и вариантами, паттерны) → документация, версии, changelog, branching. В доп. уроке: миграция color styles в переменные и режимы для тем [19].

## 8. Структура файлов и страниц [16][18][21][23]
- У команд Dropbox, Expedia и Cash App: **файл на большой проект**, внутри **страницы** с разделением «в работе / на фидбек / готово к разработке». В названиях страниц используют эмодзи-статусы 🏗️ 💭 🚢. Разработчики получают одну ссылку [16].
- Обложка файла задаётся через Set as Thumbnail на любом фрейме [16]. Solid Digital делает обложки с цветом статуса и контактами (PM, dev, research). Туда не стоит писать даты, версии, «last updated» и оглавление [21].
- Приём Cash App: финальные экраны превращают в компоненты, а их **инстансы** кладут на чистую страницу для разработчиков. Правки делаются на рабочей странице и сами доезжают до чистой [16].
- В каждом файле дизайн-системы Expedia на каждый компонент заведён фрейм: имя, описание, правила использования, варианты, состояния. Тогда «Go to main component» сразу ведёт к документации [16]. Разработчиков нужно пригласить и в библиотеки, иначе у них будет 404 [16].
- Компонентом делают всё, что повторяется (nav, footer, кнопки). Но при исследованиях лишних компонентов не плодят [21]. Маленькую систему держат одной библиотекой, большую делят, например на mobile и desktop (Thomas Lowry, Figma, в пересказе Solid Digital) [21].
- Страницы по стадиям: wireframes / mockups / prototypes. Для research, wireframing и тестирования можно заводить отдельные файлы [23].
- Smashing #435: при большой системе нужно следить за весом файлов (Doctolib, Alice Packard). Для low-fi упоминаются киты WireFramer, Paper Wireframe Kit и Content Brick Kit [18].
- Christine Vallaure (moonlearning) ведёт бесплатный курс для начинающих (~1 час: файловая структура, фреймы, сетки, компоненты) и Figma Workflow Masterclass в Smashing (auto layout, variables, testing, documentation) [18]. Её сайт вернул 403, поэтому её конкретные правила структуры (не проверено).

## 9. Прототипирование [3][4][8][17]
- Взаимодействие = **trigger + action**. Связь = hotspot → noodle → destination. Назначением обычно служит top-level фрейм, только Scroll to может вести внутрь фрейма [8].
- Триггеры: On click/tap, On drag (в любую сторону, анимация идёт за пальцем), While hovering, While pressing (по отпусканию возврат), Key/Gamepad, Mouse enter/leave (с ноября 2023 срабатывают один раз при входе/выходе), Mouse down/up (вместе дают дропдаун), After delay (мс), When video hits/ends [4].
- On click нельзя сочетать с While hovering на одном объекте. Вместо hover тогда берут Mouse enter/leave [8].
- Анимация: тип, направление, галочка «animate matching layers», easing или spring, длительность от 1 до 10000 мс [8]. Matching interactions можно выделить и править разом, взаимодействия копируются через `Cmd/Ctrl+C/V` [8].
- **Smart animate** [3]:
  - Слои сопоставляются по **имени и месту в иерархии**. Анимируются scale, position, opacity, rotation, fill (включая градиенты и изображения).
  - Drop shadow, inner shadow и морфинг между разными формами не анимируются, вместо этого будет dissolve. Новые слои проявляются через dissolve, неизменённые слои не анимируются.
  - Исчезновение делают через opacity 0%, а не через скрытие слоя.
  - Кадры получают **дублированием**, тогда имена совпадут.
  - Чтобы слои *не* сопоставлялись, их группируют под уникальным именем.
  - С Slide/Move фон кадра не участвует в анимации, поэтому под контент кладут прямоугольник с заливкой.
  - Пока строите, ставьте длительность больше, так проще отлаживать.
  - В режиме Prototype наведение на слой подсвечивает совпадения в других кадрах.
- Видео Figma «Smart Animate and Drag Triggers», главы: matching layers + другие переходы → подсветка совпадений → Bulk rename → On drag + Smart animate [24].
- **Скролл** [17]:
  - Контент должен выходить за пределы фрейма.
  - Overflow: No / Horizontal / Vertical / Both.
  - Позиции: Scroll with parent / Fixed / Sticky. Sticky работает только при вертикальном скролле и прилипает в пределах прямого родителя. Fixed в auto layout не ставится, если у объекта не включён ignore auto layout.
  - Между экранами можно сохранять или сбрасывать позицию скролла.
- Интерактивные компоненты: состояния (default / hover / pressed) — это варианты, связанные взаимодействиями [25].

## 10. Передача в разработку (Dev Mode) [DM][16][14][15]
- Dev Mode включается `Shift+D`. Нужен Full или Dev seat на платном тарифе [DM]. Есть статус **Mark as ready for dev** для фрейма, компонента, инстанса или секции. Контент в секциях Dev Mode показывает первым, остальное свёрнуто.
- В Dev Mode есть: Compare changes (история фрейма), Compare with main component, dev resources (ссылки на GitHub/Jira/Storybook, переходят на все инстансы), component playground («Explore component behavior»), Code Connect (настоящий код дизайн-системы вместо сгенерированного; Professional и выше).
- Чек-лист передачи по всем источникам:
  1. Страница для разработки чистая, статусы проставлены.
  2. Всё собрано из компонентов и токенов.
  3. Имена слоёв и компонентов совпадают с кодом.
  4. У переменных заполнен code syntax.
  5. У компонентов есть описание и do/don't.
  6. Состояния hover/focus/active/disabled есть, focus виден.
  7. Accessibility-аннотации есть: роли, лейблы, порядок чтения [15].
- Изменения библиотеки [15]:
  - **Неломающие**: новое необязательное свойство (скрытое по умолчанию), визуальные правки.
  - **Ломающие**: удаление или переименование свойства, перестройка вариантов, переименование слоёв с overrides.
  - Перед публикацией проверить на файле-потребителе.
  - Вести changelog с метками [UPDATE] / [BREAKING] / [DEPRECATED].
  - Устаревшее помечать в имени и описании и давать время на миграцию.

## 11. Воркфлоу wireframe → hi-fi → прототип → передача (сводка из источников выше)
1. **Wireframe**: low-fi кит [18], отдельная страница или файл [23], сетка через layout guides [7], вся раскладка сразу на auto layout [1].
2. **Foundations**: примитивные и семантические переменные, text и effect styles, режимы Light/Dark и Mobile/Desktop [14][9][19].
3. **Hi-fi**: всё повторяющееся оформить компонентами [21], варианты для style/size/state, свойства для контента [15]. Mizko в мастер-классе 2024 года идёт так же: «Preparation stage (global styles, components)» → «Design stage (grid, autolayout, constraints)» → «Prototyping stage (animations, fixed elements)» [24].
4. **Прототип**: кадры дублировать для smart animate, имена держать в порядке, скролл и fixed-элементы, интерактивные компоненты [3][17].
5. **Передача**: ready for dev, чистая страница с инстансами, code syntax, документация [16][15].

## Как это применять у нас (HTML/CSS)
- Auto layout соответствует flex/grid: Hug ≈ `fit-content`, Fill ≈ `flex:1` / `1fr`, Gap ≈ `gap`, Ignore auto layout ≈ `position:absolute`, Wrap ≈ `flex-wrap`. Это моё сопоставление, а не цитата из доки.
- Переменные Figma соответствуют CSS custom properties с теми же семантическими именами (`--color-action-primary`) [14].

## Источники (открыты в этой сессии)
WebFetch не работал (DNS-ошибка), поэтому страницы открывал через curl и вытаскивал из них текст.
1. https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout
2. https://help.figma.com/hc/en-us/articles/360039957734 (constraints)
3. https://help.figma.com/hc/en-us/articles/360039818874 (smart animate)
4. https://help.figma.com/hc/en-us/articles/360040035834 (prototype triggers)
5. https://help.figma.com/hc/en-us/articles/360056440594 (create and use variants)
6. https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties
7. https://help.figma.com/hc/en-us/articles/360040450513 (layout guides)
8. https://help.figma.com/hc/en-us/articles/360040315773 (prototype interactions/animation)
9. https://help.figma.com/hc/en-us/articles/15871097384471 (variables vs styles)
10. https://help.figma.com/hc/en-us/articles/14506821864087-Overview-of-variables-collections-and-modes
11. https://help.figma.com/hc/en-us/articles/15145852043927-Guide-to-variables-in-Figma (отдала статью «Create and manage variables»: alias, scope, code syntax)
12. https://help.figma.com/hc/en-us/articles/15343816063383 (modes for variables, DTCG import)
13. https://help.figma.com/hc/en-us/articles/360038663994 (name and organize components)
14. https://www.figma.com/resource-library/design-tokens/
15. https://help.figma.com/hc/en-us/articles/39747637290263-Components-collection-Tips-for-component-management
16. https://www.figma.com/best-practices/guide-to-developer-handoff/
17. https://help.figma.com/hc/en-us/articles/360039818734 (отдала статью про scrolling/overflow/sticky)
18. https://www.smashingmagazine.com/the-smashing-newsletter/smashing-newsletter-issue-435/
19. https://help.figma.com/hc/en-us/articles/14552901442839 (курс Introduction to design systems)
20. https://chrislueders.substack.com/p/master-auto-layout-in-one-day-1234184
21. https://www.soliddigital.com/blog/3-ways-figma-organization
22. https://design.gitlab.com/get-started/uik-components
23. https://designproject.io/blog/how-to-organize-figma-files/
24. Страницы поиска YouTube, главы видео взяты из ytInitialData: youtube.com/results?search_query=mizko+figma+auto+layout | …moonlearning+figma+variables | …jesse+showalter+figma | …figma+smart+animate+tutorial+figma (видео rsE9MBOHQjE, XiqitRY3swo, TyaGpGDFczw, 1ONxxlJnvdM, h_S4jQrNi00, oCVG6DFCTz4, 6Id4INKEwb8). Страницы самих видео и транскрипты вернули 429 → (не проверено).
25. https://stevekinney.com/courses/figma/prototyping
- [DM] https://help.figma.com/hc/en-us/articles/15023124644247 (Guide to Dev Mode)
- Не открылись: moonlearning.io (403), designwithfemke.com (502), Medium/uxdesign.cc/prototypr (403), zeroheight (403). Материалов DesignWithFemke не нашёл.
