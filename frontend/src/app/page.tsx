import { Suspense } from "react";
import LatestTeas from "../components/LatestTeas";
import LatestReviews from "@/components/LatestReviews";
import LatestTeasSkeleton from "@/components/LatestTeasSkeleton";
import LatestReviewsSkeleton from "@/components/LatestReviewSkeleton";
import Footer from "@/components/Footer";


export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-dark text-light">
      {/* Intro */}
      <header className="px-6 py-16 bg-[linear-gradient(90deg,rgba(2,0,36,1)_0%,rgba(104,171,124,1)_0%,rgba(32,34,65,1)_82%,rgba(29,37,41,1)_100%,rgba(0,212,255,1)_100%)]">
        <h1 className="text-5xl font-bold mb-4 text-light">
          Welcome to The Pu-Erh Catalogue
        </h1>
        <p className="text-lg text-light max-w-2xl">
          Discover, rate, and catalog teas from around the world. 
          Join the community and keep track of your favorite teas.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Latest Teas */}
        <Suspense fallback={<LatestTeasSkeleton/>}>
          <LatestTeas/>
        </Suspense>
        {/* Sidebar / Reviews */}
        <Suspense fallback={<LatestReviewsSkeleton/>}>
          <LatestReviews/>
        </Suspense>
      </main>

      {/* Footer */}
<Footer/>
    </div>
  );
}