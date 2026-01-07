"use client";
import { useState } from "react";
import { postJson } from "@/lib/http";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

type RegisterFormProps = {
  onSuccess?: () => void;
};

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  //login and navigation
  const { login } = useAuth();
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
      await postJson("api/register", {
        email,
        username,
        password,
      });
      setMessage("Registered successfully!");
      await login(username, password);

      //close pop-up modal
      onSuccess?.();

      router.push(`/`);
    } catch (err: any) {
      setMessage(err.message || "Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md p-6 bg-charcoal shadow rounded-xl text-light border-b border-green-accent "
    >
      <h1 className="text-2xl font-semibold mb-4">Register</h1>

      {/*<div className="relative max-w-[340p] aspect-video mb-4">
        <Image
          src="/images/teapot_rectangular.png"
          alt="Pu-erh Illustration"
          fill
          className="drop-shadow-2xl rounded-2xl object-cover"
        />
      </div>*/}
      <input
        className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className="flex gap-5">
        <input
          className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        className="w-full bg-green-accent text-dark py-2 rounded-md"
        type="submit"
      >
        Register
      </button>

      {message && (
        <p className="mt-3 text-sm text-center text-light">{message}</p>
      )}
    </form>
  );
}
