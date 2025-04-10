import Socials from "@/components/shared/footer/Socials";

export default function SocialList() {
  return (
    <div className="lg:absolute top-0 lg:left-[-72px] xl:left-[-95px] z-10 lg:w-[146%] xl:w-[156%] lg:aspect-[265/168] px-10 py-8 bg-white rounded-[12px] shadow-card">
      <h3 className="max-w-[129px] mb-3 text-24semi">Соціальні мережі</h3>
      <Socials className="text-black" />
    </div>
  );
}
