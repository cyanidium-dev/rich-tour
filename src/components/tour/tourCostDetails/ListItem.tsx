import AnimatedListItem from "@/components/shared/animation/AnimatedListItem";

interface ListItemProps {
  item: string;
}

export default function ListItem({ item }: ListItemProps) {
  return (
    <AnimatedListItem className="flex gap-x-5 items-center">
      <div className="size-5 rounded-full bg-main"></div>
      <p className="max-w-[87%] text-16reg xl:text-20reg">{item}</p>
    </AnimatedListItem>
  );
}
