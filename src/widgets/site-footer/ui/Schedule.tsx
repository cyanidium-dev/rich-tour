import type { SiteContacts } from "@/shared/config";

export default function Schedule({ contacts }: { contacts: SiteContacts | null }) {
  if (!contacts?.working && !contacts?.weekend) {
    return null;
  }

  const { working, weekend } = contacts;

  return (
    <div className="max-w-[246px] md:max-w-full mx-auto md:mx-0 mb-8 text-white">
      <h3 className="mb-3 text-16med xl:text-20med">Графік роботи</h3>
      <p className="max-w-[246px] text-14reg">{working}</p>
      <p className="max-w-[246px] text-14reg">{weekend}</p>
    </div>
  );
}
