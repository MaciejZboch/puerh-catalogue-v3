export default function LatestReviewsSkeleton() {
  return (
    <aside className="col-span-1">
      <h2 className="text-2xl font-semibold mb-6 text-light">
        Latest Reviews
      </h2>
      <ul className="space-y-3 animate-pulse">
        {Array.from({ length: 4 }).map((_, idx) => (
          <li
            key={idx}
            className="flex flex-col p-3 bg-charcoal rounded border-b border-green-accent"
          >
            {/* Username + tea name row */}
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-ash rounded"></div>
              <div className="h-4 w-16 bg-ash rounded"></div>
            </div>

            {/* Rating row */}
            <div className="h-3 w-20 bg-ash rounded mt-2"></div>

            {/* Review body */}
            <div className="h-3 w-full bg-ash rounded mt-3"></div>
            <div className="h-3 w-5/6 bg-ash rounded mt-2"></div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
