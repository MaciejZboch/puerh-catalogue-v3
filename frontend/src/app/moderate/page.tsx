import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api";
import Moderate from "@/components/moderate/Moderate";

export default async function NewTeaPage() {
  const user = await getCurrentUser();
  if (!user || user.moderator !== true) redirect("/?login=1");

  return <Moderate />;
}
