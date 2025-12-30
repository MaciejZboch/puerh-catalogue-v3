import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api";
import NewProducer from "@/components/newProducer/NewProducer";

export default async function NewTeaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/?login=1");

  return <NewProducer />;
}
