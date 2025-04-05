import Image from "next/image";
import Container from "@/components/shared/container/Container";
import BenefitsList from "./BenefitsList";

export default function Benefits() {
  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container>
        <div className="mb-10">
          <Image
            src="/images/home/benefits/imageFirst.webp"
            alt="man with luggage"
            width={910}
            height={690}
            className="mb-7"
          />
          <h2 className="max-w-[269px] mb-[14px] text-36med">
            Чому обирають нас
          </h2>
          <p className="max-w-[269px] text-14reg">
            Обираючи нас, ви обираєте якісний сервіс, комфорт та незабутні
            враження!
          </p>
        </div>
        <BenefitsList />
        <div className="p-5 rounded-[12px] shadow-benefits">
          <div className="mb-5 w-full h-94px rounded-[6px] overflow-hidden">
            <Image
              src="/images/home/benefits/imageSecond.webp"
              alt="sea"
              width={570}
              height={188}
              className="object-cover"
            />
          </div>
          <h3 className="mb-2 text-20med text-main">Експертність у туризмі</h3>
          <p>
            Наші досвідчені фахівці розробляють унікальні маршрути, враховуючи
            всі ваші побажання та інтереси. Ми знаємо, як зробити вашу подорож
            незабутньою!
          </p>
        </div>
      </Container>
    </section>
  );
}
