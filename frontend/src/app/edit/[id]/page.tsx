import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api";
import Edit from "@/components/edit/Edit";

export default async function NewTeaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/?login=1");

  return <Edit />;
}
