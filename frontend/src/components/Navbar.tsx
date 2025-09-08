"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../app/hooks/useAuth";

interface Tea {
  _id: string;
  name: string;
  year?: number;
  vendor?: { name: string };
  producer?: { name: string };
  type?: string;
  image?: { url: string };
}

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Tea[]>([]);
  const [searching, setSearching] = useState(false);
  const [sortKey, setSortKey] = useState<keyof Tea>("name");
  const [sortAsc, setSortAsc] = useState(true);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setSearching(true);
      const res = await fetch(
        `http://localhost:4000/api/teas/browse?search=${encodeURIComponent(query)}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data.teas);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  }

  function handleSort(key: keyof Tea) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const sortedResults = [...results].sort((a, b) => {
    const valA = a[sortKey] ?? "";
    const valB = b[sortKey] ?? "";

    // Handle nested objects like vendor / producer
    const strA =
      typeof valA === "object" && valA !== null ? (valA as any).name : valA;
    const strB =
      typeof valB === "object" && valB !== null ? (valB as any).name : valB;

    if (typeof strA === "number" && typeof strB === "number") {
      return sortAsc ? strA - strB : strB - strA;
    }
    return sortAsc
      ? String(strA).localeCompare(String(strB))
      : String(strB).localeCompare(String(strA));
  });

  return (
    <>
      <nav className="relative flex justify-between items-center p-4 bg-charcoal">
        <Link href="/" className="font-bold text-light">
          The Pu-Erh Catalogue
        </Link>

        {/* Search form */}
        <form onSubmit={handleSearch} className="relative w-64">
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
    disabled={searching}
  >
    {searching ? "Loading..." : "Search"}
  </button>
        </form>

        {/* Auth section */}
        <div className="flex gap-4 text-light">
          {loading ? (
            <span className="text-mist">Loading...</span>
          ) : !user ? (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          ) : (
            <>
              <Link href="/profile">{user.username}</Link>
              <button onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </nav>

      {/* Results table */}
      {results.length > 0 && (
        <div className="p-4 bg-dark text-light">
          <h2 className="text-lg font-semibold mb-2">
            Search Results ({results.length})
          </h2>
          {searching && <p className="text-mist">Searching...</p>}
          <table className="w-full text-left border-collapse">
            <thead>
  <tr className="border-b border-green-accent">
    <th
      className="cursor-pointer p-2 flex items-center gap-2"
      onClick={() => handleSort("name")}
    >
      <span className="w-6 h-6 inline-block"></span> {/* placeholder for alignment */}
      Name {sortKey === "name" && (sortAsc ? "▲" : "▼")}
    </th>
    <th
      className="cursor-pointer p-2 text-center"
      onClick={() => handleSort("year")}
    >
      Year {sortKey === "year" && (sortAsc ? "▲" : "▼")}
    </th>
    <th
      className="cursor-pointer p-2 text-center"
      onClick={() => handleSort("vendor")}
    >
      Vendor {sortKey === "vendor" && (sortAsc ? "▲" : "▼")}
    </th>
    <th
      className="cursor-pointer p-2 text-center"
      onClick={() => handleSort("producer")}
    >
      Producer {sortKey === "producer" && (sortAsc ? "▲" : "▼")}
    </th>
  </tr>
</thead>

<tbody>
  {sortedResults.map((tea) => (
    <tr
      key={tea._id}
      className="border-b border-gray-700 hover:bg-charcoal/50"
    >
      <td className="p-2 flex items-center gap-2">
        {tea.image?.url ? (
          <img
            src={tea.image.url}
            alt={tea.name}
            className="h-6 w-6 object-cover rounded"
          />
        ) : (
          <img
            src="https://cdn-icons-png.flaticon.com/256/712/712255.png"
            alt={tea.name}
            className="h-6 w-6 object-cover rounded"
          />
        )}
        <Link
          href={`/teas/${tea._id}`}
          className="text-green-accent hover:underline"
        >
          {tea.name}
        </Link>
      </td>
      <td className="p-2 text-center">{tea.year || "-"}</td>
      <td className="p-2 text-center">{tea.vendor?.name || "-"}</td>
      <td className="p-2 text-center">{tea.producer?.name || "-"}</td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}
    </>
  );
}
