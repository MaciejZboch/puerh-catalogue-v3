"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, user } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (user) {
    console.log(user);
    return <div>Welcome {user.username}!</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password); // updates global state
    } catch {
      alert("Login failed!");
    } finally {
      setLoading(false);
      router.back()
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-charcoal shadow rounded-xl text-light border-b border-green-accent"
      >
        <h1 className="text-2xl font-semibold mb-4">Login</h1>

        <input
          className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />

        <input
          className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <button
          className="w-full bg-green-accent text-dark py-2 rounded-md hover:bg-green-soft transition"
          type="submit"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
