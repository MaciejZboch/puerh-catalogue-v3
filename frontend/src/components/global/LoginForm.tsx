"use client";

import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";

type RegisterFormProps = {
  onSuccess?: () => void;
};

export default function LoginForm({ onSuccess }: RegisterFormProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  //validations
  const MIN_LENGTH = 6;
  const MAX_LENGTH = 30;

  const handleSubmit = async (e: React.FormEvent) => {
    let isInvalid = false;
    function checkLengthValidity(x: string) {
      if (x.length < MIN_LENGTH) {
        setMessage(
          `Username and password must be at least ${MIN_LENGTH} characters.`,
        );
        isInvalid = true;
      } else if (x.length > MAX_LENGTH) {
        setMessage(
          `Username and password can't be longer than ${MIN_LENGTH} characters.`,
        );
        isInvalid = true;
      }
    }
    if (isInvalid) {
      return;
    }
    e.preventDefault();
    checkLengthValidity(password);
    checkLengthValidity(username);
    setLoading(true);
    try {
      await login(username, password); // updates global state
    } catch (err) {
      console.log(err);
      !isInvalid && setMessage("Login failed - check username and password.");
      isInvalid = true;
    } finally {
      setLoading(false);
      //close pop-up if login successful
      !isInvalid && onSuccess?.();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md p-4 sm:p-6 bg-charcoal shadow rounded-xl text-light border-b border-green-accent"
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
        className="w-full bg-green-accent text-dark py-2 rounded-md"
        type="submit"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {message && (
        <p className="mt-3 text-sm text-center text-light">{message}</p>
      )}
    </form>
  );
}
