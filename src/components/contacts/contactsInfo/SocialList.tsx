import { Socials } from "@/widgets/site-footer";
import type { SiteContacts } from "@/shared/config";

export default function SocialList({ contacts }: { contacts: SiteContacts | null }) {
  if (!contacts?.instagram && !contacts?.facebook) return null;
  return (
    <div className="lg:absolute top-0 lg:left-[-72px] xl:left-[-95px] z-10 lg:w-[146%] xl:w-[156%] lg:aspect-[265/168] px-10 py-8 bg-white rounded-[12px] shadow-card">
      <h3 className="max-w-[129px] mb-3 text-24semi">Соціальні мережі</h3>
      <Socials contacts={contacts} className="text-black" />
    </div>
  );
}
