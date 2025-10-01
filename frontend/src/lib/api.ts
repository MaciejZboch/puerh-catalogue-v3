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
  if (!res.ok) {throw new Error("Failed to fetch teas!");}
  return res.json();
}


export async function removeFromCollection(teaId: string) {
  const res = await fetch(`http://localhost:4000/api/teas/${teaId}/remove`, { method: "DELETE", credentials: "include"});
  if (!res.ok) {throw new Error("Failed to collect!");}
  return res.json();
}

export async function getNewTeaForm() {
  const res = await fetch(`http://localhost:4000/api/teas/new`, { method: "GET", credentials: "include"});
  if (!res.ok) {throw new Error("Failed to get form!");}
  return res.json();
}

export async function getTea(teaId: string) {
  const res = await fetch(`http://localhost:4000/api/teas/${teaId}`, { method: "GET", credentials: "include"});
  if (!res.ok) {throw new Error("No tea with that id!");}
  return res.json();
}

export async function deleteReview(reviewId: string) {
const res = await fetch(`http://localhost:4000/api/teas/review/${reviewId}`, { method: "DELETE", credentials: "include"});
    if (!res.ok) {throw new Error("No review with that id!");}
    return res.json();
}

export async function deleteTea(teaId: string) {
const res = await fetch(`http://localhost:4000/api/teas/${teaId}`, { method: "DELETE", credentials: "include"});
    if (!res.ok) {throw new Error("No tea with that id!");}
    return res.json();
}