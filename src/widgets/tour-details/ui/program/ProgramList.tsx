import type { ProgramListProps } from "../../model/program-types";
import ProgramListItem from "./ProgramListItem";

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
