import { TourProgramListItem } from "@/types/tour";
import ExcursionsListItem from "./ExcursionsListItem";

interface ProgramListProps {
  programList: TourProgramListItem[];
}

export default function ExcursionsList({ programList }: ProgramListProps) {
  if (!programList || !programList.length) return null;

  return (
    <ul className="flex flex-col gap-y-[28px] xl:gap-y-[28px]">
      {programList.map((programItem, idx) => (
        <ExcursionsListItem key={idx} programItem={programItem} idx={idx} />
      ))}
    </ul>
  );
}
