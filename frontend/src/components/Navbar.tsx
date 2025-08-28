"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getCurrentUser } from "@/lib/api";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState<any>(null); // TODO: replace with real auth state
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("http://localhost:4000/logout", {
      method: "GET",
      credentials: "include",
    });
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="flex justify-between p-4 bg-gray-100">
      <Link href="/" className="font-bold text-lg">The Pu-Erh Catalogue</Link>
      <div className="flex gap-4">
        {!user ? (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        ) : (
          <>
            <Link href="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
