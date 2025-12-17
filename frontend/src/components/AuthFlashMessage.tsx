"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";

export default function AuthNotice() {
  const { user } = useAuth();
  const prevUserRef = useRef<typeof user>(undefined);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Login detected
    if (!prevUserRef.current && user) {
      setMessage(`Welcome back, ${user.username}! 🍵`);
    }

    // Logout detected
    if (prevUserRef.current && !user) {
      setMessage("You have been logged out 👋");
    }

    prevUserRef.current = user;
  }, [user]);

  // Auto-hide message
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;
  const isLogout = message.includes("logged out");

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`px-4 py-2 rounded-lg shadow-lg
        transition-opacity duration-300
        ${message ? "opacity-100" : "opacity-0"}
        ${isLogout ? "bg-charcoal text-light" : "bg-green-accent text-dark"}
        `}
      >
        {message}
      </div>
    </div>
  );
}
