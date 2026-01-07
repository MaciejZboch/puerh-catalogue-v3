import NewTeaClient from "@/components/new/NewTeaClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New tea",
  description: "Add a new tea, specify details, add images",
};

export default function NewTeaPage() {
  return <NewTeaClient />;
}
