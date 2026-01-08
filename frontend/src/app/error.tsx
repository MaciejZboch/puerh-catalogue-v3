"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div
      className="min-h-screen sm:p-6 bg-dark text-light
    text-center flex flex-col "
    >
      <h1 className="text-3xl pt-32 font-bold">Whoops 😕</h1>

      <p className="text-ash py-4">
        Something went wrong on our end. Please try again, or come back later.
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => reset()}
          className="bg-green-accent text-dark px-4 py-2 rounded-md"
        >
          Try again
        </button>

        <a href="/" className="border border-green-accent px-4 py-2 rounded-md">
          Go home
        </a>
      </div>
    </div>
  );
}
