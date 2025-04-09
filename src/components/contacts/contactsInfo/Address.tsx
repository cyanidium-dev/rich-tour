import { address } from "@/components/shared/footer/mockedData";

export default function Address() {
  if (!address) {
    return null;
  }
  return (
    <div className="px-10 py-8 bg-white rounded-[12px] shadow-card">
      <h3 className="mb-3 text-24semi">Адреса</h3>
      <a
        href={address?.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="block text-16reg xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
        aria-label="address"
      >
        {address?.title}
      </a>
    </div>
  );
}
