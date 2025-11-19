"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ISearchTea from "../../types/searchtea";
import UncollectButton from "@/components/UncollectButton";
import CollectButton from "@/components/CollectButton";
import { getCurrentUser } from "@/lib/api";
import { IUser } from "@/types/user";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [query, setQuery] = useState("");
  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);

  const [results, setResults] = useState<ISearchTea[]>([]);
  const [searching, setSearching] = useState(false);
  const [sortKey, setSortKey] = useState<keyof ISearchTea>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  // Fetch current user and search results when query changes
  useEffect(() => {
    if (!query) return;

    setSearching(true);

    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/teas/browse?search=${encodeURIComponent(query)}`,
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
    };

    fetchCurrentUser();
    fetchResults();
  }, [query, API_URL]);

  // Sorting
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

  const handleSort = (key: keyof ISearchTea) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="p-4 bg-dark text-light min-h-screen">
      <h2 className="text-lg font-semibold mb-2">
        Results for "{query}" ({results.length})
      </h2>

      <Link href="/new">
        <p>Don&apos;t see your tea? Click here to add it!</p>
      </Link>

      {searching && <p className="text-mist">Searching...</p>}

      {sortedResults.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-green-accent text-mist">
                {["name", "year", "vendor", "producer"].map((key) => (
                  <th
                    key={key}
                    className="cursor-pointer p-2 text-center"
                    onClick={() => handleSort(key as keyof ISearchTea)}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                    {sortKey === key && (sortAsc ? "▲" : "▼")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((tea) => {
                const isCollected =
                  currentUser &&
                  tea.owners?.includes(currentUser._id);

                return (
                  <tr
                    key={tea._id}
                    className="border-b border-gray-700 hover:bg-charcoal/50"
                  >
                    <td className="p-2 flex items-center gap-2">
                      {currentUser && !isCollected && (
                        <CollectButton
                          tea={tea}
                          onCollected={() => {
                            if (!currentUser?._id) return;
                            setResults((prev) =>
                              prev.map((t) =>
                                t._id === tea._id
                                  ? {
                                      ...t,
                                      owners: Array.isArray(t.owners)
                                        ? [...t.owners, currentUser._id]
                                        : [currentUser._id],
                                    }
                                  : t
                              )
                            );
                          }}
                        />
                      )}

                      {currentUser && isCollected && (
                        <UncollectButton
                          tea={tea}
                          onRemoved={(teaId) => {
                            setResults((prev) =>
                              prev.map((t) =>
                                t._id === teaId
                                  ? {
                                      ...t,
                                      owners:
                                        t.owners?.filter(
                                          (id) => id !== currentUser._id
                                        ) || [],
                                    }
                                  : t
                              )
                            );
                          }}
                        />
                      )}

                      <Link
                        href={`/tea/${tea._id}`}
                        className="text-green-accent hover:underline"
                      >
                        {tea.name}
                      </Link>
                    </td>
                    <td className="p-2 text-center">{tea.year || "-"}</td>
                    <td className="p-2 text-center">{tea.vendor?.name || "-"}</td>
                    <td className="p-2 text-center">{tea.producer?.name || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
