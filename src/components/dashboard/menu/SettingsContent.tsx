import Image from "next/image";
import Container from "@/components/shared/container/Container";
import AgentInfoFormWithNotifications from "./AgentInfoFormWithNotifications";

export default function SettingsContent() {
  return (
    <Container className="flex flex-col gap-6 xl:flex-row-reverse xl:justify-between">
      <div className="xl:w-[40.6%]">
        <h2 className="mb-5 xl:mb-7 text-32med xl:text-48med text-center md:text-left">
          Заповніть інформацію!
        </h2>
        <p className="mb-6 xl:mb-[44px] text-center md:text-left text-14light xl:text-18light">
          Заповніть всю інформацію, щоб мати можливість зробити бронювання.
        </p>
        <div className="relative w-full h-[221px] md:h-[342px] rounded-[12px] overflow-hidden">
          <Image
            src="/images/dashboard/menu/settingsImage.webp"
            alt="background"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="absolute top-0 left-0 object-cover"
          />
        </div>
      </div>
      <AgentInfoFormWithNotifications />
    </Container>
  );
}
