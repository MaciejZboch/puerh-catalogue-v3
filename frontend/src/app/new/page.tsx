import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api";
import New from "@/components/new/New";

export default async function NewTeaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/?login=1");

  return <New />;
}
