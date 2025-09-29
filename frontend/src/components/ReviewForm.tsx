"use client";
import { useState } from "react";
import { IPopulatedReview } from "@/types/review";

export default function ReviewForm({teaId, onNewReview} : {teaId : string, onNewReview : (review : IPopulatedReview) => void;}) {
    const [body, setBody] = useState("");
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:4000/api/teas/${teaId}/review/`, {
                method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                review: {
                body,
                rating,
                }
        }),
            })
            const createdReview = await res.json();
            console.log(createdReview);
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
                    <div>
          <label className="block mb-1">Rating</label>
          <select
            className="p-2 rounded-md bg-dark border-b border-green-accent"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-500">{error}</p>}
            <button className="bg-green-accent hover:bg-green-bright rounded-xl py-2 px-4">Submit</button>
        </form>
        </section>
}