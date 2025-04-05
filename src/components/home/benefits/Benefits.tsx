import Image from "next/image";
import Container from "@/components/shared/container/Container";
import BenefitsList from "./BenefitsList";

export default function Benefits() {
  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container className="md:flex gap-x-5">
        <div className="mb-10 md:mb-0 md:w-[40.6%]">
          <Image
            src="/images/home/benefits/imageFirst.webp"
            alt="man with luggage"
            width={910}
            height={690}
            className="mb-7 md:mb-12 lg:mb-[44px] xl:mb-7"
          />
          <h2 className="max-w-[269px] xl:max-w-[389px] mb-[14px] xl:mb-5 text-36med xl:text-48med">
            Чому обирають нас
          </h2>
          <p className="max-w-[269px] xl:max-w-[455px] text-14reg xl:text-20reg">
            Обираючи нас, ви обираєте якісний сервіс, комфорт та незабутні
            враження!
          </p>
        </div>
        <div className=" md:w-[57.6%]">
          <BenefitsList />
          <div className="p-5 xl:py-[22px] rounded-[12px] shadow-benefits">
            <div className="md:flex gap-5 items-center">
              <div className="mb-5 md:mb-0 w-full md:w-[56px] lg:w-[146px] h-[94px] md:min-h-full rounded-[6px] overflow-hidden">
                <Image
                  src="/images/home/benefits/imageSecond.webp"
                  alt="sea"
                  width={570}
                  height={188}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-[calc(100%-76px)] lg:w-[calc(100%-166px]">
                <h3 className="mb-2 text-20med xl:text-24med text-main">
                  Експертність у туризмі
                </h3>
                <p className="text-14light">
                  Наші досвідчені фахівці розробляють унікальні маршрути,
                  враховуючи всі ваші побажання та інтереси. Ми знаємо, як
                  зробити вашу подорож незабутньою!
                </p>
              </div>
            </div>
          </div>

          <Image
            src="/images/home/benefits/imageThird.webp"
            alt="airplane"
            width={1290}
            height={428}
            className="hidden md:block mt-5"
          />
        </div>
      </Container>
    </section>
  );
}
