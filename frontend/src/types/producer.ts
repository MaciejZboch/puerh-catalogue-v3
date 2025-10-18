export interface IProducer {
  _id: string;
  name: string;
  status?: "pending" | "approved" | "rejected";
}