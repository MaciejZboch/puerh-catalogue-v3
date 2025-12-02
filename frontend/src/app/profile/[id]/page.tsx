"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { IUser } from "@/types/user";
import { getCurrentUser } from "@/lib/api";
import UncollectButton from "@/components/UncollectButton";
import ISearchTea from "@/types/searchtea";

export default function ProfilePage() {
    const params = useParams();
    const userId = params?.id as string;
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [user, setUser] = useState<IUser | null>(null);
    const [teas, setTeas] = useState<ISearchTea[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortKey, setSortKey] = useState<keyof ISearchTea>("name");
    const [sortAsc, setSortAsc] = useState(true);
    const [followedUsers, setFollowedUsers] = useState<IUser[]>([]);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const [loadingCurrentUser, setLoadingCurrentUser] = useState(true);

async function follow(userId: string) {
  const res = await fetch(`${API_URL}/api/users/${userId}`, {
      method: "PUT",
      credentials: "include",
    });
    if (res.ok && currentUser) {
    setCurrentUser((prev) =>
      prev
        ? { ...prev, following: [...prev.following, userId] }
        : prev
    );
  }
}
async function unfollow(userId: string) {
    const res = await fetch(`${API_URL}/api/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok && currentUser) {
    setCurrentUser((prev) =>
      prev
        ? { ...prev, following: prev.following.filter((id) => id !== userId) }
        : prev
    );
  }
}

async function uncollect(tea: ISearchTea) {
  try {
    if (user == null) {
      throw new Error("No user - failed to collect");
    }

    const res = await fetch(`${API_URL}/api/teas/${tea._id}/add`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json();
      console.error(err.error);
      return;
    }

    setTeas(prev => prev.filter(t => t._id !== tea._id));

  } catch (err) {
    console.error("Error updating collection:", err);
  }
}
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCurrentUser(false);
      }
  }
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_URL}/api/teas/collection/${encodeURIComponent(userId)}`,
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
   function handleSort(key: keyof ISearchTea) {
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

  if (loading || loadingCurrentUser) return <div className="p-6 bg-dark text-light min-h-screen items-center"> <p className="p-4">Loading profile...</p></div>;
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
          
          {currentUser && currentUser._id !== user._id &&
          <button className="px-3 py-1 rounded bg-green-accent text-dark"
            onClick={ !currentUser.following.includes(user._id)
            ? () => follow(userId)
            : () => unfollow(userId)}>
            {!currentUser.following.includes(user._id) ? "Follow" : "Unfollow"}</button>}
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

      {teas.length === 0 ? (
        <p className="text-mist">{user.username} hasn’t added any teas yet.</p>
      ) : ( <>
        <h2 className="text-xl font-semibold mb-2">{user.username}'s tea collection:</h2>
        <div className="overflow-x-auto">
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
                  <UncollectButton tea={tea}
                  onRemoved={(teaId) => setTeas(prev => prev.filter(t => t._id !== teaId))}
                  />
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
            ))}
          </tbody>
        </table>
        </div>
        </>
      )}
    </div>
  );
}

      
