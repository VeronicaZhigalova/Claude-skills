# Learn: премиальный малый e-commerce (бутики, флористы, уход за кожей, кафе)

Справочник для агента-дизайнера по пути «главная → категория → товар → корзина/оформление» и по бронированию.
Собран в октябре 2026 по открытым статьям Baymard, NN/g, Shopify и Smashing и по живым магазинам (headless Chromium, 390×844 и 1440×900).
Факты даны со ссылкой. Мои выводы помечены **(не проверено)**.

---

## 1. Цифры, на которые опираться

- Корзину бросают в среднем в **70,22%** случаев (это среднее по 50 исследованиям). Причины: 40% — высокие доп. расходы, 20% — медленная доставка, 19% — не доверяют сайту данные карты, 18% — требуют создать аккаунт. https://baymard.com/lists/cart-abandonment-rate
- Идеальное оформление заказа — это **12–14 элементов формы (7–8 полей)**. В среднем по США — 23,48 элемента. https://baymard.com/lists/cart-abandonment-rate
- В 2024 году в среднем 5,1 шага и **11,3 поля**, хотя большинству сайтов хватает 8. Число полей влияет на UX сильнее, чем число шагов. https://baymard.com/blog/checkout-flow-average-form-fields
- 42% участников хотя бы раз вписали полное имя в поле «First Name». С одним полем «Full Name» замешкались лишь 4%. (там же)
- **56%** пользователей начинают знакомство с карточкой товара с фото. На 25% сайтов разрешения фото или зума не хватает. https://baymard.com/blog/ensure-sufficient-image-resolution-and-zoom
- 42% пытаются понять размер товара по фото. У 28% сайтов нет ни одного фото «в масштабе». https://baymard.com/blog/in-scale-product-images
- 41% сайтов показывают срок доставки («3–5 рабочих дней») вместо даты доставки. https://baymard.com/blog/shipping-speed-vs-delivery-date
- На 46% сайтов, где покупка в подарок уместна, её нельзя оформить. https://baymard.com/blog/gifting-flow
- Гостевое оформление не самое заметное на 47% сайтов (старая статья) и на 62% (бенчмарк 2025, цитата у Shopify). https://baymard.com/blog/make-guest-checkout-prominent · https://www.shopify.com/blog/checkout-optimization
- Из-за неудобной политики возврата бросают 15%. 43% сайтов не показывают условия возврата на карточке товара (цифры Baymard в пересказе Shopify). https://www.shopify.com/blog/checkout-optimization

## 2. Главная и категория (коротко)

- NN/g: фото реальных товаров и людей разглядывают, а декоративные «настроенческие» картинки игнорируют. https://www.nngroup.com/articles/photos-as-web-content/ Значит, вау-герой на главной должен показывать товар, а не абстракцию **(не проверено)**.
- Bloom & Wild: первая строка над шапкой — «Psst.. need your delivery fast? Shop available soonest». Срочная доставка — отдельный вход, и в категории есть фильтр `delivery:next-day`. Для флориста это главная ось навигации наряду с поводом (birthday/sympathy/thank-you) и форматом (letterbox, в вазе, сухоцвет).
- Byredo: в категории кнопка «Add to cart» прямо на карточке, в карточке объём и цена, есть переключатель в одну колонку на мобильном. https://www.byredo.com/us_en/c/perfume/best-sellers/mojave-ghost
- Правило для малого каталога (до 40 позиций): вместо фасетных фильтров — 3–6 «полок» по поводу или сценарию, а в карточке сразу цена, вариант и быстрое добавление **(не проверено)**.

## 3. Карточка товара: анатомия и порядок

NN/g делит элементы на обязательные, желательные и «модные». Модные (360°, AR) имеют смысл только при безупречном исполнении. https://www.nngroup.com/articles/ecommerce-product-pages/

**Над сгибом на мобильном (390×844), по тому, что видно в магазинах:**
1. Галерея. У Glossier подпись к кадру «Juliette applies Cloud Paint in Puff.» и счётчик «1/6». Bloom & Wild ставит кнопку «Play» прямо на первом фото.
2. Категория или тип: «Letterbox Flowers» (B&W), «Seamless cheek color» (Glossier), «Café arabica, sandalwood, tonka bean» (Diptyque).
3. Название H1 + цена + рейтинг с числом отзывов: «£30 · 4.89 (482)» (B&W), «(6720)» (Glossier), «4.9» (Mejuri).
4. Варианты: размер «Original / Extra / Deluxe» кнопками (B&W). У Glossier 10 оттенков свотчами с подписями, у Mejuri — металл свотчем с подписью «18k Gold Vermeil».
5. Главная кнопка. B&W пишет «Send», а не «Add to basket»: глагол подарка. Diptyque пишет цену в кнопке: «Add to bag · US $345».
6. Полоса доверия. Mejuri ставит «2 Year Warranty · Free Returns & Exchanges · Free Shipping» над названием, сразу под галереей. Diptyque под кнопкой пишет «Free returns on all orders», «2 free samples of your choice with every order».

**Ниже сгиба:** «In a nutshell» в 4–5 пунктах (B&W: 17 стеблей, доставка через почтовый ящик, «распускается за 48 часов», подкормка в комплекте), затем табы или аккордеон «About / Reviews / Delivery information / Sustainability / FAQs». У косметики — «Key ingredients · How to use · You may also like» (Glossier), у кофе — рецепт заваривания: «Brew time 2:30–3:30 · Grind Medium · 27 g · 350 g» (Blue Bottle).

**Правила NN/g:** текст сразу по делу, без «маркетинговой воды», термины объяснены. Одинаковая информация у всех вариантов: пример с чаем, где «сколько чашек» указано только у пробника. Доступность показывать заранее, а не после добавления в корзину. https://www.nngroup.com/articles/ecommerce-product-pages/
**Бесплатную доставку — на карточку товара.** Покупатель Casper учёл её в цене, а у Tuft & Needle узнал о ней только в корзине (там же). Только в баннере над шапкой её пропускают, у 32% сайтов это ошибка. https://baymard.com/guidelines/836-where-to-display-free-shipping-information

## 4. Изображения

- Минимум: фото товара на чистом фоне + деталь или текстура + фото в масштабе (в руке, на столе, на человеке) + фото в использовании. Зум до текстуры: Baymard видел, как пользовательница щипком пыталась прочитать SPF на флаконе. https://baymard.com/blog/ensure-sufficient-image-resolution-and-zoom
- Фото в масштабе одновременно может быть лайфстайлом. https://baymard.com/blog/in-scale-product-images
- Чем сильна «премиальная» галерея: у Glossier первый кадр — лицо крупным планом, а в углу вставлен маленький packshot тюбика, так что сразу видны и эффект, и упаковка. У B&W букет стоит в вазе на ротанговом подносе, то есть в контексте и в масштабе. У Mejuri серьги на светло-сером фоне и кнопка зума (иконка ↗).
- Для флориста обязательно: «как приедет» (коробка или letterbox), «как выглядит через 2 дня», рука с букетом для масштаба **(не проверено, вывод из B&W «arrives in bud»)**.
- Для кафе и пекарни: верхний ракурс + срез + рука или чашка для масштаба. Тёплый свет, без стоковых фото **(не проверено)**.
- Shopify: у варианта одно назначенное фото, но галерею можно упорядочить, чтобы после выбора варианта шли его ракурсы. https://www.shopify.com/blog/product-page

## 5. Цена, варианты, количество

- Варианты делать кнопками или свотчами с подписью, а не выпадающим списком (B&W, Glossier, Mejuri). Недоступный вариант показывать, но перечёркнутым **(не проверено)**.
- Наборы и бандлы: Flamingo Estate — «4 Candles + Get 1 Candle Free · Best Value · ~~$340~~ $272», «Choose your scents 0/5» с кнопками «+» у каждого аромата. Kettle & Fire показывает цену за единицу, а над селектором — экономию на больших упаковках. https://www.shopify.com/blog/product-page
- Количество со скидкой: Blue Bottle — «One bag / Two bags 10% off / Three bags 17.5% off».
- Сэмплы как снятие риска: Diptyque — «Try your fragrance: free sample to test the fragrance and facilitate its return», Byredo — «Free samples of your choice: two complimentary» к каждому заказу. Для ухода за кожей это главный приём против страха «не подойдёт» **(не проверено как метрика)**.
- Рассрочку (Klarna) лучше упомянуть в FAQ, а не в главном блоке: так делает B&W. Shopify приводит кейс, где Shop Pay Installments подняли средний чек на 60% (кейс вендора). https://www.shopify.com/blog/product-page

## 6. Дата доставки (флористы, торты, подарки)

- Показывать **дату**, а не «2 business days». Участники считали дни по календарю и ошибались, сбивали с толку и время отсечки, и то, считается ли сегодняшний день. https://baymard.com/blog/shipping-speed-vs-delivery-date
- На карточке нужна строка с отсечкой: у B&W «order by … (weekdays) or 1pm (Saturday) for tracked next-day delivery. Free delivery when you add a gift».
- Выбор даты (NN/g): календарь подходит для ближайших дат (меньше года). Если дат мало, показать короткий список, а недоступные дни сделать серыми и неактивными. Не делать три выпадающих списка «день/месяц/год». https://www.nngroup.com/articles/date-input/
- Паттерн для флориста: горизонтальная лента из 7–10 ближайших дней в виде чипов (сегодня / завтра / пт 24) с ценой доставки на каждом чипе, а ссылка «Другая дата» открывает календарь **(не проверено)**. Слово «today» снимает сомнения в дате (NN/g, там же).

## 7. Кросс-селл без шума

- NN/g: одна категория очень релевантных рекомендаций («You may also like» / «Customers also bought») полезна, а слишком много отвлекают от информации о товаре. https://www.nngroup.com/articles/ecommerce-product-pages/
- B&W выносит допродажи **на отдельный шаг после «Send»**: «Add a little something — There's still space in the box for one extra treat» (печенье £5, шоколад £6, браслет £20). Затем «Choose your card»: бесплатная открытка по умолчанию + платные дизайны £1,50–2,50 по поводам. Карточка товара остаётся чистой.
- Diptyque: соседние ароматы — ряд миниатюр флаконов под описанием, это навигация, а не баннер. Byredo в блоке «You may also like» внизу.
- Правило: на карточке не больше одного ряда из 3–4 товаров. Аксессуары к подарку (открытка, ваза, свеча) — в отдельном шаге или в корзине **(не проверено)**.

## 8. Добавление в корзину: шторка или страница

- NN/g: подтверждение должно быть заметным и **не исчезать само**. Нужны счётчик на иконке корзины + поповер или страница с фото и выбранными опциями. Подпись кнопки должна меняться, и при этом можно добавить ещё. Исчезающие тосты — антипаттерн. https://www.nngroup.com/articles/cart-feedback/
- Промежуточная страница (Chewy) работает, если на ней есть «Continue shopping». https://www.nngroup.com/articles/ecommerce-product-pages/
- Боковая шторка против страницы корзины: независимых исследований нет, только вендоры, которые обычно советуют гибрид (шторка + полноценная страница корзины). https://cartylabs.com/blog/shopify-cart-page-vs-cart-drawer/
- Рекомендация **(не проверено)**: для бутика с 1–3 товарами в заказе — шторка с фото, вариантом, итогом с доставкой и одной допродажей. Если корзина сложная (подарок + дата + открытка), оформить её как пошаговый мастер, как у B&W.

## 9. Оформление: гость, поля, доверие

- **Гость — первым и крупным**, со словом «Guest» в заголовке или на кнопке. Не делать гостевой вход текстовой ссылкой внизу и не прятать его за «Continue». https://baymard.com/blog/make-guest-checkout-prominent
- NN/g: регистрацию предлагать **после** покупки (не хватает только пароля), выгоду описывать с позиции покупателя («отслеживать заказ, быстрее оформлять»), поле пароля помечать как необязательное. https://www.nngroup.com/articles/optional-registration/
- Поля: одно «Full name», адрес с автодополнением, «Address line 2» скрыть за ссылкой, адрес оплаты = адрес доставки по умолчанию. https://baymard.com/blog/checkout-flow-average-form-fields
- Smashing/Baymard (Holst): линейный процесс, конкретные подписи кнопок вместо «Continue», визуально выделить поля карты, не делать отдельную кнопку «Apply» в форме. https://www.smashingmagazine.com/2011/04/fundamental-guidelines-of-e-commerce-checkout-design/
- Итоговая сумма с доставкой — **до** последнего шага, без скрытых платежей (drip pricing). Shopify: одностраничное оформление дало +3,5% (Stellar Eats). Экспресс-кнопки (Shop Pay/Apple Pay/PayPal) — одна строка сверху. https://www.shopify.com/blog/checkout-optimization
- Доверие: безопасность оформления оценивают по тому, «насколько безопасно выглядит». Знакомые значки работают сильнее у маленьких магазинов. Нужны видимая политика возврата и знакомые способы оплаты (там же). Diptyque прямо на карточке показывает «Pay with PayPal».

## 10. Подарок и сообщение (флористы, подарочные бутики)

- Baymard: говорить о подарочной упаковке и сообщении **уже на карточке**, со ссылкой «Подробнее». После отметки «это подарок» менять форму: «Recipient's name», «Recipient's address», снять «billing = shipping». У подписанного пользователя не подставлять его адрес. Скрывать цены в чеке. https://baymard.com/blog/gifting-flow
- Худший сценарий: подарок ушёл самому себе или с обычным чеком (там же).
- B&W: бесплатная открытка «Pastel Blooms Card — Free» по умолчанию + «Continue with default» и липкая панель «Order total £30 · Includes free delivery». Byredo: «Wrapping service for every order».
- Поле сообщения **(не проверено)**: textarea со счётчиком символов под размер открытки, подсказки-заготовки по поводу, превью открытки, флажок «не подписывать / анонимно», телефон получателя для курьера (необязательный, с пояснением зачем).

## 11. Подписка (кофе, цветы, уход)

- Shopify (гайд для приложений Built for Shopify): иерархия «экономия → план → условия». Раскрывать постепенно. По умолчанию выбрана **разовая покупка**. Бейдж «Subscription · Save 10%», для предоплаты — цена за доставку. Блок встраивается в стиль темы. https://shopify.dev/docs/storefronts/themes/pricing-payments/subscriptions/subscription-ux-guidelines
- Живые примеры: Glossier — «Purchase options: One-time purchase / Subscribe and save 10% · How often… Ship every month». Blue Bottle — наоборот, «Subscribe & Save | $22» уже в липкой кнопке, график «Every Two Weeks (Most Popular)» и выгоды «Always Fresh · Free Shipping · Cancel Anytime · Up to 17% Savings» + «Prepay 5 shipments». У кофе подписка — основной сценарий, и отступление от гайда Shopify там сознательное **(не проверено)**.
- Обязательно: «Отменить в любой момент» рядом с переключателем, частота с отметкой «популярное», дата первой отправки **(не проверено)**.

## 12. Мобильные паттерны

- Липкая кнопка внизу появляется после прокрутки за основную CTA. Glossier: «Add to bag $24», Diptyque: «Add to bag US $345», Blue Bottle: «Add to Cart | $49.50». Цена в липкой кнопке — частый приём. Mejuri и B&W держат CTA в потоке страницы. Независимых данных о прибыли нет. A/B вендора показал +8,7% добавлений в корзину (cleancommit.io, не исследование).
- NN/g о липкой шапке: минимальная высота, контраст, без лишней анимации, тап-цели ≥ 1×1 см, текст около 16pt. https://www.nngroup.com/articles/sticky-headers/
- Антипаттерны, увиденные вживую: Flamingo Estate на карточке сразу открывает поп-ап «Get 10% Off» с email на весь экран. Le Labo встречает гейтом выбора страны («Select your location → Enter site») до карточки. У Diptyque модалка согласия на cookies перекрывает кнопку покупки на десктопе.
- Чат-кнопка (Mejuri) не должна перекрывать свотчи или CTA **(не проверено)**.

## 13. Бронирование (кафе, мастер-классы, процедуры)

- Шаги: доступность (дата → время → кол-во гостей) → детали → подтверждение → управление бронью. Депозит и правила опоздания видны в процессе, а не в FAQ. https://www.pergolacanarywharf.co.uk/corpus/gen-435/user-experience-design/reservation-ux.html (блог, не исследование)
- Вендор Now Book It: −63% кликов от просмотра до брони, количество гостей не спрашивать дважды. https://www.nowbookit.com/tools-and-tips/restaurant-booking-widget-refresh/
- Дата: см. §6. Время — сетка чипов слотов, недоступные серые или скрытые (NN/g, date-input).
- Порядок «гости → дата → слот»: сразу видно, какие слоты реально свободны для этой компании. Подтверждение с кнопкой «Add to calendar» и ссылкой на изменение или отмену. Без регистрации: имя + телефон/email **(не проверено)**.

## 14. Пустые состояния

- Пустая корзина: успокоить (ничего не сломалось), дать путь (2–3 полки или бестселлеры), предложить полезное. Голое «Your cart is empty» воспринимается как поломка. https://vp0.com/blogs/empty-cart-state-ui-with-recommended-products (блог)
- «Нет доставки на эту дату / в этот индекс» — показать ближайшую доступную дату и альтернативу (letterbox, самовывоз) **(не проверено)**.
- Распродано: показать, предложить «Notify me» и похожие. Mejuri добавляет бейдж «Sold out 9x» как социальное доказательство.

---

## 15. Чек-лист аудита (пройти до сдачи)

**Карточка**
- [ ] Над сгибом на 390px: фото, H1, цена, рейтинг (N), варианты кнопками, CTA. Без поп-апов в первые секунды.
- [ ] Галерея ≥ 5 кадров: чистый фон, деталь, масштаб, в использовании или контексте, упаковка. Зум, счётчик или точки.
- [ ] У всех вариантов одинаковые данные. Недоступные отмечены до добавления.
- [ ] Доставка: **дата** и отсечка рядом с CTA. Бесплатная доставка и возврат — на карточке, а не только в баннере.
- [ ] Блок «In a nutshell» 3–5 пунктов. Ниже аккордеон: состав или ингредиенты, уход или применение, доставка, FAQ.
- [ ] Отзывы: среднее + число + фильтр, отмечены проверенные. Сначала можно показать негатив.
- [ ] Не больше 1 ряда кросс-селла на карточке.
**Корзина и оформление**
- [ ] Подтверждение добавления не исчезает само: фото + вариант + итог + «Продолжить покупки».
- [ ] Итог с доставкой виден до оплаты. Нет скрытых сборов.
- [ ] Гость первым, со словом «Guest». Регистрация — после покупки.
- [ ] ≤ 8 полей по умолчанию. Одно поле имени. Автозаполнение адреса. Billing = shipping.
- [ ] Экспресс-оплата сверху. Знакомые логотипы оплаты. Ссылка на возврат.
**Подарок, подписка, бронь**
- [ ] «Это подарок»: адрес получателя, сообщение со счётчиком, скрыть цену, открытка или упаковка с ценой.
- [ ] Подписка: разовая покупка по умолчанию (кроме расходников вроде кофе — решить осознанно), «Save X%», частота, «Cancel anytime».
- [ ] Бронь: гости → дата → слот, недоступное серое, подтверждение + «в календарь» + изменить или отменить.
**Мобильный и пустые состояния**
- [ ] Липкая CTA с ценой после прокрутки. Тап-цели ≥ 44px. Чат не перекрывает CTA.
- [ ] Пустая корзина, нет дат, распродано — у каждого состояния есть следующий шаг.

---

## Открытые источники

**Статьи (прочитаны через curl):**
baymard.com/lists/cart-abandonment-rate · baymard.com/blog/checkout-flow-average-form-fields · baymard.com/blog/make-guest-checkout-prominent · baymard.com/blog/ensure-sufficient-image-resolution-and-zoom · baymard.com/blog/in-scale-product-images · baymard.com/blog/shipping-speed-vs-delivery-date · baymard.com/blog/gifting-flow · baymard.com/guidelines/836-where-to-display-free-shipping-information · nngroup.com/articles/ecommerce-product-pages/ · nngroup.com/articles/optional-registration/ · nngroup.com/articles/photos-as-web-content/ · nngroup.com/articles/cart-feedback/ · nngroup.com/articles/sticky-headers/ · nngroup.com/articles/date-input/ · shopify.com/blog/product-page · shopify.com/blog/checkout-optimization · shopify.dev/docs/storefronts/themes/pricing-payments/subscriptions/subscription-ux-guidelines · smashingmagazine.com/2011/04/fundamental-guidelines-of-e-commerce-checkout-design/
**Только из поисковой выдачи (вендоры, слабые):** cartylabs.com (шторка или страница корзины) · cleancommit.io (A/B липкой CTA) · nowbookit.com, pergolacanarywharf.co.uk (бронирование) · vp0.com (пустая корзина).
**Живые магазины (Chromium, моб. + десктоп):** bloomandwild.com (категория, карточка the-jade, шаг gift-options) · glossier.com/products/cloud-paint · mejuri.com/products/dome-brioche-hoops · us.diptyqueparis.com (Bois Corsé EDP) · byredo.com (категория Mojave Ghost + p/holiday-advent-calendar) · flamingoestate.com/products/candle-scent-discovery-set · bluebottlecoffee.com (hayes-valley-espresso, vinyl) · lelabofragrances.com/santal-33.html (только гейт страны).
**Недоступны:** flowerbx.com, aesop.com, mcqueens.co.uk (Cloudflare challenge), sezane.com (пустая страница для headless).
