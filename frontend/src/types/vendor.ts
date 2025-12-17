export interface IVendor {
  _id: string;
  name: string;
  status?: "pending" | "approved" | "rejected";
}
