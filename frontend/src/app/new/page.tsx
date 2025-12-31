import { redirect } from "next/navigation";
import { getCurrentUserForServerComponents } from "@/lib/auth.server";
import New from "@/components/new/New";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function NewTeaPage() {
  const user = await getCurrentUserForServerComponents();
  if (!user) redirect("/");

  return <New />;
}
