import Link from "next/link";
import MainButton from "@/components/shared/buttons/MainButton";
import Container from "@/components/shared/container/Container";
import Image from "next/image";

export default function CorporateService() {
  return (
    <section className="mb-[148px] xl:mb-[180px] overflow-hidden text-white">
      <Container>
        <div className="relative rounded-[12px] overflow-hidden">
          <Image
            src="/images/home/corporate/corporateBg.webp"
            alt="background"
            width={2240}
            height={966}
            className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
          />
          <div className="px-7 py-10 xl:pt-14 xl:pb-7">
            <h2 className="mb-1 text-16reg xl:text-24reg text-center">
              Корпоративне обслуговування
            </h2>
            <p className="mb-8 xl:mb-7 text-32med xl:text-48med text-center">
              Ваша поїздка — наша турбота!
            </p>
            <Link href="/corporate">
              <MainButton
                variant="white"
                className="w-[203px] mx-auto mb-[118px] xl:mb-[171px] text-14med"
              >
                Переглянути
              </MainButton>
            </Link>
            <p className="max-w-[545px] mx-auto text-14reg xl:text-16reg text-center">
              Rich Tour пропонує професійні рішення для корпоративних клієнтів.
              Ми знаємо, як важливо забезпечити комфорт, ефективність та
              бездоганну організацію для вашого бізнесу.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
