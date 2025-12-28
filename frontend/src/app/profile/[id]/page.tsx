"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { IUser } from "@/types/user";
import { getCurrentUser } from "@/lib/api";
import UncollectButton from "@/components/buttons/UncollectButton";
import ISearchTea from "@/types/searchtea";
import LoadingLarge from "@/components/animations/LoadingLarge";
import Image from "next/image";

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
        prev ? { ...prev, following: [...prev.following, userId] } : prev
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
  }, [userId, API_URL]);
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

  if (loading || loadingCurrentUser) return <LoadingLarge />;
  if (!user) return <p className="p-4 text-light">User not found.</p>;

  return (
    <div className="p-6 bg-dark text-light min-h-screen">
      <div className="w-full max-w-full sm:max-w-2xl mx-auto p-6 bg-charcoal rounded-2xl shadow-xl border border-green-accent/40 overflow-hidden">
        {/* Profile header */}
        <div className="flex items-center gap-4 mb-6">
          <Image
            src={
              user.image?.url ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            alt={user.username}
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">{user.username}</h1>
            {user.email && <p className="text-mist">{user.email}</p>}

            {currentUser && currentUser._id !== user._id && (
              <button
                className="mt-2 px-3 py-1 rounded bg-green-accent text-dark font-semibold"
                onClick={
                  !currentUser.following.includes(user._id)
                    ? () => follow(userId)
                    : () => unfollow(userId)
                }
              >
                {!currentUser.following.includes(user._id)
                  ? "Follow"
                  : "Unfollow"}
              </button>
            )}
          </div>
        </div>

        {/* Followed users */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">
            {user.username} follows:
          </h2>
          {followedUsers.length === 0 ? (
            <p className="text-mist">
              {user.username} isn’t following anyone yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {followedUsers.map((fu) => (
                <li key={fu._id}>
                  <Link
                    href={`/profile/${fu._id}`}
                    className="flex items-center gap-1 sm-gap-2 text-green-accent hover:underline"
                  >
                    <img
                      src={
                        fu.image?.url ||
                        "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      }
                      className="h-8 w-8 rounded-full object-cover"
                      alt={fu.username}
                    />
                    {fu.username}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {teas.length === 0 ? (
        <p className="text-mist pt-4">
          {user.username} hasn’t added any teas yet.
        </p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2 pt-4">
            {user.username}'s tea collection:
          </h2>
          <div className="overflow-x-auto max-w-full">
            <table className="w-full table-auto sm-table-fixed border-collapse text-left">
              <thead>
                <tr className="border-b border-green-accent text-mist">
                  {/* Column 1: action button column */}
                  <th className="w-16 p-1 sm-p2"></th>

                  <th
                    className="p-1 sm-p-2 cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Name {sortKey === "name" && (sortAsc ? "▲" : "▼")}
                  </th>

                  <th
                    className="p-1 sm-p2 cursor-pointer text-center"
                    onClick={() => handleSort("year")}
                  >
                    Year {sortKey === "year" && (sortAsc ? "▲" : "▼")}
                  </th>

                  <th
                    className="p-1 sm-p2 cursor-pointer text-center"
                    onClick={() => handleSort("vendor")}
                  >
                    Vendor {sortKey === "vendor" && (sortAsc ? "▲" : "▼")}
                  </th>

                  <th
                    className="p-1 sm-p2 cursor-pointer text-center"
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
                    {/* Column 1: button (optional) */}
                    <td className="w-12 sm-w-16 p-1 sm-p-2 text-center">
                      {currentUser && currentUser._id === user._id && (
                        <UncollectButton
                          tea={tea}
                          text="X"
                          onRemoved={(teaId) =>
                            setTeas((prev) =>
                              prev.filter((t) => t._id !== teaId)
                            )
                          }
                        />
                      )}
                    </td>

                    {/* Column 2: image + tea name */}
                    <td className="p-1 sm-p-2 min-w-0">
                      <div className="flex items-center gap-1 sm-gap-2 min-w-0 w-full">
                        <img
                          src={
                            tea.image?.url ||
                            "https://cdn-icons-png.flaticon.com/256/712/712255.png"
                          }
                          alt={tea.name}
                          className="h-5 w-5 sm-h-6 sm-w-6 rounded object-cover shrink-0"
                        />

                        <Link
                          href={`/tea/${tea._id}`}
                          className="text-green-accent hover:underline truncate min-w-0 block max-w-[140px] sm:max-w-none"
                        >
                          {tea.name}
                        </Link>
                      </div>
                    </td>

                    {/* Year */}
                    <td className="p-1 sm-p-2 text-center">
                      {tea.year || "-"}
                    </td>

                    {/* Vendor */}
                    <td className="p-1 sm-p-2 text-center truncate min-w-0">
                      {tea.vendor?.name || "-"}
                    </td>

                    {/* Producer */}
                    <td className="p-1 sm-p-2 text-center truncate min-w-0">
                      {tea.producer?.name || "-"}
                    </td>
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
