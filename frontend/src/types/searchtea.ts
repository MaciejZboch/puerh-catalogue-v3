export default interface ISearchTea {
  _id: string;
  name: string;
  year?: number;
  vendor?: { name: string };
  producer?: { name: string };
  type?: string;
  image?: { url: string };
  owners?: string[];
}