import { Tour } from "@/types/tour";

type Category = {
  title: string;
  value: string;
};

const categories: Category[] = [
  { title: "Акційні тури", value: "promotion" },
  { title: "SMART тури", value: "smart" },
  { title: "Регулярні тури Європою", value: "europe" },
  { title: "Тури під заказні групи", value: "custom" },
  { title: "Львів для дітей", value: "lviv" },
  { title: "Різдвяні ярмарки Європою", value: "christmas" },
];

const getCategoryByIndex = (index: number): Category => {
  return categories[index % categories.length];
};

const getEarlyBookingByIndex = (index: number): boolean => {
  return index % 3 === 0;
};

const tourTemplate: Tour = {
  id: "1",
  slug: "tour-do-shwejcarii",
  title: "Тур до Швейцарії. Вирушайте у подорож до Швейцарії",
  description:
    "Вирушайте у подорож до Швейцарії – країни неймовірних пейзажів, бездоганного сервісу та справжнього затишку!",
  duration: 10,
  images: [
    { url: "/images/mockedPhoto/nightCity.webp", alt: "night city" },
    { url: "/images/mockedPhoto/tourTwo.webp", alt: "night city" },
    { url: "/images/mockedPhoto/tourThree.webp", alt: "night city" },
  ],
  category: categories[0],
  earlyBooking: false,
  benefits: {
    image: { url: "/images/mockedPhoto/benefitImage.webp", alt: "night city" },
    list: [
      {
        text: "Екскурсії в два неймовірні замки",
        sublist: ["Замок Дракули Бран", "Замок з серіалу Венздей"],
      },
      { text: "Знамените місто - Брашов" },
      { text: "Тематична фотосесія" },
    ],
  },
  program: {
    url: "",
    list: [
      {
        sublist: [
          { title: "Збір групи." },
          { title: "Перетин кордону." },
          { title: "Переїзд на територію Румунії" },
        ],
      },
      {
        description:
          "Нас очікують таємничі замки Трансильванії: Замок Дракули - Бран та Замок Венздей - Кантакузіно.",
        sublist: [
          {
            title: "Замок «Графа Дракули»",
            description:
              "Тут є все - серпантини сходів, лабіринти підземних ходів, дивовижна колекція зброї та мисливських трофеїв... Страшна казка про графа Дракулу була відзнята саме тут... Але іноді хочеться вірити у казку, навіть якщо вона дещо страшна... По-перше, з нами буде досвідчений гід, а по-друге, усім відомо, що казки просто зобов’язані закінчуватися щасливо. Замок оточують дуже милі сувенірні крамнички, у яких можна придбати різноманітні подарунки близьким. Всіх бажаючих запрошує «Кімната страху» - моторошне і захоплююче видовище...",
          },
          {
            title: "Замок Кантакузіно",
            description:
              "Який різко став популярним після виходу серіалу «Венздей». Саме на території цього замку знімали сцени, які відбуваються з Венздей Адамс в академії Невермор. Загальна площа комплексу Кантакузіно складає понад три тисячі квадратних метрів. Будівля замку оточена парком, на території якого знаходяться водоспад із гротом та фонтани.",
          },
          { title: "Переїзд до готелю." },
          { title: "Поселення." },
          { title: "Ночівля." },
        ],
      },
      {
        sublist: [
          { title: "Сніданок" },
          {
            title: "Місто Брашов",
            description:
              "Саме тут починається справжня Трансильванія: порослі лісом гори, похмурі готичні церкви і неприступні замки. Старий центр міста затиснутий горами у вузькій долині, у ньому збереглися всі атрибути середньовічного міста – будинки з черепичними дахами, вузькі вулички і приголомшливі краєвиди з навколишніх гір. Не дивно, що воно носить звання найвідвідуванішого міста в Румунії.",
          },
          { title: "Час для обіду і сувенірів" },
          { title: "Збір групи" },
          { title: "Виїзд на територію України" },
          { title: "Пізнє прибуття" },
        ],
      },
    ],
  },
  points: ["Львів", "Румунія", "Трансильванія", "Львів"],
  includedInCost: [],
  notIncludedInCost: [],
  inspiration: [],
};

const createTours = (template: Tour, count: number): Tour[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...template,
    id: `${i + 1}`,
    title: `${template.title} #${i + 1}`,
    slug: `${template.slug}-${i + 1}`,
    category: getCategoryByIndex(i),
    earlyBooking: getEarlyBookingByIndex(i),
  }));
};

export const toursList = createTours(tourTemplate, 100);
export { categories };
