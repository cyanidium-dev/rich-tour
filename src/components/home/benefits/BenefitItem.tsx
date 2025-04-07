interface BenefitItemProps {
  benefit: { value: string; description: string };
}

export default function BenefitItem({ benefit }: BenefitItemProps) {
  const { value, description } = benefit;

  return (
    <li className="sm:w-[calc(33%-13.3px)] md:w-[calc(33%-10.6px)] xl:w-[calc(33%-13.3px)] p-[30px] sm:px-5 rounded-[12px] bg-main text-white">
      <p className="mb-2 text-64semi sm:text-52semi md:text-32semi xl:text-64semi text-center">
        {value}
      </p>
      <p className="text-16semi sm:text-12semi xl:text-16semi text-center">
        {description}
      </p>
    </li>
  );
}
