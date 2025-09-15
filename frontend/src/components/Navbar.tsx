"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../app/hooks/useAuth";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?query=${encodeURIComponent(query)}`);
    setQuery(""); // optional
    setMenuOpen(false); // also close dropdown after searching on mobile
  }

  return (
    <nav className="relative flex items-center justify-between p-4 bg-charcoal">
      {/* Logo */}
      <Link href="/" className="font-bold text-light">
        The Pu-Erh Catalogue
      </Link>

      {/* Desktop search */}
      <form
        onSubmit={handleSearch}
        className="relative hidden md:block w-full max-w-xs lg:max-w-sm"
      >
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

      {/* Desktop links */}
      <div className="hidden md:flex gap-4 text-light">
        {loading ? (
          <span className="text-mist">Loading...</span>
        ) : !user ? (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        ) : (
          <>
            <Link href="/new">New tea</Link>
            <Link href={`/profile/${user._id}`}>My Profile</Link>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-light"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-screen bg-charcoal flex flex-col gap-2 p-4 md:hidden text-light shadow-md z-10 overflow-x-hidden">
          {/* Mobile search */}
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

          {/* Mobile links */}
          {loading ? (
            <span className="text-mist">Loading...</span>
          ) : !user ? (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          ) : (
            <>
              <Link href="/new" onClick={() => setMenuOpen(false)}>
                New tea
              </Link>
              <Link
                href={`/profile/${user._id}`}
                onClick={() => setMenuOpen(false)}
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
