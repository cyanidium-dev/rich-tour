import { TeamMember } from "@/types/team";

interface TeamListDeskProps {
  teamMembers: TeamMember[];
}

export default function TeamListDesk({ teamMembers }: TeamListDeskProps) {
  return <ul className="hidden md:block">TeamListDesk</ul>;
}
