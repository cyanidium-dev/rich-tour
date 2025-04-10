import Image from "next/image";
import Container from "../shared/container/Container";
import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";

export default function Reviews() {
  return (
    <section className="pt-9 md:pt-16 mb-[148px] xl:mb-[180px]">
      <Container className="relative">
        <h1 className="mb-[78px] xl:mb-[53px] text-36med xl:text-48med text-center">
          Відгуки
        </h1>
        <Image
          src="/images/reviews/arrow.svg"
          alt="arrow"
          width="154"
          height="119"
          className="absolute top-[14px] md:top-[-33px] right-[calc(50%-179px)] md:right-[calc(50%-279px)] w-[154px] h-auto"
        />
        <div className="flex flex-col md:flex-row-reverse md:justify-between gap-y-16 md:gap-x-8 xl:gap-x-[115px]">
          <ReviewForm />
          <ReviewsList />
        </div>
      </Container>
    </section>
  );
}
