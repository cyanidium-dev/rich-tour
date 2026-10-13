import { TeamMember } from "./types";
import { listVariants } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import TeamCard from "./TeamCard";
import AnimatedListItem from "@/components/shared/animation/AnimatedListItem";

interface TeamListDeskProps {
  teamMembers: TeamMember[];
}

export default function TeamListDesk({ teamMembers }: TeamListDeskProps) {
  const rowCount = Math.ceil(teamMembers.length / 4);
  const smallerRowSize = Math.floor(teamMembers.length / rowCount);
  const largerRowCount = teamMembers.length % rowCount;
  const columnSpans = ["", "lg:col-span-4", "lg:col-span-3", "lg:col-span-4", "lg:col-span-3"];
  const membersWithSpans = Array.from({ length: rowCount }, (_, rowIndex) => {
    const rowSize = smallerRowSize + (rowIndex < largerRowCount ? 1 : 0);
    const rowStart = rowIndex * smallerRowSize + Math.min(rowIndex, largerRowCount);
    return teamMembers.slice(rowStart, rowStart + rowSize).map((teamMember, indexInRow) => ({
      teamMember,
      columnSpan: columnSpans[rowSize],
      columnStart:
        indexInRow === 0 && rowSize <= 2
          ? rowSize === 1
            ? "lg:col-start-5"
            : "lg:col-start-4"
          : "",
    }));
  }).flat();

  return (
    <AnimatedWrapper
      as="ul"
      animation={listVariants({ staggerChildren: 0.5, delayChildren: 0.4 })}
      className="hidden md:grid md:grid-cols-12 md:auto-rows-fr md:gap-y-5 lg:gap-y-8 mt-16"
    >
      {membersWithSpans.map(({ teamMember, columnSpan, columnStart }, idx) => (
        <AnimatedListItem
          key={`${teamMember.name}-${idx}`}
          className={`h-full min-w-0 flex justify-center px-2.5 ${teamMembers.length === 1 ? "md:col-span-12" : "md:col-span-6"} ${columnSpan} ${columnStart} ${teamMembers.length > 1 && teamMembers.length % 2 === 1 && idx === teamMembers.length - 1 ? "md:col-start-4 lg:col-start-auto" : ""}`}
        >
          <TeamCard teamMember={teamMember} />
        </AnimatedListItem>
      ))}
    </AnimatedWrapper>
  );
}
