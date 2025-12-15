import { IPopulatedReview } from "@/types/review";
import Link from "next/link";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function LatestReviews() {
const res = await fetch(`${API_URL}/api/teas`, {
    cache: "no-store", // always fetch fresh data
  });

  if (!res.ok) {
    throw new Error("Failed to fetch teas");
  }

  const data = await res.json();
  const reviews: IPopulatedReview[] = data.reviews;

return (<aside className="col-span-1">
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
          <Link className="text-green-accent" href={`/tea/${review.tea._id}`}>{review.tea.name}</Link> <br></br>
          <b className="text-light">{review.rating.toFixed(1)} ★</b>
          {/*shorten to 100 chars and add ...*/}
          <p className="text-mist">{review.body.substring(0, 100)}{review.body.length > 100 && "..."}</p>
        </div>

        
      </li>
    ))}
  </ul>
</aside>)
}