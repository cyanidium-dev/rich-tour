import { TourProgramListItem } from "@/types/tour";
import ProgramListItem from "./ProgramListItem";

interface ProgramListProps {
  programList: TourProgramListItem[];
}

export default function ProgramList({ programList }: ProgramListProps) {
  if (!programList || !programList.length) return null;

  return (
    <ul className="flex flex-col gap-y-[88px] xl:gap-y-[100px]">
      {programList.map((programItem, idx) => (
        <ProgramListItem key={idx} programItem={programItem} idx={idx} />
      ))}
    </ul>
  );
}
