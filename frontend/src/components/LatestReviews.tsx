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
        <div className="flex justify-between">
          <span> <Link href={`/profile/${review.author._id}`}><b className="text-light">{review.author.username} </b> </Link>
          <span className="text-mist">reviewed </span>  
          <span className="text-light"><Link href={`/tea/${review.tea._id}`}>{review.tea.name}</Link> </span> </span>
          
        </div>
        <p className="text-mist mt-1"> Rating:⭐ {review.rating}</p>
        <p className="text-light mt-1">
          {review.body}
        </p>
        
      </li>
    ))}
  </ul>
</aside>)
}