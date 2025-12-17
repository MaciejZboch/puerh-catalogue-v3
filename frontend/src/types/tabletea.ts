export default interface ITableTea {
  _id: string;
  name: string;
  year?: number;
  vendor?: { name: string };
  producer?: { name: string };
  type?: string;
  image?: { url: string };
}
