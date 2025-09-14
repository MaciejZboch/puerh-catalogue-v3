"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../app/hooks/useAuth";
import ISearchTea from "../types/searchtea";


export default function Navbar() {
  const { user, logout, loading } = useAuth();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ISearchTea[]>([]);
  const [searching, setSearching] = useState(false);
  const [sortKey, setSortKey] = useState<keyof ISearchTea>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false); //controls collapsible navbar

  //add / remove tea from collection
  async function collect(tea: ISearchTea) {
  try {
    if (user == null) {throw new Error("No user - failed to collect");}
    const inCollection = tea.owners?.map(String).includes(user._id);
    const method = inCollection
      ? "DELETE"
      : "POST";

    const res = await fetch(`http://localhost:4000/api/teas/${tea._id}/add`, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json();
      console.error(err.error);
      return;
    }

    const updatedTea: ISearchTea = await res.json();

    setResults(prev =>
      prev.map(t => (t._id === updatedTea._id ? updatedTea : t))
    );
  } catch (err) {
    console.error("Error updating collection:", err);
  }
}

//search function
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


  function handleSort(key: keyof ISearchTea) {
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
          <nav className="relative flex items-center justify-between p-4 bg-charcoal">
      {/* Logo */}
      <Link href="/" className="font-bold text-light">
        The Pu-Erh Catalogue
      </Link>

      {/* Search (hidden on small screens) */}
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
          disabled={searching}
        >
          {searching ? "…" : "Search"}
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
              disabled={searching}
            >
              {searching ? "…" : "Search"}
            </button>
          </form>

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
      )}
    </nav>

      {/* Results table */}
      {results.length > 0 && (
        <div className="p-4 bg-dark text-light">
          <h2 className="text-lg font-semibold mb-2">
            Search Results ({results.length})
          </h2>
          <Link href="/new"><p>Don't see your tea? Click here to add it!</p></Link>
          {searching && <p className="text-mist">Searching...</p>}
          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
  <tr className="border-b border-green-accent text-mist">
    <th
      className="cursor-pointer p-2"
      onClick={() => handleSort("name")}
    >
      <div className="flex items-center gap-2">
      <span className="w-6 h-6 inline-block"></span> {/* placeholder for alignment */}
      </div>
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
  {user?._id ? (
    (Array.isArray(tea.owners) && tea.owners.map(String).includes(user._id)) ? (
      <button
        onClick={() => collect(tea)}
        className="px-3 py-1 rounded bg-green-accent text-dark hover:bg-green-soft transition"
      >
        Remove
      </button>
    ) : (
      <button
        onClick={() => collect(tea)}
        className="px-3 py-1 rounded bg-green-accent text-dark hover:bg-green-soft transition"
      >
        Collect
      </button>
    )
  ) : (
    <div className="px-3 py-1"></div>
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
        </div>
      )}
    </>
  );
}
