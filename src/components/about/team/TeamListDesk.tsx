import { TeamMember } from "@/types/team";
import { listVariants } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import TeamCard from "./TeamCard";
import AnimatedListItem from "@/components/shared/animation/AnimatedListItem";

interface TeamListDeskProps {
  teamMembers: TeamMember[];
}

export default function TeamListDesk({ teamMembers }: TeamListDeskProps) {
  return (
    <AnimatedWrapper
      as="ul"
      animation={listVariants({ staggerChildren: 0.5, delayChildren: 0.4 })}
      className="hidden md:flex gap-x-5 mt-16"
    >
      {teamMembers.slice(0, 4).map((teamMember, idx) => (
        <AnimatedListItem key={idx} className="md:w-[calc(25%-15px)]">
          <TeamCard teamMember={teamMember} />
        </AnimatedListItem>
      ))}
    </AnimatedWrapper>
  );
}
