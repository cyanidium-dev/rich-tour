import { allDocumentsUrl, documentsList } from "./mockedData";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import Container from "@/components/shared/container/Container";
import DocumentsTitle from "./DocumentsTitle";
import MainButton from "@/components/shared/buttons/MainButton";
import DocumentsSwiper from "./DocumentsSwiper";

export default function Documents() {
  if (!documentsList || !documentsList.length) {
    return null;
  }

  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <div className="pt-[65px] xl:pt-12 pb-[55px] xl:pb-[73px] mb-10 xl:mb-6 bg-black">
        <DocumentsTitle />
        <Container>
          <DocumentsSwiper />
        </Container>
      </div>
      <Container>
        <AnimatedWrapper animation={fadeInAnimation({ y: 30 })}>
          <a
            href={allDocumentsUrl || ""}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block w-full max-w-[346px] mx-auto"
          >
            <MainButton variant="black" className="w-full h-[62px] text-16med">
              Завантажити документи
            </MainButton>
          </a>
        </AnimatedWrapper>
      </Container>
    </section>
  );
}
