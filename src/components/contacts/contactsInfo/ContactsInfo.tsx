import Image from "next/image";
import Container from "@/components/shared/container/Container";

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
      </Container>
    </section>
  );
}
