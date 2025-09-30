import { IPopulatedReview } from "@/types/review";
import Link from "next/link";
const API_URL = process.env.BACKEND_URL;

export default async function LatestReviews() {
const res = await fetch(`${API_URL}/api/teas`, {
    cache: "no-store", // always fetch fresh data
  });

  if (!res.ok) {
    throw new Error("Failed to fetch teas");
  }

  const data = await res.json();
  const reviews: IPopulatedReview[] = data.reviews;

return (<aside>
  <h2 className="text-2xl font-semibold mb-6 text-light">
    Latest Reviews
  </h2>
  <ul className="space-y-3">
    {reviews.map((review) => (
      
      <li
        key={review._id}
        className="p-5 bg-charcoal shadow rounded-lg flex items-center justify-between border-b border-green-accent "
      >
        
                <div>
                  <Link className="text-green-accent font-semibold" href={`/profile/${review.author._id}`}>{review.author.username}</Link>
                  <span className="text-mist"> reviewed </span>  
                  <Link className="text-green-accent" href={`/tea/${review.tea._id}`}>{review.tea.name}</Link>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-light">
                    {review.rating.toFixed(1)} ★
                  </span>
                </div>

                <p className="text-mist">{review.body}</p>
              </div>

        
      </li>
    ))}
  </ul>
</aside>)
}