"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBar({ setMenuOpen }: { setMenuOpen?: Function }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const res = await fetch(`${API_URL}/api/teas/suggestions?q=${query}`);
      const data = await res.json();
      setSuggestions(data);
      setOpen(true);
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  function submitSearch(value = query) {
    setMenuOpen && setMenuOpen(false); // if on mobile, close the dropdown menu
    setOpen(false);
    router.push(`/search?query=${encodeURIComponent(value)}`);
  }

  return (
    <div className="relative w-full max-w-sm">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setOpen(true)}
        placeholder="Search teas, regions, vendors…"
        className="w-full rounded-md px-4 py-2 border-1 border-green-accent text-light"
      />

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-dark text-light rounded-md shadow-lg">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="px-4 py-2 hover:text-green-accent cursor-pointer"
              onClick={() =>
                s.type === "tea"
                  ? router.push(`/tea/${s.id}`)
                  : submitSearch(s.label)
              }
            >
              <span className="text-xs opacity-60 mr-2">{s.type}</span>
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/*export default function SearchBar({ setMenuOpen }: { setMenuOpen?: Function }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?query=${encodeURIComponent(query)}`);
    setQuery("");
    setMenuOpen && setMenuOpen(false); // if on mobile, close the dropdown menu
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="text"
        placeholder="Search teas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 rounded-md bg-dark border border-green-accent text-light"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-green-accent"
      >
        Search
      </button>
    </form>
  );
}

/*<form
        onSubmit={handleSearch}
        className="relative hidden md:block w-full max-w-xs lg:max-w-sm"
      >
        <input
          type="text"
          placeholder="e.g. Menghai"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 rounded-md bg-dark border border-green-accent text-light"
        />
        <button
          type="submit"
          className="nohover hover:text-green-soft absolute right-2 top-1/2 -translate-y-1/2 text-green-accent rounded-md"
        >
          Search
        </button>
      </form>
*/
