import { InspirationItem } from "@/types/tour";

interface InspirationListProps {
  inspiration: InspirationItem[];
}

export default function InspirationList({ inspiration }: InspirationListProps) {
  return <ul className="mb-[42px] xl:mb-16">InspirationList</ul>;
}
