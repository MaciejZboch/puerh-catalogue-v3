"use client";
import { IPopulatedReview } from "@/types/review";
import Link from "next/link";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function LatestReviews() {
  const [reviews, setReviews] = useState<IPopulatedReview[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/teas`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch teas");
        return res.json();
      })
      .then((data) => setReviews(data.reviews))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const skeletons = Array.from({ length: 7 }); // 7 placeholder items

  return (
    <aside className="col-span-2 md:col-span-1 w-full px-4 md:px-0">
      <h2 className="text-2xl font-semibold mb-6 text-light">Latest Reviews</h2>
      <ul className="space-y-3">
        {loading
          ? skeletons.map((_, index) => (
              <li
                key={index}
                className="p-5 bg-charcoal shadow rounded-lg flex flex-col space-y-2 animate-pulse"
              >
                <div className="h-4 bg-gray-600 rounded w-1/3"></div> {/* username */}
                <div className="h-4 bg-gray-500 rounded w-1/2"></div> {/* reviewed tea */}
                <div className="h-3 bg-gray-500 rounded w-1/6 mt-2"></div> {/* rating */}
                <div className="h-4 bg-gray-700 rounded w-full mt-1"></div> {/* review body */}
              </li>
            ))
          : reviews?.map((review) => (
              <li
                key={review._id}
                className="p-5 bg-charcoal shadow rounded-lg flex flex-col justify-between border-b border-green-accent"
              >
                <div>
                  <Link
                    className="text-green-accent font-semibold"
                    href={`/profile/${review.author._id}`}
                  >
                    {review.author.username}
                  </Link>
                  <span className="text-mist"> reviewed </span>
                  <Link className="text-green-accent" href={`/tea/${review.tea._id}`}>
                    {review.tea.name}
                  </Link>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-light">{review.rating.toFixed(1)} ★</span>
                  </div>

                  <p className="text-mist">{review.body}</p>
                </div>
              </li>
            ))}
      </ul>
    </aside>
  );
}
