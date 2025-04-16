import { Suspense } from "react";
import { categories } from "../mockedData";
import Loader from "@/components/shared/loader/Loader";
import Category from "./Category";

export default function OrdersContent() {
  if (!categories || !categories.length) return null;

  return (
    <Suspense fallback={<Loader />}>
      <ul
        className="flex flex-col gap-y-10 xl:gap-y-[120px] pl-4 xs:pl-[25px] xl:pl-[80px] sm:ml-[calc((100vw-640px)/2)] md:ml-[calc((100vw-768px)/2)] lg:ml-[calc((100vw-1024px)/2)]
      xl:ml-[calc((100vw-1280px)/2)]"
      >
        {categories.map((category, idx) => (
          <Category key={idx} category={category} />
        ))}
      </ul>
    </Suspense>
  );
}
