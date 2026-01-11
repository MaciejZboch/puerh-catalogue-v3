"use client";

import ReviewForm from "./ReviewForm";
import { IPopulatedReview } from "@/types/review";
import DeleteReviewButton from "../buttons/DeleteReviewButton";
import { useState } from "react";
import Link from "next/link";

export default function ReviewSection({
  teaId,
  reviews,
  currentUser,
}: {
  teaId: string;
  reviews: IPopulatedReview[];
  currentUser: any;
}) {
  const [reviewsArray, setReviewsArray] = useState(
    [...reviews].sort(
      (a, b) =>
        new Date(parseInt(b._id.substring(0, 8), 16)).getTime() -
        new Date(parseInt(a._id.substring(0, 8), 16)).getTime()
    )
  );

  const handleAddReview = (newReview: IPopulatedReview) => {
    setReviewsArray((prev) => [newReview, ...prev]);
  };

  const handleDeleteReview = (id: string) => {
    setReviewsArray((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <>
      {currentUser && (
        <ReviewForm onNewReview={handleAddReview} teaId={teaId} />
      )}

      <section aria-labelledby="reviews-heading">
        {reviewsArray.length > 0 && (
          <h3 id="reviews-heading" className="text-xl font-semibold mb-4">
            Reviews
          </h3>
        )}
        <div className="space-y-4">
          {reviewsArray.map((review: IPopulatedReview, i: any) => (
            <article
              key={i}
              className="bg-charcoal border-b border-green-accent rounded-xl shadow p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">
                  <Link href={`/profile/${review.author._id}`}>
                    {review.author.username}
                  </Link>
                </span>
                <span className="text-sm text-light">
                  {review.rating.toFixed(1)} ★
                </span>
              </div>
              <p className="text-mist">{review.body}</p>
              {currentUser && review.author._id === currentUser._id && (
                <DeleteReviewButton
                  onDelete={() => handleDeleteReview(review._id)}
                  reviewId={review._id}
                />
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
