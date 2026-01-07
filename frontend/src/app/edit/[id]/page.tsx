import EditTeaClient from "@/components/new/NewTeaClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit tea",
  description: "Change tea details, add more information or new images",
};

export default function NewTeaPage() {
  return <EditTeaClient />;
}
