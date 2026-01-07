import NewVendorClient from "@/components/newVendor/NewVendorClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New vendor",
  description: "Add a new tea vendor or seller",
};

export default function NewVendorPage() {
  return <NewVendorClient />;
}
