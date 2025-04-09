import { teamMembers } from "./mockedData";
import Container from "@/components/shared/container/Container";
import TeamInfo from "./TeamInfo";
import TeamListDesk from "./TeamListDesk";
import TeamSwiperMob from "./TeamSwiperMob";

export default function Team() {
  if (!teamMembers || !teamMembers.length) {
    return null;
  }

  return (
    <section className=" mb-[148px] xl:mb-[180px]">
      <TeamInfo />
      <Container>
        <TeamListDesk teamMembers={teamMembers} />
      </Container>
      <TeamSwiperMob teamMembers={teamMembers} />
    </section>
  );
}
