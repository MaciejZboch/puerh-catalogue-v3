"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../app/hooks/useAuth";

import { getCurrentUser, logout } from "@/lib/api";

export default function Navbar() {
 const { user, logout, loading } = useAuth();

  return (
    <nav className="flex justify-between p-4 bg-charcoal">
      <Link href="/" className="font-bold text-light">
        The Pu-Erh Catalogue
      </Link>

      <div className="flex gap-4 text-light">
        {loading ? (
          // optional loading state for auth
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
  );
}
