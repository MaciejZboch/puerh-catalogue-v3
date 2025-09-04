"use client"
import { Suspense } from "react";
import { useEffect, useState } from "react";
import {ITea} from "../types/tea";
import { IPopulatedReview } from "@/types/review";
import LatestTeas from "../components/LatestTeas";
import LatestTeasSkeleton from "@/components/LatestTeasSkeleton";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function HomePage() {
  const [teas, setTeas] = useState<ITea[]>([]);
  const [reviews, setReviews] = useState<IPopulatedReview[]>([]);

useEffect(() => {
  fetch("http://localhost:4000/api/teas", {
    credentials: "include",
  })
    .then((res) => res.json())
      .then((data) => {
         console.log("API Response:", data);
        setTeas(data.teas);
        setReviews(data.reviews);
      })
    .catch((err) => console.error("Fetch error:", err));
}, []);


  return (
    <div className="min-h-screen flex flex-col bg-dark text-light">

      {/* Hero / Intro */}
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
          <LatestTeas teas = {teas}/>
        </Suspense>
        {/* Sidebar / Reviews */}
        <aside>
  <h2 className="text-2xl font-semibold mb-6 text-light">
    Latest Reviews
  </h2>
  <ul className="space-y-3">
    {reviews.map((review) => (
      <li
        key={review._id}
        className="flex flex-col p-3 bg-charcoal rounded border-b border-green-accent"
      >
        <div className="flex justify-between">
          <span> <b  className="text-light">{review.author.username} </b> <span className="text-mist">reviewed  </span>  <span className="text-light">{review.tea.name}</span> </span>
          
        </div>
        <p className="text-mist mt-1"> Rating:⭐ {review.rating}</p>
        <p className="text-light mt-1">
          {review.body}
        </p>
        
      </li>
    ))}
  </ul>
</aside>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 bg-dark text-center text-sm text-ash">
        © {new Date().getFullYear()} The Pu-Erh Catalogue.
      </footer>
    </div>
  );
}