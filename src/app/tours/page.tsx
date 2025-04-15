import { Suspense } from "react";
import Tours from "@/components/tours/Tours";
import Loader from "@/components/shared/loader/Loader";

export default function ToursPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Tours />
    </Suspense>
  );
}
