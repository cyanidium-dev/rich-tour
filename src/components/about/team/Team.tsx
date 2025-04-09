import { teamMembers } from "./mockedData";
import TeamInfo from "./TeamInfo";
import TeamListDesk from "./TeamListDesk";
import TeamSwiperMob from "./TeamSwiperMob";

export default function Team() {
  if (!teamMembers) {
    return null;
  }

  return (
    <section className=" mb-[148px] xl:mb-[180px]">
      <TeamInfo />
      <TeamSwiperMob teamMembers={teamMembers} />
      <TeamListDesk teamMembers={teamMembers} />
    </section>
  );
}
