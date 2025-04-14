import Container from "../shared/container/Container";
import ResetPasswordFormWithNotifications from "./ResetPasswordFormWithNotifications";

export default function ResetPassword() {
  return (
    <section className="mt-[18px] mb-[148px] xl:mb-[180px]">
      <Container>
        <div className="max-w-[740px] pt-[120px] pb-[178px] xl:py-[74px] sm:px-8 mx-auto sm:border border-black rounded-[16px]">
          <h1 className="mb-6 text-24semi text-center">Відновлення паролю</h1>
          <p className="max-w-[348px] mb-6 mx-auto text-14reg text-center">
            Введіть електронну пошту вашого облікового запису, щоб отримати
            електронний лист з посиланням для зміни паролю.
          </p>
          <ResetPasswordFormWithNotifications />
        </div>
      </Container>
    </section>
  );
}
