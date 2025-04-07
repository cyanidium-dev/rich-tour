import { phoneNumbers, email, address } from "./mockedData";
import { footerPhoneRegex } from "@/regex/regex";

export default function Contacts() {
  return (
    <ul className="flex flex-col gap-y-8 text-white max-w-[240px] md:max-w-full mx-auto md:m-0">
      {!address ? null : (
        <li>
          <h3 className="mb-3 text-16med xl:text-20med">Адреса</h3>
          <a
            href={address?.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block max-w-[186px] text-14reg xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
            aria-label="address"
          >
            {address?.title}
          </a>
        </li>
      )}
      {!phoneNumbers || !phoneNumbers.length ? null : (
        <li>
          <h3 className="mb-3 text-16med xl:text-20med">Номери</h3>
          <ul className="flex flex-col gap-y-2 text-14reg">
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
        </li>
      )}
      {!email ? null : (
        <li>
          <h3 className="mb-3 text-16med xl:text-20med">Email</h3>
          <a
            href={`mailto:${email}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-14reg xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
            aria-label="email"
          >
            {email}
          </a>
        </li>
      )}
    </ul>
  );
}
