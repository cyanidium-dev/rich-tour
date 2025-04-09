import Image from "next/image";
import { Document } from "@/types/document";

interface DocumentCardProps {
  document: Document;
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const { image } = document;

  return (
    <a
      href={image?.url || ""}
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      <div className="relative w-[265px] h-[377px]">
        <Image
          src={image?.url}
          alt={image?.alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="w-full h-auto object-contain object-top"
        />
      </div>
    </a>
  );
}
