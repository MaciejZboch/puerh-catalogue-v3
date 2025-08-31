"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login, user } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  

  if (user) {
    return <div>Welcome {user.username}! 🎉</div>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(username, password);
    } catch {
      alert("Login failed!");
    }
  }

    return (
    <div className="flex min-h-screen items-center justify-center bg-dark">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-charcoal shadow rounded-xl text-light border-b border-green-accent">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>

        <input className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
          type="text" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)} required />

        <input className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />

        <button className="w-full bg-green-accent text-dark py-2 rounded-md hover:bg-green-soft transition"
          type="submit">Register</button>
      </form>
    </div>
  );
}