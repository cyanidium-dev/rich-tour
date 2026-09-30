export default function Loader({ className = "w-dvw h-[700px]" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <div className="loader"></div>
    </div>
  );
}
