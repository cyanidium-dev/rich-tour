interface BenefitItemProps {
  benefit: { value: string; description: string };
}

export default function BenefitItem({ benefit }: BenefitItemProps) {
  const { value, description } = benefit;

  return (
    <li className="p-[30px] rounded-[12px] bg-main text-white">
      <p className="mb-2 text-64semi text-center">{value}</p>
      <p className="text-16semi text-center">{description}</p>
    </li>
  );
}
