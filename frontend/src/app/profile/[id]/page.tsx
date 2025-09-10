"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ITableTea from "@/types/tabletea";
import { IUser } from "@/types/user";

export default function ProfilePage() {
    const params = useParams();
    const userId = params?.id as string;

    const [user, setUser] = useState<IUser | null>(null);
    const [teas, setTeas] = useState<ITableTea[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortKey, setSortKey] = useState<keyof ITableTea>("name");
    const [sortAsc, setSortAsc] = useState(true);
    const [followedUsers, setFollowedUsers] = useState<IUser[]>([]);



  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:4000/api/teas/collection/${encodeURIComponent(userId)}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setUser(data.collector);
        setTeas(data.teas || []);
        setFollowedUsers(data.followedUsers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
}
 if (userId) fetchProfile();
  }, [userId]);
   function handleSort(key: keyof ITableTea) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const sortedTeas = [...teas].sort((a, b) => {
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

  if (loading) return <p className="p-4 text-light">Loading profile...</p>;
  if (!user) return <p className="p-4 text-light">User not found.</p>;

  return (
    <div className="p-6 bg-dark text-light min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        {user.image?.url ? (
          <img
            src={user.image.url}
            alt={user.username}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt={user.username}
            className="h-16 w-16 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          {user.email && <p className="text-mist">{user.email}</p>}
        </div>
      </div>
            {/* Followed users */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          {user.username} follows:
        </h2>
        {followedUsers.length === 0 ? (
          <p className="text-mist">{user.username} isn’t following anyone yet.</p>
        ) : (
          <ul className="space-y-2">
            {followedUsers.map((fu) => (
              <li key={fu._id}>
                <Link
                  href={`/profile/${fu._id}`}
                  className="flex items-center gap-2 text-green-accent hover:underline"
                >
                  {fu.image?.url ? (
                    <img
                      src={fu.image.url}
                      alt={fu.username}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      alt={fu.username}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                  {fu.username}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2">{user.username}'s tea collection:</h2>
      {teas.length === 0 ? (
        <p className="text-mist">{user.username} hasn’t added any teas yet.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-green-accent">
              <th
                className="cursor-pointer p-2"
                onClick={() => handleSort("name")}
              >
                Name {sortKey === "name" && (sortAsc ? "▲" : "▼")}
              </th>
              <th
                className="cursor-pointer p-2"
                onClick={() => handleSort("year")}
              >
                Year {sortKey === "year" && (sortAsc ? "▲" : "▼")}
              </th>
              <th
                className="cursor-pointer p-2"
                onClick={() => handleSort("vendor")}
              >
                Vendor {sortKey === "vendor" && (sortAsc ? "▲" : "▼")}
              </th>
              <th
                className="cursor-pointer p-2"
                onClick={() => handleSort("producer")}
              >
                Producer {sortKey === "producer" && (sortAsc ? "▲" : "▼")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTeas.map((tea) => (
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
      )}
    </div>
  );
}

      
