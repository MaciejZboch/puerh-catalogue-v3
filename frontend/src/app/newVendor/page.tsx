import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api";
import NewVendor from "@/components/newVendor/NewVendor";

export default async function NewTeaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/?login=1");

  return <NewVendor />;
}
