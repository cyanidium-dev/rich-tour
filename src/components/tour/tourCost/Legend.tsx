import Image from "next/image";

export default function Legend() {
  const legendList = [
    {
      title: "Гарантовані виїзди",
      image: "/images/icons/calendar/guaranteed.svg",
    },
    {
      title: "Виїзд під запит",
      image: "/images/icons/calendar/onRequest.svg",
    },
    { title: "Гарячий тур", image: "/images/icons/calendar/hot.svg" },
    { title: "Місця є", image: "/images/icons/calendar/available.svg" },
    { title: "Діє знижка", image: "/images/icons/calendar/discount.svg" },
    { title: "Мало місць", image: "/images/icons/calendar/fewSeats.svg" },
    { title: "Немає виїздів", image: "/images/icons/calendar/noDeparture.svg" },

    { title: "Місць немає", image: "/images/icons/calendar/noSeats.svg" },
  ];

  return (
    <ul className="flex flex-wrap justify-between pt-[7px] pl-5 pr-4 pb-[18px] gap-y-[9px]">
      {legendList.map(({ title, image }, idx) => (
        <li
          key={idx}
          className="flex gap-x-[6px] items-center odd:w-[50.8%] even:w-[41.5%]"
        >
          <Image src={image} alt={title} width={20} height={20} />
          <p className="text-10reg">{title}</p>
        </li>
      ))}
    </ul>
  );
}
