"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ISearchTea from "@/types/searchtea";
import UncollectButton from "@/components/buttons/UncollectButton";
import { getCurrentUser } from "@/lib/api";
import CollectButton from "@/components/buttons/CollectButton";
import { IUser } from "@/types/user";
import LoadingLarge from "../animations/LoadingLarge";

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  let [results, setResults] = useState<ISearchTea[]>([]);
  const [searching, setSearching] = useState(true);
  const [sortKey, setSortKey] = useState<keyof ISearchTea>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (!query) return;
    async function fetchCurrentUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCurrentUser();
    async function fetchResults() {
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
    }

    fetchResults();
  }, [query, API_URL]);

  function handleSort(key: keyof ISearchTea) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  results = [...results].sort((a, b) => {
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

  if (searching) return <LoadingLarge />;

  return (
    <div className="p-4 bg-dark text-light min-h-screen">
      <h2 className="text-lg font-semibold mb-2">
        Results for "{query}" ({results.length})
      </h2>
      <Link href="/new">
        <p>Don&apos;t see your tea? Click here to add it!</p>
      </Link>

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
              {results.map((tea) => {
                const teaState = results.find((t) => t._id === tea._id); // ensure we use latest state
                const isCollected =
                  currentUser && teaState?.owners?.includes(currentUser._id);

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
                          text={"Remove"}
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
                        className="text-green-accent text-lg"
                      >
                        {tea.name}
                      </Link>
                    </td>

                    <td className="p-2 text-center">{tea.year || "-"}</td>

                    <td className="p-2 text-center">
                      <Link
                        href={`/search?query=tea.${tea.vendor?.name}`}
                        className="text-green-accent"
                      >
                        {tea.vendor?.name || "-"}
                      </Link>
                    </td>

                    <td className="p-2 text-center">
                      {tea.producer?.name || "-"}
                    </td>
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
