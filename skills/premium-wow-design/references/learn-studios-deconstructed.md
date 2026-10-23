> Важно: здесь записано, что реально стоит на чужих сайтах, включая курсив (Bandier и др.). Это наблюдение, не рекомендация: в наших проектах курсив допустим только как осознанный акцент на 1–2 словах (taste.md).

# Насмотренность: как студии и премиум-бренды принимают решения (разбор живых сайтов)

Дата снятия: 2026-10-22. Метод: headless Chromium 1440×900, `getComputedStyle` (h1/h2/body/кнопки), `document.fonts` (загруженные начертания), перехват запросов `.woff/.woff2`, частотный подсчёт цветов фона и текста, скриншот первого экрана.
Правило: всё, что ниже без пометки, **наблюдалось** на указанном URL. Интерпретация «почему» — мой вывод, помечен «→». Догадки помечены «(не проверено)».
Ограничения: Aesop, Sézane, Floom, siteinspire, godly, Awwwards, Codrops отдали Cloudflare/Vercel-челлендж или 403. Jacquemus был на техобслуживании. Active Theory и Messenger (abeto) не рендерятся в headless без GPU.

## Контекст: кто сейчас «в топе»
- Awwwards Studio of the Year 2025: **Malvah** (Кейптаун), первая студия из ЮАР (lbbonline.com/news/Malvah-Studio-of-the-Year-2025-Awwwards). На их сайте H1 так и написано: «AWWWARDS Studio of the Year '25» (malvah.co).
- Awwwards Site of the Year 2025: Messenger (abeto) и сайт Lando Norris от OFF+BRAND (Developer Award SOTY 2025, SOTD 17.11.2025, 8.18/10) (awwwards.com/sites/lando-norris, по поисковой выдаче).
- Свежие SOTD (сентябрь 2026): OFF+BRAND для Trevor Noah, HOLOGRAPHIK (Paul Kalkbrenner) (поисковая выдача по awwwards.com/inspiration_search/sites_of_the_day).
- Codrops 2025: кейсы 35mm (GLSL/Three.js), The Monolith (13 WebGL-сцен на R3F), Gentle Rain от Zajno (Unicorn Studio) (поисковая выдача по tympanus.net/codrops/2025/…, сами статьи отдали 403).

---

## A. Тихая роскошь: отели, клубы, парфюм, мода

**1. Aman** (aman.com): курорты ультра-люкс. Главное действие: кнопка «Reserve», тёмная, в шапке справа.
- Шрифты: Lyon Display Web Light 300 + Lyon Text Web 400 (засечки), Whitney SSm 300/400 для меню. H2 31px / lh 45px (1.45), letter-spacing 0.5px, вес 400.
- Палитра: фон body #F3EEE7 (тёплый крем), карточки #FDF9F5, текст #313131 и #585858. Чистого чёрного в тексте почти нет.
- Hero: видео на весь экран, логотип по центру с макроном «ĀMAN», шапка тонкая.
- → Почему: светлая засечка с широким интерлиньяжем звучит как «тишина и время», а крем вместо белого даёт тепло камня и льна. Отсюда правило: у люкса текст не чёрный, а графитовый (#313131).

**2. Soho House** (sohohouse.com): членский клуб. Действие: пилюля «Apply for membership» в центре hero.
- Шрифты: Cardo 400 (бесплатная Google-засечка) для H1 56/70px и H2 48/60px, HK Grotesk 400/700 для текста. Файлы лежат на своём CloudFront.
- Палитра: фон #FFFEF7 (почти белый с жёлтым оттенком), бежевые плашки #EBE3DB и #F0EEEB, текст #000.
- Hero: аэрофото фермы в рамке с полями (не в край), текст по центру «A home for the world's creatives to come together and belong».
- → Почему: бесплатная книжная засечка и фото «места» вместо людей продают не услугу, а принадлежность к кругу. Сделано на Nuxt.

**3. Le Labo** (lelabofragrances.com): нишевый парфюм. Сначала идёт гейт «SELECT YOUR LOCATION → ENTER SITE» поверх фото лаборатории.
- Шрифты: Bell Gothic Std 400/700 (телефонно-справочный гротеск), Magda, Helvetica Neue LT Condensed. H1 30px 700.
- Палитра: фон #F6F8F6, текст #000/#333/#424242, серые плашки #595959. Цвета нет вообще.
- → Почему: «утилитарная» типографика, как у этикетки или аптеки, повторяет легенду бренда о лаборатории, где флакон подписывают вручную. Роскошь здесь выражена через отказ от украшений.

**4. Diptyque** (diptyqueparis.com → us.diptyqueparis.com): свечи и парфюм, Shopify.
- Шрифты: собственная засечка «Diptyque Saint Germain» для H2 32/38px, Apercu Pro 300/400/700 для интерфейса.
- Палитра: #FFFFFF, текст #000 и #4D4D4D, единственный акцент — красный #D13037 (метки/цены). Секции с отступами 56px.
- → Почему: фирменная засечка несёт «Paris», нейтральный гротеск несёт магазин. Тёмные фото товара в hero.

**5. Byredo** (byredo.com): парфюм, Next.js.
- Шрифт: собственный byredoSans 400/700. Мелкие капс-метки 12px, ls 0.3–0.6px, радиус кнопок 6px.
- Палитра: #000, серый #767676, зелёно-серый #4D564F, плашки #F5F5F5. Hero: тёмно-коричневое фото с огромным трафаретным логотипом.
- → Почему: один свой шрифт на всё, мелкий капс и отсутствие цвета: бренд-как-объект, интерфейс отходит на второй план.

**6. The Row** (therow.com): тихая роскошь в моде, Shopify.
- Шрифт: Basic Commercial 400/700, body 13px / lh 21.45px (1.65).
- Палитра: белый, текст #000/#1C1B1B, серый #696969. Hero: ч/б портрет на весь экран, wordmark «THE ROW» вразрядку по центру шапки.
- → Почему: кегль 13px на большом экране работает как «шёпот»: продают фото и крой, а не текст.

**7. Jacquemus** (jacquemus.com, страница техобслуживания): Futura PT Book (файл FuturaPTBook.woff2), body 10px, ls 0.56px на 18px. Остальное (не проверено).

## B. Бьюти и DTC с характером

**8. Glossier** (glossier.com): DTC-косметика, Shopify.
- Шрифт: Apercu 400/500/600-700 + Apercu Mono + italic. Весь сайт держится на одном гротеске.
- Палитра: белый, #F7F7F7, текст #000. Акценты: электрический синий #0600FF и оранжевый #F94200 (у синего 19 фоновых блоков).
- Hero: flat-lay фото (балетки, свитер, коробка) и гигантский белый wordmark «Glossier», обрезанный нижним краем.
- → Почему: дружелюбный геометрический гротеск и «девичье» фото вместе с неожиданно кислотным синим: бренд для своих, без снобизма.

## C. Фитнес и пилатес: от «клубного люкса» до энергии

**9. Equinox** (equinox.com): премиум-фитнес-клубы, Next.js + Lenis.
- Шрифты: собственный Equinox Sans 400–700 (файлы assets.cdn-equinox.com/fonts/Equinox-Sans), Messina Sans Mono 600 для служебных подписей.
- H1 72px / lh 64.8px (**0.9**), ls −1.44px (−0.02em), UPPERCASE, вес 400 (не bold!).
- Палитра: фон #000, текст #FFF, вторичный #AAAAAA, синий-петроль #27455C.
- CTA: «VISIT A CLUB» белая, прямоугольная (radius 0), padding 21px 32px, капс, ls 0.8px. В шапке также «JOIN TODAY».
- → Почему: чёрный фон, огромный капс тонкого веса и тёмное фото тела в архитектуре: «It's not fitness. It's life». Это люкс-клуб, а не качалка, и энергия передаётся масштабом шрифта, а не неоном.

**10. Heartcore** (heartcore.co.uk → weareheartcore.com): бутик-пилатес, Лондон. WordPress + GSAP.
- Шрифты: Sometype Mono 400/700 (Google) для H1 56px UPPERCASE и кнопок; PP Neue Montreal Book для текста.
- Палитра: фон #F6F2ED (льняной), текст #332E27 (тёплый коричнево-чёрный).
- CTA: «Book a class →» в шапке, пилюля radius 39px, моно 13px.
- Hero: «THE HOME OF PILATES», моно-капс по центру на светлом видео/фоне.
- → Почему: моноширинный шрифт звучит как «метод, точность, ритм дыхания», а тёплый лён и коричневый текст дают спокойствие. Ребренд делали Yonder Consulting, идея «Positive Movement», «California cool» (yonderconsulting.com/case-study/heartcore).

**11. JETSET Pilates** (jetsetpilates.com): франшиза reformer-пилатеса.
- Шрифт: Montserrat 400/600/700 (Google). H1 67px 700 UPPERCASE, ls 2px; H2 28px капс синим.
- Палитра: navy #4A638D / #50678D (текст и фон), светлый #EEF1F6, белый.
- Ритм: секции 120px/120px, акцентная 270px; кнопки radius 3.75px. CTA «BOOK NOW» в шапке, «FIND A STUDIO» в hero.
- → Почему: франшиза ставит масштабируемость выше уникальности, поэтому бесплатный шрифт и одна фирменная краска. Hero с селебрити (Candice Swanepoel) заменяет дорогой дизайн.

**12. Bandier** (bandier.com): премиум-активвир, перезапуск.
- Шрифты: Cormorant Garamond 500/600 italic для H1 70.4px / lh 57.7px (**0.82**), Montserrat Variable для текста.
- Палитра: строго #000/#FFF.
- CTA: «I'M IN», белая, radius 0, капс, ls 1.28px (0.08em), padding 0 24px. Вторая CTA «JOIN THE LIST».
- Ритм: секции 88/88px и 96/96px, чередуются белая и чёрная.
- → Почему: фэшн-засечка с курсивом поверх спортивного фото: «спорт как мода». Плотный интерлиньяж 0.82 даёт журнальную обложку.

**13. Sweaty Betty** (sweatybetty.com): британский активвир.
- Шрифты: Aeonik 400/500/700 + Semplicita Pro 500.
- Палитра: текст #000, графит #1C1F21, промо-полоса голубая #B5EBFA.
- Hero: кампейн-фото в непогоду, ультражирные капс-заголовки «THUNDER MAY ROLL. / BUT SHE'S IN CONTROL.» (в изображении/оверлее).
- → Почему: энергичный, «городской» тон: жирный капс, юмор, реальная погода.

**14. Alo** (aloyoga.com): йога-люкс-стритвир, Shopify + Typekit.
- Шрифт: proxima-nova 400–700. Секционные заголовки 32px 600 UPPERCASE, ls −0.96px (−0.03em).
- Палитра: белый, #000/#333, плашки #F0F0F0; сезонная полоса бордо в шапке.
- Hero: три вертикальных фото-колонки с подписью «RICH BORDEAUX — Deep, dimensional, and undeniably decadent.» (засечка в подписи (не проверено, шрифт не снят)).
- → Почему: ритейл с огромным ассортиментом, поэтому нейтральный гротеск, а «люкс» несут фото и цвет сезона.

## D. Цветы

**15. Bloom & Wild** (bloomandwild.com): доставка цветов по подписке и в подарок.
- Шрифты: Tiempos Headline Bold 700 для hero 44px, Unica 77 LL 400/500 для текста.
- Палитра: текст #262626. Сезонные плашки: бордо (hero), лимонный #FDF888, зелёный #447964, персик #F9ECD7, пудра #F9DFD9.
- Hero: фото букета на кухне и цветная панель с заголовком «Cosy season essentials». Над ним ряд круглых категорий (Flowers, Birthday, Letterbox…).
- → Почему: массовый подарочный сервис, нужны тепло и навигация. Жирная газетная засечка звучит как «редакция», круги помогают быстро выбрать повод.

**16. FLOWERBX** (flowerbx.com): люкс-флорист (London·NYC·LA·Dubai).
- Шрифты: Brown 300/400/700 (Lineto) для H2 20px 700 UPPERCASE, ls 1px (0.05em); Johnston ITC 300/400 (шрифт лондонского метро) для UI.
- Палитра: белый, #F9F9F9, текст #000; кнопка шоколадная #211000, radius 5px, 11px капс, ls 1.1px (0.1em).
- Hero: «MEET THE AUTUMN WREATH» разреженным капсом поверх фото двери с венком.
- → Почему: моно-сортовые букеты, «галерейная» подача: вразрядку, мелко, много воздуха. Johnston отсылает к Лондону.

## E. Студии и наградные сайты (как студии продают себя)

**17. Lando Norris** (landonorris.com, OFF+BRAND, SOTY 2025): сайт пилота F1. Webflow + Lenis + WebGL.
- Шрифты: Mona Sans Variable 200–900 (GitHub, бесплатный) + Brier Bold (дисплейный). H1 38px 700 UPPERCASE.
- Палитра: тёмный оливковый #282C20 (body), текст #F4F4ED, неон-лайм #D2FF00 (56 блоков!), оливковый #B2C73A.
- CTA «STORE» лаймовая, radius 7.2px. Hero: светлый экран с топографическими линиями и 3D-шлемом.
- → Почему: лайм взят с шлема (DesignRush: «neon accents inspired by Norris' helmet design»). Фирменный цвет персоны + 3D объект = узнаваемость.

**18. darkroom.engineering** (darkroom.engineering): студия-разработчик (бывш. Studio Freight), авторы Lenis.
- Шрифты: AS Therma Bold Condensed для H1 **200px** / lh 160px (0.8), ls −10px (−0.05em), капс; Replica Mono LL для текста; ASModule VF.
- Палитра: фон lab(8.7 27 11.7) ≈ #390205 (бордово-чёрный), текст lab(49.9 73.4 57) ≈ #E71419 (красный). Пересчёт из LAB мой.
- Hero: «WHERE THINGS GET DEVELOPED» как фотолаборатория при красном свете, моно-манифест мелким кеглем.
- → Почему: метафора названия (darkroom = проявочная) выражена цветом и всем экраном. Для инженерной студии это «мы делаем, а не говорим».

**19. Locomotive** (locomotive.ca): Монреаль, Lenis + WebGL canvas.
- Шрифты: PP Locomotive New Light (кастом от Pangram Pangram, файл PPLocomotiveNew-Light) для H1 70/77px; Helvetica Now Display для текста 15px и навигации 26px.
- Палитра: #000/#FFF и единственный ультрамарин #312DFB.
- Hero: чёрный экран, текст «Digital-first Agency / Based in Montreal» собирается из случайных символов (scramble). Пойман кадр «MQC&U Cesign».
- → Почему: студия продаёт моушн, поэтому первый же экран сам является демонстрацией.

**20. Immersive Garden** (immersive-g.com): Париж, Nuxt + WebGL.
- Шрифты: PSTimes 400 (засечка) для H1 56px и ссылок 44px («See all projects»), Helvetica Neue для подписей.
- Палитра: #E8E8E8 / #030303 (почти чёрный); фон 124 блоков #030303.
- Hero: прелоадер «Innovative digital experiences studio» серым по светлому, логотип-монограмма.
- → Почему: крупная засечка вместо гротеска даёт «галерею/кино», а не «агентство». Их клиенты — люкс-бренды (не проверено).

**21. Koto** (koto.studio → koto.com): брендинг-агентство, Next.js.
- Шрифты: собственный GT Kotoheim в трёх ширинах: Condensed 300 для H1 48px, ls −0.48px; Mono 9px капс для меток; Regular body 12px.
- Палитра: #060606 / #141414, текст #FFF, серый #989898; жёлтый логотип.
- Деталь: в навигации живые часы «21:40 UTC+0».
- → Почему: собственная гарнитура как доказательство компетенции. Мелкий кегль на чёрном выглядит как редакция.

**22. BASIC/DEPT®** (basicagency.com): Next.js.
- Шрифт: Scto Grotesk A 300/400/700. H2 42px 700 капс, ls −2.1px (−0.05em).
- Палитра: #F4F4F4, текст #252422, пудровый #F9CDCD.
- Hero: круглая белая кнопка-курсор «WATCH REEL» по центру пустого светлого экрана.

**23. Hello Monday/DEPT** (hellomonday.com):
- Шрифты: Clarendon BT Light для H1 80px / lh 64px (0.8); NB International Pro, body **22px**.
- Палитра: #FFF, #F8F6F5, акценты palevioletred #DB7093, paleturquoise #AFEEEE.
- Hero: линейная иллюстрация двух персонажей и «We make digital (and magical)… Products» со сменой слова. Счётчик «4 days until Monday».
- → Почему: тёплая брусковая засечка и иллюстрации: «человечная» студия для продуктов.

**24. Malvah** (malvah.co, Studio of the Year '25): Nuxt + Lenis + WebGL.
- Один шрифт: Neue Haas Grotesk Text Pro 55. H1 всего 22px.
- Палитра: #000 / #E6E6E6, холодный серо-голубой #C4CED3.
- Hero: гейт «Enter Site» и WebGL-туннель из повторённого слова «Malvah Studio»; пагинация 01/02/03. Отступ первой секции 450px.
- → Почему: максимальная сдержанность типографики (один кегль, один шрифт) и вау в одной технике.

**25. Instrument** (instrument.com): Портленд, Nuxt.
- Шрифты: Instrument Sans VF + Instrument Serif (+Italic). Оба есть в Google Fonts (не проверено, что релизнуты именно ими).
- Hero: гигантский чёрный wordmark «INSTRUMENT» во всю ширину, под ним видео-шоурил. Метки 12px капс, ls 1.32px (0.11em). Текст #070708, кнопки-пилюли.

**26. Pentagram** (pentagram.com): GSAP. Один шрифт Plain (Optimo) 400, body 19px. Текст #1A1A1A, серый #767676. Заголовки проектов 52px, ls −1.04px. Страница высотой 25 599px: бесконечная сетка работ. → Портфолио-гигант: всё убрано ради работ.

**27. Resn** (resn.co.nz): three.js + WebGL. Шрифт Fort (Extralight/Light/Book/Medium), метки 9.9px капс, ls 0.99px (0.1em). Тёмный #141214.

**28. Obys** (obys.agency, Studio of the Year 2023 по их Dribbble): собственный шрифт «Obys», 11px, WebGL; чёрное на белом.

Справочно: CSS Design Awards (cssdesignawards.com): Open Sans, фон #F1EFE9, текст #282828. Active Theory (activetheory.net): NB Architekt; в headless показывает «Your browser is not supported» → сайт целиком WebGL.

---

## Закономерности: бизнес → решения

**Тихий люкс (отель, клуб, парфюм, мода): Aman, Soho House, The Row, Byredo, Le Labo, Diptyque**
- Шрифт: светлая/книжная засечка (Lyon Light, Cardo, своя Saint Germain) ИЛИ один нейтральный гротеск мелким кеглем (Basic Commercial 13px, byredoSans 12px капс). Вес 300–400, никогда не bold в заголовках.
- Цвет: не белый, а тёплый off-white (#F3EEE7, #FFFEF7, #F6F8F6); текст графитовый (#313131, #1C1B1B). Акцент максимум один и точечно (#D13037 у Diptyque).
- Интерлиньяж заголовков широкий (Aman 1.45), разрядка положительная (+0.5px, капс +0.05–0.1em).
- Hero: фото места или объекта на весь экран, минимум текста. Гейт выбора страны/входа (Le Labo, Malvah) создаёт «порог».
- CTA мелкий и тихий: «Reserve», «Apply for membership». Пилюля или прямоугольник без тени.

**Люкс-фитнес и клуб (Equinox)**: чёрный фон, огромный капс **тонкого** веса (72px/0.9, −0.02em), белая прямоугольная CTA с крупным паддингом, моно для служебного. Энергию даёт масштаб, а не цвет.

**Бутик-пилатес/велнес (Heartcore)**: льняной фон (#F6F2ED) и тёплый коричневый текст (#332E27), моноширинный капс как «метод», пилюля «Book a class» всегда в шапке. Спокойно, но с характером.

**Франшиза/масс-премиум фитнес (JETSET, Alo)**: бесплатный гротеск (Montserrat, Proxima), одна фирменная краска (navy #4A638D), крупные секции 120px, селебрити/модели в hero, «BOOK NOW / FIND A STUDIO» дважды на первом экране.

**Энергичный активвир (Sweaty Betty, Bandier)**: либо ультражирный капс с юмором, либо модная засечка-курсив поверх спортивного фото (Bandier, lh 0.82). Строгий ч/б и одна сезонная плашка.

**DTC-бьюти для своих (Glossier)**: один дружелюбный гротеск, кислотный акцент (#0600FF) поверх пастельного фото, гигантский обрезанный wordmark.

**Цветы**: подарочный масс-сервис (Bloom & Wild) берёт жирную газетную засечку, тёплые сезонные плашки и круглые категории «по поводу». Люкс-флорист (FLOWERBX) берёт разреженный капс 0.05–0.1em, белый и шоколадную кнопку: «галерея».

**Студии, продающие себя**: (1) собственный или редкий шрифт как доказательство вкуса (Koto, Locomotive, Obys, Instrument); (2) один экстремальный жест: 200px condensed (darkroom), гигантский wordmark (Instrument), scramble-текст (Locomotive), WebGL-туннель (Malvah); (3) палитра почти всегда ч/б + 1 акцент (#312DFB, #E71419, #F9CDCD); (4) Lenis почти обязателен (Locomotive, darkroom, Malvah, Equinox, Lando).

**Персона/спорт-звезда (Lando Norris)**: цвет берут из личного артефакта (шлем → лайм #D2FF00) на тёмном оливковом, 3D-объект в hero, вариативный гротеск.

**Сквозные числа (наблюдённые)**
- Дисплейный lh: 0.8–0.9 у энергичных (darkroom 0.8, Hello Monday 0.8, Bandier 0.82, Equinox 0.9); 1.25–1.45 у тихого люкса (Soho 1.25, Aman 1.45).
- Трекинг: крупный капс −0.02…−0.05em; мелкий капс-лейбл +0.05…+0.11em (FLOWERBX 0.1em, Instrument 0.11em, Bandier 0.08em).
- Радиус: люкс и мода 0px; велнес — пилюля (39px); спорт-персона ~7px; масс-франшиза ~4px.
- Отступы секций: 56px (Diptyque, e-com), 88–96px (Bandier), 120px (JETSET); у студий отступ задаёт полноэкранная сцена, а не padding.
- Платформы: Shopify (Glossier, Diptyque, Alo, The Row), Next/Nuxt (Equinox, Byredo, Koto, BASIC, Soho, Malvah, Instrument), Webflow (Lando Norris).

---

## Открытые URL (headless/curl/поиск)
Бренды: aesop.com (403), lelabofragrances.com, glossier.com, sezane.com/us-en (403), diptyqueparis.com, jacquemus.com, aman.com, sohohouse.com, equinox.com, bandier.com, aloyoga.com, sweatybetty.com, heartcore.co.uk, jetsetpilates.com, flowerbx.com, bloomandwild.com, floom.com (Vercel-челлендж), formapilates.com (SSL-ошибка), byredo.com, therow.com, psycle.london (ошибка туннеля), mcqueens.co.uk (редирект на чужой домен, отброшен).
Студии/награды: locomotive.ca/en, immersive-g.com, activetheory.net, darkroom.engineering, obys.agency, hellomonday.com, koto.studio, instrument.com, malvah.co, basicagency.com, landonorris.com, lando.com (не тот сайт), messenger.abeto.co, resn.co.nz, pentagram.com, cssdesignawards.com, godly.website (DNS/челлендж), siteinspire.com (челлендж), awwwards.com/websites/sites_of_the_day (челлендж), tympanus.net/codrops/2025/05/30/deconstructing-the-35mm-website (403).
Поиск/вторичные: lbbonline.com/news/Malvah-Studio-of-the-Year-2025-Awwwards; awwwards.com/sites/lando-norris; designrush.com/best-designs/websites/lando-norris-website-design; yonderconsulting.com/case-study/heartcore; fontsinuse.com/tags/11303/aesop (Aesop: Suisse Int'l + Zapf Humanist 601 по данным type-spotters, сам сайт не открылся (не проверено)); tympanus.net/codrops/2025/05/ и /2025/11/ (выдача).
Скриншоты: /tmp/claude-0/studio/*.png, контакт-листы sheet0–4.jpg; сырые данные: brands1.json, brands2.json, studios.json, batch4.json.

## Дособрано 22.10 через headless-браузер (обычный user-agent, ожидание, принятие cookies)
- **noma.dk** (ресторан): Reckless Neue 72px w500, трекинг −0.02em; фон #F9F9F3, тёмно-зелёный текст #29382B; первый экран — почти пустой тёмный кадр, «Copenhagen 2026-2027» и одна кнопка «Book a table» в тонкой рамке, радиус 0. → Тихая уверенность: сайт почти ничего не продаёт, кроме брони.
- **snohetta.com** (архитектура): один шрифт Dovre весом 300 на всём (h1 60px, текст 18px), белый фон, чёрный текст, подписи серым #949494; первый экран — одна фраза-манифест и ряд фото разной ширины, кнопки без рамок и радиуса. → Работа говорит сама, типографика тихая.
- **barrys.com** (фитнес): Antenna Bold капсом 48px, белый текст на тёмном фото, кнопка-пилюля «BOOK YOUR FIRST CLASS» (радиус 40px) в шапке, рядом сразу поиск студии; ниже рукописный красный «Welcome to Barry's». → Энергия, первое занятие и ближайшая студия на первом экране.
- **floom.com** (цветы): Lora 36px w500 + DM Sans 16px, тёмный текст #0F172A, бордовая кнопка #6B1A42 радиус 6px; первый экран — крупный букет на бордовом фоне и карточка «Same-day flower delivery» с полями «индекс + дата» прямо в hero. → Конверсионный hero: заказ начинается с первого экрана.
- **tympanus.net/codrops**: InterVariable, фон #F7F7F7; свежие темы — WebGL + DOM в UI-библиотеке (Atelier UI), «постеры, которые двигаются как ткань».
- **jacquemus.com**: на техработах; шрифты Futura PTT и собственный JACQUEMUS.
- **land-book.com** (открылся в браузере): разделы Landing, Portfolio, Ecommerce, Sections, Mobile, Motion, Headlines; фильтры по индустрии, стилю, типографике и цвету. Свежие примеры: Sonderdays (места для отдыха), Soulera (шаблон велнес-сайта), OMMAGE, Halaska.
- **behance.net** UI/UX (открылся в браузере): свежие кейсы — «NOVA DENTAL – dental clinic web design» (Phenomenon Studio), Neobank web & app UX/UI, Budgetly (UX-кейс).
- **dribbble.com** web design (открылся в браузере, лента в JS): фильтр по цвету даёт палитры трендов; шрифты самого Dribbble — Mona Sans, Source Serif 4, IBM Plex Mono.
- godly.website теперь перенаправляет на recent.design (он уже есть в карте источников).
- **Не открылись и этим способом**: Aesop, Sézane, lapa.ninja (Cloudflare «Just a moment»), awwwards.com (соединение сбрасывается на уровне сети), activetheory.net (без видеокарты пишет «browser not supported»). Для них — просить у Вероники ссылки или скриншоты.

## Aesop (aesop.com): по скриншотам Вероники, 2026-10
- **Палитра:** тёплый кремовый фон (~#FFFEF2), графитовый текст, кнопки почти чёрные, прямоугольные, без скругления. Цвет даёт только продукт (янтарные флаконы) и фото.
- **Шрифты:** светлая антиква в заголовках, гротеск в интерфейсе. Всего два стиля, иерархию задают размер и воздух, а не жирность.
- **Первый экран:** тёмное кинематографичное видео (распыление духов), по центру короткий заголовок «The Fragrant Fables» и контурная кнопка «Explore the story». Сначала продаётся история, а не товар.
- **Каталог:** карусель наборов, под каждым тёмная кнопка «Add to cart» на всю ширину карточки. Покупка в один клик, без лишних шагов.
- **Сторителлинг:** блок в две колонны (фото библиотеки и «A scent—and story—for all»), вкладки по семействам ароматов Fresh / Floral / Woody / Ambery. Выбор идёт по настроению, а не по артикулу.
- **Редакционный тон:** ироничные названия и подписи («On sight, a sigh of relief»). Бренд говорит как журнал, а не как магазин.
- **Снятие риска:** «Smell before you settle»: пробник 2 mL и возврат. Страх «не тот запах» снимается прямо в оффере.
- **Взять себе:** выбор по настроению (вкладки) · пробник или гарантия рядом с дорогим товаром · прямоугольные тёмные CTA на светлом фоне · полоса до бесплатной доставки · история на первом экране, товар со второго. Для Petal House: вкладки «для кого / какой повод» и гарантия свежести.
- **Не копировать:** цены «$68.00» противоречат нашему правилу; у нас «68 €».
