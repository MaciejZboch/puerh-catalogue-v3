export async function login(username: string, password: string) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // send cookies
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function logout() {
  await fetch("/api/logout", {
    method: "GET",
    credentials: "include",
  });
}

export async function getCurrentUser() {
  const res = await fetch("/api/me", { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
}