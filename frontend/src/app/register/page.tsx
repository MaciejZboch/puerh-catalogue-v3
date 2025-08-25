"use client";
import { useState } from "react";
import { postJson } from "@/lib/http";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const data = await postJson("/api/register", { email, username, password });
      setMessage("🎉 Registered successfully!");
    } catch (err: any) {
      setMessage(err.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white shadow rounded-xl">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>

        <input className="w-full mb-3 p-2 border rounded-md"
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />

        <input className="w-full mb-3 p-2 border rounded-md"
          type="text" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)} required />

        <input className="w-full mb-3 p-2 border rounded-md"
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />

        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          type="submit">Register</button>

        {message && <p className="mt-3 text-sm text-center text-gray-700">{message}</p>}
      </form>
    </div>
  );
}