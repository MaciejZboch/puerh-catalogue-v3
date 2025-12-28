"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { usePathname } from "next/navigation";

export default function SearchBar({ setMenuOpen }: { setMenuOpen?: Function }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const pathname = usePathname();

  const PLACEHOLDERS = [
    "e.g. Mengku",
    "e.g. Xiaguan",
    "e.g. Bulang",
    "e.g. Menghai",
    "e.g. Simao",
    "e.g. 2005 sheng",
    "e.g. CNNP",
  ];

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    navigateTo(`/search?query=${encodeURIComponent(query)}`);
  }

  //close suggestions dropdown on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /*//close suggestions on clicking outside
  useEffect(() => {
  function handleClick(e: MouseEvent) {
    if (!(e.target as HTMLElement).closest(".search-wrapper")) {
      setOpen(false);
    }
  }
  document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
}, []);*/

  //close suggestions and navigate to link
  function navigateTo(path: string) {
    setQuery("");
    setOpen(false);
    setSuggestions([]);
    setMenuOpen && setMenuOpen(false);
    router.push(path);
  }

  return (
    <div className="relative w-full max-w-sm">
      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder="e.g. Mengku"
          className="w-full rounded-md px-4 py-2 border-1 border-green-accent text-light"
        />
        <button
          type="submit"
          className="nohover hover:text-green-soft absolute right-2 top-1/2 -translate-y-1/2 text-green-accent rounded-md"
        >
          Search
        </button>
      </form>
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-dark text-light rounded-md shadow-lg">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="px-4 py-2 hover:text-green-accent cursor-pointer"
              onClick={() =>
                s.type === "tea"
                  ? navigateTo(`/tea/${s.id}`)
                  : navigateTo(`/search?query=${encodeURIComponent(s.label)}`)
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
