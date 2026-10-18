# Этап 1 — аудит Server/Client Components

Дата: 30 сентября 2026 года. Исходное рабочее дерево уже содержало изменения CI, README, зависимостей, файлов `.idea`, плана, отчёта этапа 0 и скриптов архитектурной проверки. Они сохранены. Значения `.env.local` в отчёт не записывались.

## Границы и граф импортов

Все `src/app/**/page.tsx` и `src/app/layout.tsx` остаются Server Components. `Header` на сервере вызывает `getAuthUser` и передаёт в шапку только признаки авторизации и роль; API-маршруты не изменялись.

| Область | Решение и причина | Клиентский граф |
| --- | --- | --- |
| `app/providers.tsx` | Клиентская граница нужна для `MotionConfig`, `SplashGate`, `I18nProvider`, `CurrencyProvider`. Серверные `children` передаются через неё. Структурный `div` с `min-h-screen` перенесён в серверный `layout.tsx` с тем же порядком DOM. | 5 исходных файлов: `providers`, `SplashGate`, `LottieSpalshScreen`, JSON Lottie, `CurrencyContext`; пакеты `framer-motion`, `lottie-react`, `@react-aria/i18n`, `axios`, `next/dynamic`, React. Lottie загружается динамически. |
| `HeaderDesk` | Директива удалена: собственных хуков и обработчиков нет. `Container`, `LogoLink`, кнопка и ссылки создаются на сервере. | Клиентскими потомками остаются `NavMenuItem` и `AnimatedWrapper` (анимация), `CurrencyRate` (контекст валюты и dropdown). `NavMenu` может собирать desktop список на сервере; в mobile он импортируется из клиентского `HeaderMob`. |
| `HeaderMob` | Остаётся клиентским: состояние burger menu, события открытия и закрытия, `AnimatePresence`, навигация и курс. | 13 исходных файлов, включая `BurgerMenu`, `BurgerMenuButton`, `NavMenu`, `NavMenuItem`, `CurrencyRate`, `CurrencyContext`, анимацию и простые UI-компоненты; пакеты `framer-motion`, `@heroui/react`, `axios`, `next/link`, `next/image`, React. |
| `Footer` | Директива удалена: `Contacts`, `Schedule`, `Socials`, `Map`, `LogoLink`, `Container` и разметка footer формируются на сервере. | Новый `FooterAnimation` сохраняет прежний `key={pathname}` и `fadeInAnimation({ y: 30 })`; его граф — 3 исходных файла (`FooterAnimation`, `AnimatedWrapper`, `animationVariants`) и `framer-motion`/`next/navigation`/React. Форма `CallBack` остаётся отдельным клиентским потомком, 15 исходных файлов с Formik/Yup и уведомлением. Статические `children` передаются через анимационную границу. |
| `agency/hero/Hero` | Директива удалена: собственных хуков и событий нет; анимационные заголовок, текст и стрелка остаются отдельными клиентскими потомками. | Серверная композиция больше не импортируется целиком в клиентский JS. |
| Карточки и составные списки | `TourCard`, `ReviewCard`, `TeamCard`, `DocumentCard` не требуют собственной директивы для статической разметки. Когда их импортируют клиентские пагинация или swiper, они входят в соответствующий клиентский граф. | Крупные корни: `agent/menu/Menu` — 45 исходных файлов; `shared/booking/Booking` — 25; `tours/Tours` — 15; `search/SearchList` — 12; `reviews/ReviewsList` — 11. Их границы обусловлены состоянием вкладок, форм, фильтров, пагинации или анимацией; перенос без изменения передачи callbacks не входил в аудит. |

Карта построена статическим обходом импортов и литеральных dynamic imports через `scripts/audit-client-graph.mjs`. Проверены все 92 итоговые директивы: 0 неразрешённых импортов и 0 путей к `src/lib/{sanity,crm,auth}`, `src/app/api` или `src/proxy.ts` в их клиентских графах. CSS-импорты учитываются как стили, не как исполняемые модули. Отдельный поиск по JS production сборки проверил 8 непубличных значений из `.env.local` длиной от 12 символов: совпадений нет; значения не выводились. Эта проверка не утверждает отсутствия любых секретов вне `.env.local`.

## Перечень оставшихся `"use client"`

В таблице указаны все 92 файла с директивой. Имена в каждой строке относительны каталогу в первом столбце; причина относится к каждому перечисленному файлу, если не уточнено иначе. Наличие директивы не использовалось как единственный показатель размера клиентской сборки.

| Каталог | Файлы | Причина |
| --- | --- | --- |
| `src/app`, `src/context`, `src/hooks` | `app/providers.tsx`; `context/CurrencyContext.tsx`; `hooks/useOrdersPerPage.ts`, `usePromotionItemsPerPage.ts`, `useReviewsItemsPerPage.ts`, `useToursItemsPerPage.ts` | Контексты, эффекты, browser storage и адаптивная пагинация. |
| `src/components/about` | `documents/DocumentsSwiper.tsx`; `hero/AnimatedArrowDesk.tsx`, `AnimatedArrowMob.tsx`; `mission/AnimatedArrowDesk.tsx`, `AnimatedArrowMob.tsx`; `team/TeamSwiperMob.tsx` | Swiper и motion анимации. |
| `src/components/agency`, `src/components/agent` | `agency/menu/content/AgencyInfoFormWithNotifications.tsx`; `agent/hero/AnimatedArrow.tsx`, `Hero.tsx`; `agent/menu/content/AgentInfoFormWithNotifications.tsx`, `AnimatedScribbleArrow.tsx`, `ChangePasswordFormWithNotifications.tsx`, `MenuContent.tsx`, `OrdersContent.tsx`, `OrdersFilters.tsx`, `SearchInput.tsx`; `agent/menu/Menu.tsx`; `agent/telegram/BenefitItem.tsx` | Формы и уведомления, состояние и URL вкладок/заказов, ввод, анимация счётчиков и стрелок. `agent/hero/Hero` управляет уведомлением. |
| `src/components/contacts`, `src/components/corporate` | `contacts/contactsInfo/AnimatedArrow.tsx`; `corporate/hero/AnimatedArrow.tsx` | Motion анимации. |
| `src/components/forgotPassword`, `resetPassword`, `signIn`, `signUp` | `forgotPassword/ForgotPasswordFormWithNotifications.tsx`; `resetPassword/ResetPasswordFormWithNotifications.tsx`; `signIn/LoginFormWithNotifications.tsx`; `signUp/SignUpFormWithNotifications.tsx` | Состояние форм и уведомлений. |
| `src/components/home` | `benefits/AnimatedArrow.tsx`, `BenefitItem.tsx`; `corporateService/AnimatedArrow.tsx`; `faq/FaqItem.tsx`; `hero/AnimatedArrow.tsx`; `promotion/PromotionListDesk.tsx`, `PromotionSwiperMob.tsx`; `smartTours/AnimatedArrow.tsx`, `SmartToursSwiper.tsx`; `step/AnimatedArrowBottom.tsx`, `AnimatedArrowTop.tsx`; `tours/AnimatedArrowDesk.tsx`, `AnimatedArrowMob.tsx` | Motion, счётчик, интерактивный FAQ, swiper и пагинация с callback рендера. |
| `src/components/reviews`, `search` | `reviews/AnimatedArrow.tsx`, `ReviewForm.tsx`, `ReviewsList.tsx`; `search/SearchList.tsx` | Анимация, состояние формы и пагинация. |
| `src/components/shared/animation` | `AnimatedListItem.tsx`, `AnimatedWrapper.tsx`, `LottieSpalshScreen.tsx`, `SplashGate.tsx` | Framer Motion, Lottie, эффект с session storage. |
| `src/components/shared/booking` | `Booking.tsx`, `BookingWithButton.tsx` | Состояние бронирования, события и формы. |
| `src/components/shared/footer` | `CallBack.tsx`, `FooterAnimation.tsx` | Состояние формы/уведомления; `usePathname` и анимация при смене URL. |
| `src/components/shared/forms` | `AgencyInfoForm.tsx`, `AgentInfoForm.tsx`, `BookingAgentForm.tsx`, `BookingForm.tsx`, `CallBackForm.tsx`, `ChangePassword.tsx`, `ForgotPasswordForm.tsx`, `LoginForm.tsx`, `ResetPasswordForm.tsx`, `SignUpForm.tsx`; `formComponents/BookingFields.tsx`, `MaskedInput.tsx` | Управление вводом, валидация, маска, события отправки. |
| `src/components/shared/header` | `AnimatedArrow.tsx`, `BurgerMenuButton.tsx`, `HeaderMob.tsx`, `currencyRate/CurrencyRate.tsx`, `navMenu/NavMenuItem.tsx` | Анимация, события меню, контекст и переключение валюты. |
| `src/components/shared/pagination`, `reviews`, `search` | `pagination/Pagination.tsx`; `reviews/ReviewsSwiperMob.tsx`; `search/SearchForm.tsx` | Состояние страницы, swiper и форма поиска. |
| `src/components/tour` | `benefits/AnimatedArrowDesk.tsx`, `AnimatedArrowMob.tsx`; `hotels/AnimatedSwitch.tsx`, `HotelModalContent.tsx`, `Hotels.tsx`; `inspiration/AnimatedArrow.tsx`; `inspiration/inspirationDesk/AnimatedArrowOneDesk.tsx`, `AnimatedArrowTwoDesk.tsx`, `AnimatedArrowThreeDesk.tsx`; `inspiration/inspirationMob/AnimatedArrowOneMob.tsx`, `AnimatedArrowTwoMob.tsx`, `AnimatedArrowThreeMob.tsx`; `tourCost/AnimatedArrowDesk.tsx`, `Calendar.tsx` | Motion, переключение гостиниц/модаль, выбор даты и работа с валютой. |
| `src/components/tours` | `TabMenu.tsx`, `Tours.tsx`, `ToursList.tsx` | URL категории, состояние вкладки, callback пагинации. |

## Сравнение production сборок

`next build` 16.3.6 с Turbopack. Метод: `scripts/report-client-build.mjs` суммирует размеры файлов JS в `.next/static` и уникальных JS чанков из route client-reference manifest. gzip каждого файла рассчитан отдельно; числа не равны сетевому трафику после кэширования. Число client references после дробления границ может вырасти, хотя объём JS уменьшится.

| Показатель | До | После |
| --- | ---: | ---: |
| Все JS файлы `.next/static`: число / байты / gzip | 39 / 2 282 560 / 693 198 | 39 / 2 274 001 / 689 541 |
| `/`: client refs / JS байты / gzip | 29 / 840 164 / 268 359 | 31 / 829 294 / 263 785 |
| `/contacts`: refs / JS байты / gzip | 15 / 645 153 / 208 041 | 18 / 634 283 / 203 467 |
| `/agency`: refs / JS байты / gzip | 15 / 934 718 / 295 255 | 19 / 922 837 / 290 279 |
| `/agent`: refs / JS байты / gzip | 15 / 935 216 / 295 523 | 19 / 924 346 / 290 949 |
| `/tours`: refs / JS байты / gzip | 14 / 652 629 / 210 516 | 18 / 641 759 / 205 942 |
| `/tours/[slug]`: refs / JS байты / gzip | 29 / 946 823 / 300 188 | 31 / 935 953 / 295 614 |

## Проверки и ограничение

- `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test`, `npm run check:architecture` прошли. Lint выдаёт три прежних предупреждения о `window.location.href`. Сборка выдаёт прежнее предупреждение Node о `tailwind.config.ts`.
- `scripts/smoke-rsc.mjs` на production сервере проверил desktop 1440×900 и mobile 390×844: шапка, ссылки `/contacts` → `/step`, открытие mobile меню и его визуальное закрытие, выбор `UAH/EUR`, сохранение выбора после перехода, текст footer, появление его анимации и отсутствие ошибок гидратации в консоли. Для UI проверки курс `/api/currency` подменён ответом `{ eur: 45.5, usd: 40 }` только в браузере.
- Реальный `GET /api/currency` ответил 500: серверу запрещено соединение с внешним источником (`connect EACCES`). Поэтому интеграционная проверка курса с реальными данными **не пройдена**; API-код не менялся. Согласно правилу плана о непрошедшей обязательной проверке чекбокс этапа 1 остаётся открытым.
- `node --env-file=.env.local scripts/check-client-secrets.mjs` и обход всех клиентских графов прошли. URL, форматы запросов и ответов API, формы и данные Sanity/CRM не менялись.
