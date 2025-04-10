import { email } from "@/components/shared/footer/mockedData";

export default function Email() {
  if (!email) {
    return null;
  }

  return (
    <div className="px-10 py-8 bg-white rounded-[12px] shadow-card">
      <h3 className="mb-3 text-24semi">Email</h3>
      <a
        href={`mailto:${email}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="text-16reg xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
        aria-label="email"
      >
        {email}
      </a>
    </div>
  );
}
