import { Fragment } from "react";
import {
  PHONE_FIRST,
  PHONE_SECOND,
  EMAIL,
  ADDRESS,
  ADDRESS_URL,
} from "@/constants/constants";
import { footerPhoneRegex } from "@/regex/regex";

export default function Contacts() {
  return (
    <ul className="flex flex-col gap-y-8 text-white max-w-[240px] md:max-w-full mx-auto md:m-0">
      <li>
        <h3 className="mb-3 text-16med xl:text-20med">Адреса</h3>
        <a
          href={ADDRESS_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-14reg xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
          aria-label="address"
        >
          {ADDRESS.map((line, index) => (
            <Fragment key={index}>
              {line}
              <br />
            </Fragment>
          ))}
        </a>
      </li>

      <li>
        <h3 className="mb-3 text-16med xl:text-20med">Номери</h3>
        <ul className="flex flex-col gap-y-2 text-14reg">
          <li>
            <a
              href={`tel:+${PHONE_FIRST.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              aria-label="phone number"
              className="lg:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
            >
              {PHONE_FIRST.replace(footerPhoneRegex, "($1) $2 $3 $4")}
            </a>
          </li>
          <li>
            <a
              href={`tel:+${PHONE_FIRST.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              aria-label="phone number"
              className="xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
            >
              {PHONE_SECOND.replace(footerPhoneRegex, "($1) $2 $3 $4")}
            </a>
          </li>
        </ul>
      </li>
      <li>
        <h3 className="mb-3 text-16med xl:text-20med">Email</h3>
        <a
          href={`mailto:${EMAIL}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-14reg xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
          aria-label="email"
        >
          {EMAIL}
        </a>
      </li>
    </ul>
  );
}
