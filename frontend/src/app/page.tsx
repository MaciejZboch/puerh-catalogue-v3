"use client"

import { useEffect, useState } from "react";
import { getIndex } from "@/lib/api";

export default function HomePage() {
  const [teas, setTeas] = useState<any[]>([]);

 useEffect(() => {
      fetch("http://localhost:4000/api/teas", {
    credentials: "include",
  })
      .then((res) => res.json())
      .then((data) => {
         console.log("API Response:", data); // 👈 Check here
        const latestTeas = data.populatedActivities
          .filter((act: any) => act.type === "tea")
          .map((act: any) => act.content); // extract tea object
        setTeas(latestTeas);
      });
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
                  <h3 className="font-bold text-light">Tea Name {tea.name}</h3>
                  <p className="text-mist">2023 · Yunnan · Sheng Pu’er</p>
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
    {[1, 2, 3, 4, 5].map((id) => (
      <li
        key={id}
        className="flex flex-col p-3 bg-charcoal rounded border-b border-green-accent"
      >
        <div className="flex justify-between">
          <span className="text-light">Popular Tea {id}</span>
          <span className="font-bold text-accent">⭐ {4.5 - id * 0.2}</span>
        </div>
        <p className="text-mist mt-1">
          This is a sample review text for Tea {id}. Really enjoyed the aroma and flavor!
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