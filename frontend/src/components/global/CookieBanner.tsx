"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed z-999 w-full bottom-0 left-1/2 -translate-x-1/2 justify-center
     bg-charcoal text-light
     p-2 flex items-center gap-4"
    >
      <span>
        We use cookies to ensure the website works properly and to keep you
        logged in.{" "}
        <span className="text-xs">
          By clicking “Accept”, you consent to the use of cookies. Learn more in
          our{" "}
          <Link className="text-green-accent" href="/privacy">
            Privacy Policy
          </Link>
          .
        </span>
      </span>
      <button
        className="bg-green-accent/50 rounded-2xl px-4 py-1 shrink-0"
        onClick={() => {
          localStorage.setItem("cookie-consent", "accepted");
          setVisible(false);
        }}
      >
        Accept
      </button>
    </div>
  );
}
