const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // send cookies
    body: JSON.stringify({ username, password }),
  });
    if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Login failed: ${res.status} ${errorText}`);
  }
  return res.json();
}

export async function logout() {
  await fetch(`${API_URL}/api/logout`, {
    method: "GET",
    credentials: "include",
  });
}

export async function getCurrentUser() {
  const res = await fetch("http://localhost:4000/api/me", { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
}

export async function getIndex() {
  const res = await fetch(`${API_URL}/api/`);
  if (!res.ok) throw new Error("Failed to fetch teas");
  return res.json();
}