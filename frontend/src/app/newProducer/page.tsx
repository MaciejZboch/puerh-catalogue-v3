import NewProducerClient from "@/components/newProducer/NewProducerClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New producer",
  description: "Add a new pu-erh producer or tea factory",
};

export default function NewProducerPage() {
  return <NewProducerClient />;
}
