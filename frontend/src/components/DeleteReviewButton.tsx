"use client"

import { deleteReview } from "@/lib/api";
interface Props {
    reviewId: string;
}


export default function DeleteReviewButton({ reviewId }: Props) {
  const handleDelete = async () => {
    try {
      await deleteReview(reviewId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button className="text-green-accent" onClick={handleDelete}>
      Delete
    </button>
  );
}
