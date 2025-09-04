export default function LatestTeasSkeleton() {
  return (
    <div className="grid gap-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="p-5 bg-charcoal rounded-lg animate-pulse flex items-center justify-between border-b border-green-accent"
        >
          <div className="flex items-center gap-4">
            {/* Fake image */}
            <div className="w-12 h-12 bg-gray-700 rounded" />
            <div>
              {/* Fake title */}
              <div className="h-4 w-32 bg-gray-700 rounded mb-2" />
              {/* Fake subtitle */}
              <div className="h-3 w-20 bg-gray-700 rounded" />
            </div>
          </div>
          {/* Fake button */}
          <div className="h-6 w-12 bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
}