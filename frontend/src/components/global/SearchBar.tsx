"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";

import { usePathname } from "next/navigation";

export default function SearchBar({
  setMenuOpen,
  className,
}: {
  setMenuOpen?: (open: boolean) => void;
  className: string;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const pathname = usePathname();

  //placeholder setup
  const PLACEHOLDERS = [
    "Mengku",
    "Xiaguan",
    "Bulang",
    "Menghai",
    "Simao",
    "CNNP",
  ];

  const [placeholder, setPlaceholder] = useState(
    () => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
  );

  //randomize placeholder on navigation
  useEffect(() => {
    setPlaceholder(
      PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
    );
  }, [pathname]);

  //portal setup
  const inputRef = useRef<HTMLInputElement>(null);
  const [coords, setCoords] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setCoords(inputRef.current.getBoundingClientRect());
    }
  }, [open, suggestions]);

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
  }, [query, API_URL]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setPlaceholder(
      PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
    );
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
    <div className={className}>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder={`e.g. ${placeholder}`}
          className="w-full rounded-md px-4 py-2  text-light"
        />
        <button
          type="submit"
          className="nohover hover:text-green-soft absolute right-2 top-1/2 -translate-y-1/2 text-green-accent rounded-md"
        >
          Search
        </button>
      </form>
      {open &&
        suggestions.length > 0 &&
        coords &&
        createPortal(
          <ul
            className="fixed z-[9999] bg-dark text-light rounded-md shadow-lg"
            style={{
              top: coords.bottom + 4,
              left: coords.left,
              width: coords.width,
            }}
          >
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="px-4 py-2 hover:text-green-accent cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                  setMenuOpen?.(false);

                  s.type === "tea"
                    ? router.push(`/tea/${s.id}`)
                    : router.push(
                        `/search?query=${encodeURIComponent(s.label)}`
                      );
                }}
              >
                <span className="text-xs opacity-60 mr-2">{s.type}</span>
                {s.label}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
}
