import Link from "next/link";
import {ITea} from "../types/tea";
const API_URL = process.env.BACKEND_URL;

export default async function LatestTeas() {
      const res = await fetch(`${API_URL}/api/teas`, {
    cache: "no-store", // always fetch fresh data
  });

  if (!res.ok) {
    throw new Error("Failed to fetch teas");
  }

  const data = await res.json();
  const teas: ITea[] = data.teas;
return (
  <section className="col-span-2">
          <h2 className="text-2xl font-semibold mb-6 text-light">
            Latest Teas
          </h2>
          <div className="grid gap-4">
            {teas.map((tea) => (
              <div
                key={tea._id}
                className="p-5 bg-charcoal shadow rounded-lg flex items-center justify-between border-b border-green-accent "
              >
              <div className="flex items-center gap-4">
          {/* Placeholder Image */}
          <img
            src={`https://cdn-icons-png.flaticon.com/256/712/712255.png`}
            alt={`Tea ${tea._id}`}
            className="w-12 h-12 rounded object-cover"
          />
                <div>
                  <Link href={`/tea/${tea._id}`}><h3 className="font-bold text-light">{tea.name} {tea.year}</h3></Link>
                  <p className="text-mist"> {tea.type}, {tea.shape}</p>
                </div>
              </div>
              <Link href={`/tea/${tea._id}`} className="px-3 py-1 rounded bg-green-accent text-dark hover:bg-green-soft transition">
                  Details
              </Link>
              </div>
            ))}
          </div>
  </section>
)
}