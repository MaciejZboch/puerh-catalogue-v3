"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../app/hooks/useAuth";
import { NavbarLoader } from "../animations/NavbarLoader";
import Image from "next/image";
import LoginButton from "../buttons/LoginButton";
import RegisterButton from "../buttons/RegisterButton";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="z-50 relative flex items-center justify-between p-4 bg-charcoal overflow-y-visible">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-1 font-bold text-light">
        <Image
          alt="Pu-erh Catalogue Logo"
          src="/images/puerh-orange.png"
          height={50}
          width={50}
          className="h-auto w-auto"
        />
        The Pu-Erh Catalogue
      </Link>

      {/* Desktop search */}
      <SearchBar className="hidden md:inline relative md:w-1xl lg:w-full max-w-sm border-1 border-green-accent rounded-md" />

      {/* Desktop links */}
      <div className="hidden md:flex gap-4 text-light min-w-[238px] justify-end items-center">
        {loading ? (
          <NavbarLoader />
        ) : !user ? (
          <>
            <LoginButton className="nohover hover:text-green-soft" />
            <RegisterButton
              className="nohover hover:text-green-soft"
              text="Register"
            />
          </>
        ) : (
          <>
            <Link href="/new">New tea</Link>
            <Link href={`/profile/${user._id}`}>My Profile</Link>
            <a className="rounded-md cursor-pointer" onClick={logout}>
              Logout
            </a>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <a
        className="md:hidden text-light"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </a>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="absolute top-full left-0 w-screen bg-charcoal flex flex-col gap-2 p-4
        md:hidden text-light shadow-md z-50 overflow-x-hidden overflow-y-visible"
        >
          <div className="px-4">
            <SearchBar
              setMenuOpen={setMenuOpen}
              className="right-2 relative overflow-y-visible w-full rounded-md border-1 border-green-accent text-light"
            />
          </div>
          {/* Mobile links */}
          {loading ? (
            <NavbarLoader />
          ) : !user ? (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          ) : (
            <>
              <Link href="/new" onClick={() => setMenuOpen(false)}>
                New tea
              </Link>
              <Link
                href={`/profile/${user._id}`}
                onClick={() => setMenuOpen(false)}
              >
                My Profile
              </Link>
              <a
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
