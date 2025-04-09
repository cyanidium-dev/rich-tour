import { TeamMember } from "@/types/team";

interface TeamSwiperMobProps {
  teamMembers: TeamMember[];
}

export default function TeamSwiperMob({ teamMembers }: TeamSwiperMobProps) {
  return <div className="md:hidden">TeamSwiperMob</div>;
}
