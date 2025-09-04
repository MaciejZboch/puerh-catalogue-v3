"use client";

import {ITea} from "../types/tea";

interface TeaListProps {
  teas: ITea[];
}

export default function LatestTeas({teas}: TeaListProps) {
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
)
}