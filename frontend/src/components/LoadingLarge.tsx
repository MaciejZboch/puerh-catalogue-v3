export default function LoadingLarge({
  message = "Preparing your tea…",
}: {
  message?: string;
}) {
  return (
    <div className="bg-dark w-full flex flex-col items-center justify-center py-24 min-h-[calc(100vh-64px)]">
      {/* Loader */}
      <div className="relative w-32 h-32 animate-leaf-rotate">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 w-7 h-12 -translate-x-1/2 -translate-y-1/2"
            style={{ transform: `rotate(${i * 60}deg) translateY(-38px)` }}
          >
            <svg width="28" height="48" viewBox="0 0 24 40">
              <path
                d="M12 2 C18 10 20 20 12 36 C4 20 6 10 12 2 Z"
                fill="url(#leafGrad)"
              />
              <defs>
                <linearGradient id="leafGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        ))}
      </div>

      {/* Loading message */}
      <p className="mt-8 text-light/90 text-lg tracking-wide">{message}</p>
    </div>
  );
}
