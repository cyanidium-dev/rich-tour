import Container from "@/components/shared/container/Container";
import FaqList from "./FaqList";

export default function Faq() {
  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <Container>
        <h2 className="mb-10 text-36med xl:text-48med text-center">
          Часто задавані питання
        </h2>
        <FaqList />
      </Container>
    </section>
  );
}
