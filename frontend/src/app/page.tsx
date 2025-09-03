"use client"

import { useEffect, useState } from "react";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function HomePage() {
  const [teas, setTeas] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

useEffect(() => {
  fetch("http://localhost:4000/api/teas", {
    credentials: "include",
  })
    .then((res) => res.json())
      .then((data) => {
         console.log("API Response:", data);
        const latestTeas = data.teas
          .map((act: any) => act.content); // extract tea object
        setTeas(latestTeas);
        const latestReviews = data.reviews
          .map((act: any) => act.content); // extract review object
        setReviews(latestReviews);
      })
    .catch((err) => console.error("Fetch error:", err));
}, []);


  return (
    <div className="min-h-screen flex flex-col bg-dark text-light">

      {/* Hero / Intro */}
      <header className="px-6 py-16 bg-[linear-gradient(90deg,rgba(2,0,36,1)_0%,rgba(104,171,124,1)_0%,rgba(32,34,65,1)_82%,rgba(29,37,41,1)_100%,rgba(0,212,255,1)_100%)]">
        <h1 className="text-5xl font-bold mb-4 text-light">
          Welcome to The Pu-Erh Catalogue
        </h1>
        <p className="text-lg text-light max-w-2xl">
          Discover, rate, and catalog teas from around the world. 
          Join the community and keep track of your favorite teas.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Latest Teas */}
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
                  <h3 className="font-bold text-light">{tea.name} {tea.year}</h3>
                  <p className="text-mist"> {tea.type}, {tea.shape}</p>
                </div>
              </div>
              <button className="px-3 py-1 rounded bg-green-accent text-dark hover:bg-green-soft transition">
                  Rate
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar / Reviews */}
        <aside>
  <h2 className="text-2xl font-semibold mb-6 text-light">
    Latest Reviews
  </h2>
  <ul className="space-y-3">
    {reviews.map((review) => (
      <li
        key={review._id}
        className="flex flex-col p-3 bg-charcoal rounded border-b border-green-accent"
      >
        <div className="flex justify-between">
          <span> <b  className="text-light">{review.author.username} </b> <span className="text-mist">reviewed  </span>  <span className="text-light">{review.tea.name}</span> </span>
          
        </div>
        <p className="text-mist mt-1"> Rating:⭐ {review.rating}</p>
        <p className="text-light mt-1">
          {review.body}
        </p>
        
      </li>
    ))}
  </ul>
</aside>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 bg-dark text-center text-sm text-ash">
        © {new Date().getFullYear()} The Pu-Erh Catalogue.
      </footer>
    </div>
  );
}