import type { SiteContacts } from "@/shared/config";

export default function Address({ contacts }: { contacts: SiteContacts | null }) {
  if (!contacts?.address) {
    return null;
  }
  return (
    <div className="xl:h-[225px] px-10 lg:px-8 xl:px-10 py-8 lg:py-6 xl:py-8 bg-white rounded-[12px] shadow-card">
      <h3 className="mb-3 text-24semi">Адреса</h3>
      <a
        href={contacts.map || undefined}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="block text-16reg xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
        aria-label="address"
      >
        {contacts.address}
      </a>
    </div>
  );
}
