"use client";
import { useState } from "react";
import { IPopulatedReview } from "@/types/review";

export default function ReviewForm({teaId, onNewReview} : {teaId : string, onNewReview : (review : IPopulatedReview) => void;}) {
    const [body, setBody] = useState("");
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //character length
    const MIN_LENGTH = 10;
    const MAX_LENGTH = 300;

    //validations

    const isTooShort = body.trim().length > 0 && body.trim().length < MIN_LENGTH;
    const isTooLong = body.length > MAX_LENGTH;
    const isInvalid = isTooShort || isTooLong;


    async function handleSubmit(e: React.FormEvent) {
      const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      
 

        e.preventDefault();

          if (isInvalid) {
            setError(
            isTooShort
            ? `Review must be at least ${MIN_LENGTH} characters`
            : `Review must be at most ${MAX_LENGTH} characters`
            );
            return;
          }

        setError(null);
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/teas/${teaId}/review/`, {
              method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
              review: {
                body,
                rating,
              }
        }),
            })
          const createdReview = await res.json();
          onNewReview(createdReview);
        if (!res.ok) throw new Error("Failed to submit review");

      // Clear form on success
        setBody("");
        setRating(5);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        

    }
        return <section>
        <h3>Write a review</h3>
        <form onSubmit={handleSubmit}>
            <textarea className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-charcoal"
            rows={3}
            placeholder="Short notes about this tea..." value={body}
            onChange={(e) => setBody(e.target.value)}
            ></textarea>
          <div className="flex justify-between text-sm mb-3">

  {error && <p className="text-red-400 :">{error}</p>}

  <span
    className={body.length > MAX_LENGTH ? "text-red-400" : "text-muted"}
  >
    {body.length}/{MAX_LENGTH}
  </span>
</div>
        <div>
          <label className="block mb-1">Rating</label>
          <select
            className="p-2 rounded-md bg-charcoal border-b border-green-accent"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
           <button className="bg-green-accent rounded-xl py-2 px-4 mx-4">Submit</button>
        </div>
           
        </form>
        </section>
}