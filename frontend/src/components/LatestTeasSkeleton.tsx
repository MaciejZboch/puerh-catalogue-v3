export default function LatestTeasSkeleton() {
  return (
    <section className="col-span-2">
      <h2 className="text-2xl font-semibold mb-6 text-light">
        Latest Teas
      </h2>
      <div className="grid gap-4">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 bg-charcoal shadow rounded-lg flex items-center justify-between border-b border-green-accent animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-700 rounded" />
              <div>
                <div className="h-4 w-32 bg-gray-700 rounded mb-2" />
                <div className="h-3 w-20 bg-gray-700 rounded" />
              </div>
            </div>
            <div className="h-6 w-12 bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}