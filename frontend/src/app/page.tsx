import { Suspense } from "react";
import LatestTeas from "../components/LatestTeas";
import LatestReviews from "@/components/LatestReviews";
import LatestTeasSkeleton from "@/components/LatestTeasSkeleton";
import LatestReviewsSkeleton from "@/components/LatestReviewSkeleton";
import LandingHero from "@/components/landingDesktop";
import LandingMobile from "@/components/landingMobile";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-dark text-light">
      {/* Landing sections */}
      <div className="hidden md:block relative">
        <LandingHero />
      </div>
      <div className="block md:hidden">
        <LandingMobile />
      </div>

      {/* Main Content */}
      <main className="relative flex-1 px-4 md:px-36 py-12 grid grid-cols-1 md:grid-cols-3 gap-30">
        {/* Latest Teas */}
        <Suspense fallback={<LatestTeasSkeleton />}>
          <LatestTeas />
        </Suspense>
        {/* Sidebar / Reviews */}
        <Suspense fallback={<LatestReviewsSkeleton />}>
          <LatestReviews />
        </Suspense>
      </main>
    </div>
  );
}
