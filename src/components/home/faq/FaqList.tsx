import { faqList } from "./mockedData";
import FaqItem from "./FaqItem";

export default function FaqList() {
  if (!faqList || !faqList.length) {
    return null;
  }

  return (
    <ul className="flex flex-col gap-y-4 xl:gap-y-5">
      {faqList.map((faqItem, idx) => (
        <FaqItem key={idx} faqItem={faqItem} />
      ))}
    </ul>
  );
}
