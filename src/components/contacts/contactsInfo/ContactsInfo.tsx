import Image from "next/image";
import Container from "@/components/shared/container/Container";
import Address from "./Address";
import Phones from "./Phones";
import Email from "./Email";
import SocialList from "./SocialList";

export default function ContactsInfo() {
  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container className="relative">
        <Image
          src="/images/contacts/contactsInfo/arrow.svg"
          alt="arrow"
          width="201"
          height="115"
          className="absolute top-[-124px] xl:top-[-130px] right-[calc(50%-205px)] xl:right-[calc(50%-529px)] w-[201px] xl:w-[294px] h-auto"
        />
        <h2 className="mb-[60px] xl:mb-10 text-36med xl:text-40med text-center">
          Наші контакти
        </h2>
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex flex-col gap-y-5 lg:w-[calc(25%-15px)]">
            <Address />
            <Phones />
          </div>
          <div className="relative w-full lg:w-[calc(25%-15px)] h-[229px] lg:h-auto lg:aspect-[265/398] rounded-[12px] overflow-hidden">
            <Image
              src="/images/contacts/contactsInfo/imageOne.webp"
              alt="mountain road"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-y-5 lg:w-[calc(33.5%-15px)]">
            <div className="hidden lg:block relative lg:aspect-[311/253] xl:aspect-[360/253] rounded-[12px] overflow-hidden">
              <Image
                src="/images/contacts/contactsInfo/imageThree.webp"
                alt="mountains"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <Email />
          </div>
          <div className="relative flex flex-col justify-end gap-y-5 lg:w-[calc(16.5%-15px)]">
            <SocialList />
            <div className="relative w-full h-[229px] lg:h-[209px] rounded-[12px] overflow-hidden">
              <Image
                src="/images/contacts/contactsInfo/imageTwo.webp"
                alt="european town"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
