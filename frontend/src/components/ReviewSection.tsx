"use client";

import { cookies } from "next/headers";
import ReviewForm from "./ReviewForm";
import { IPopulatedReview } from "@/types/review";
import DeleteReviewButton from "./DeleteReviewButton";
import { useState } from "react";

export async function getCurrentUserForServer() {
  const cookieStore = cookies();
  const res = await fetch("http://localhost:4000/api/me", { credentials: "include", headers: {
      cookie: cookieStore.toString()
    }, });
  if (!res.ok) return null;
  return res.json();
}

export default async function ReviewSection({
  teaId,
  reviews,
}: {
  teaId: string;
  reviews: IPopulatedReview[];
}) {
    const currentUser = await getCurrentUserForServer();
return ( <>
<ReviewForm teaId={teaId}/>

        <section>
          <h3 className="text-xl font-semibold mb-4">Reviews</h3>
          <div className="space-y-4">
            {reviews.map((review: IPopulatedReview, i: any) => (
              <div
                key={i}
                className="bg-charcoal border-b border-green-accent rounded-xl shadow p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{review.author.username}</span>
                  <span className="text-sm text-gray-500">
                    {review.rating.toFixed(1)} ★
                  </span>
                </div>
                <p className="text-mist">{review.body}</p>
                {currentUser && review.author._id === currentUser._id && <DeleteReviewButton reviewId={review._id}/>}
              </div>
            ))}
          </div>
        </section>
</>
)
        }