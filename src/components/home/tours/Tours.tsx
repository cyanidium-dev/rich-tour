import Container from "@/components/shared/container/Container";
import ToursListMob from "./ToursListMob";
import ToursListDesk from "./ToursListDesk";

export default function Tours() {
  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container>
        <div className="mb-10 md:mb-14">
          <h2 className="mb-[14px] md:mb-[10px] text-36med xl:text-48med">
            Наші тури
          </h2>
          <p className="max-w-[198px] mb-[23px] md:mb-0 text-14med xl:text-16med">
            Мрієте про незабутню подорож?
          </p>
          <p>
            Ми створили тури для кожного, хто прагне відкрити світ: від
            романтичних прогулянок до захопливих пригод. Обирайте напрямок та
            вирушайте в подорож мрії!
          </p>
        </div>
        <ToursListMob />
        <ToursListDesk />
      </Container>
    </section>
  );
}
