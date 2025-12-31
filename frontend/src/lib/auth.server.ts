import { cookies } from "next/headers";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getCurrentUserForServerComponents() {
  const cookieStore = await cookies();

  const res = await fetch(`${API_URL}/api/me`, {
    headers: {
      cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}
