import Socials from "@/components/shared/footer/Socials";

export default function SocialList() {
  return (
    <div className="px-10 py-8 bg-white rounded-[12px] shadow-card">
      <h3 className="mb-3 text-24semi">Соціальні мережі</h3>
      <Socials className="text-black" />
    </div>
  );
}
