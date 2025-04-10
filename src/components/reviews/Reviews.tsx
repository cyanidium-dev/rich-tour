import Image from "next/image";
import Container from "../shared/container/Container";
import ReviewForm from "./ReviewForm";

export default function Reviews() {
  return (
    <section className="pt-9 xl:pt-16 mb-[148px] xl:mb-[180px]">
      <Container className="relative">
        <h1 className="mb-[78px] xl:mb-[53px] text-36med xl:text-48med text-center">
          Відгуки
        </h1>
        <Image
          src="/images/reviews/arrow.svg"
          alt="arrow"
          width="154"
          height="119"
          className="absolute top-[14px] xl:top-[-33px] right-[calc(50%-179px)] xl:right-[calc(50%-279px)] w-[154px] h-auto"
        />
        <div>
          <ReviewForm />
        </div>
      </Container>
    </section>
  );
}
