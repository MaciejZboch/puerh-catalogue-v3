"use client"

import { deleteReview } from "@/lib/api";
interface Props {
    reviewId: string;
    onDelete: () => void;
}


export default function DeleteReviewButton({ reviewId, onDelete }: Props) {
  const handleDelete = async () => {
    try {
      await deleteReview(reviewId);
      onDelete();
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
