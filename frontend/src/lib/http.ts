export async function postJson(path: string, body: any) {
  const res = await fetch(path, {
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
    // surface a helpful snippet
    throw new Error(`Expected JSON, got: ${text.slice(0, 200)}…`);
  }
}
