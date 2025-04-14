import Container from "../shared/container/Container";
import Login from "./Login";

export default function SignIn() {
  return (
    <section className="mt-[18px] mb-[148px] xl:mb-[180px]">
      <Container>
        <div className="max-w-[740px] pt-[120px] pb-[178px] xl:py-[74px] sm:px-8 mx-auto sm:border border-black rounded-[16px]">
          <h1 className="mb-6 text-24semi text-center">Вхід для агентів</h1>
          <Login />
        </div>
      </Container>
    </section>
  );
}
