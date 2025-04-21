interface PointItemProps {
  point: string;
}

export default function PointItem({ point }: PointItemProps) {
  return (
    <li className="relative w-fit">
      <p className=" py-2 px-8 rounded-full border border-black bg-white text-18reg">
        {point}
      </p>

      <div className="absolute bottom-[-30px] xl:bottom-[-34px] left-[calc(50%-8px)] size-4 rounded-full bg-main"></div>
    </li>
  );
}
