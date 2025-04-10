import { phoneNumbers } from "@/components/shared/footer/mockedData";
import { footerPhoneRegex } from "@/regex/regex";

export default function Phones() {
  if (!phoneNumbers || !phoneNumbers.length) {
    return null;
  }

  return (
    <div className="px-10 py-8 bg-white rounded-[12px] shadow-card">
      <h3 className="mb-3 text-24semi">Номери</h3>
      <ul className="flex flex-col gap-y-2 text-16reg">
        {phoneNumbers.map((number, idx) => (
          <li key={idx}>
            <a
              href={`tel:+${number.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              aria-label="phone number"
              className="lg:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
            >
              {number.replace(footerPhoneRegex, "($1) $2 $3 $4")}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
