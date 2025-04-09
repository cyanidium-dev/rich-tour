import { TeamMember } from "@/types/team";
import TeamCard from "./TeamCard";

interface TeamListDeskProps {
  teamMembers: TeamMember[];
}

export default function TeamListDesk({ teamMembers }: TeamListDeskProps) {
  return (
    <ul className="hidden md:flex gap-x-5 mt-16">
      {teamMembers.slice(0, 4).map((teamMember, idx) => (
        <li key={idx} className="md:w-[calc(25%-15px)]">
          <TeamCard teamMember={teamMember} />
        </li>
      ))}
    </ul>
  );
}
