import type { TourProgramListItem } from "@/entities/tour";

export type ProgramListProps = { programList: TourProgramListItem[] };
export type ProgramListItemProps = { programItem: TourProgramListItem; idx: number };
