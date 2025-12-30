import { redirect } from "next/navigation";
import { getCurrentUserForServerComponents } from "@/lib/serverSideAuth";
import New from "@/components/new/New";

export default async function NewTeaPage() {
  const user = await getCurrentUserForServerComponents();
  if (!user) redirect("/?login=1");

  return <New />;
}
