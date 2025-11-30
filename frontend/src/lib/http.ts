export async function postJson(path: string, body: any) {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${API_URL}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || res.statusText);
    return data;
  } else {
    const text = await res.text();
    throw new Error(`Expected JSON, got: ${text.slice(0, 200)}…`);
  }
}
