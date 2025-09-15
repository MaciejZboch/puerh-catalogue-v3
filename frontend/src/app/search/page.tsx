"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ISearchTea from "../../types/searchtea";
import { useAuth } from "../hooks/useAuth";

export default function SearchPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [results, setResults] = useState<ISearchTea[]>([]);
  const [searching, setSearching] = useState(false);
  const [sortKey, setSortKey] = useState<keyof ISearchTea>("name");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    if (!query) return;

    async function fetchResults() {
      try {
        setSearching(true);
        const res = await fetch(
          `http://localhost:4000/api/teas/browse?search=${encodeURIComponent(
            query
          )}`,
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

    fetchResults();
  }, [query]);

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
    <div className="p-4 bg-dark text-light min-h-screen">
      <h2 className="text-lg font-semibold mb-2">
        Results for "{query}" ({results.length})
      </h2>
      <Link href="/new">
        <p>Don&apos;t see your tea? Click here to add it!</p>
      </Link>

      {searching && <p className="text-mist">Searching...</p>}

      {results.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-green-accent text-mist">
                <th
                  className="cursor-pointer p-2"
                  onClick={() => handleSort("name")}
                >
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
                  <td className="p-2">
                    <Link
                      href={`/teas/${tea._id}`}
                      className="text-green-accent hover:underline"
                    >
                      {tea.name}
                    </Link>
                  </td>
                  <td className="p-2 text-center">{tea.year || "-"}</td>
                  <td className="p-2 text-center">{tea.vendor?.name || "-"}</td>
                  <td className="p-2 text-center">
                    {tea.producer?.name || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
