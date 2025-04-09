import Image from "next/image";
import Container from "@/components/shared/container/Container";
import Address from "./Address";
import Phones from "./Phones";
import Email from "./Email";
import SocialList from "./SocialList";

export default function ContactsInfo() {
  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container className="relative flex flex-col gap-y-5">
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
        <Address />
        <Phones />
        <div className="relative w-full h-[229px] rounded-[12px] overflow-hidden">
          <Image
            src="/images/contacts/contactsInfo/imageOne.webp"
            alt="mountain road"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <Email />
        <SocialList />
        <div className="relative w-full h-[229px] rounded-[12px] overflow-hidden">
          <Image
            src="/images/contacts/contactsInfo/imageTwo.webp"
            alt="european town"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
