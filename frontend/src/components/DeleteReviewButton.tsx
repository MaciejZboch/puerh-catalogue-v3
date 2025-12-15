"use client"

import { deleteReview } from "@/lib/api";
interface Props {
    reviewId: string;
    onDelete: () => void;
}


export default function DeleteReviewButton({ reviewId, onDelete }: Props) {
  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this review? This action cannot be undone.");
    if (!confirmed) {return};

    try {
      await deleteReview(reviewId);
      onDelete();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button className="nohover text-green-accent" onClick={handleDelete}>
      Delete
    </button>
  );
}
