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
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}