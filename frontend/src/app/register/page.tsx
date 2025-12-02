"use client";
import { useState } from "react";
import { postJson } from "@/lib/http";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
  //login and navigation
  const {login} = useAuth();
  const router = useRouter();

  //state
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const data = await postJson("api/register", { email, username, password });
      setMessage("Registered successfully!");
      await login(username, password);
      router.push(`/`);
    } catch (err: any) {
      setMessage(err.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-124px)] items-center justify-center bg-dark">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-charcoal shadow rounded-xl text-light border-b border-green-accent ">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>

        <input className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />

        <input className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
          type="text" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)} required />

        <input className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />

        <button className="w-full bg-green-accent text-dark py-2 rounded-md"
          type="submit">Register</button>

        {message && <p className="mt-3 text-sm text-center text-light">{message}</p>}
      </form>
    </div>
  );
}