export interface ITea {
  _id: string; // MongoDB id
  name: string;
  description: string;
  images: IImage[];
  type: "Raw / Sheng" | "Ripe / Shu" | "blend";
  year: number;
  region: string;
  village: string;
  ageing_location: string;
  ageing_conditions:
    | "Dry"
    | "Natural"
    | "Wet"
    | "Hong-Kong Traditional"
    | "Unknown";
  shape:
    | "Loose"
    | "Cake"
    | "Tuo"
    | "Brick"
    | "Mushroom"
    | "Dragon ball"
    | "Tube"
    | "Melon"
    | "Other";
  producer: any;
  vendor: any;
  author: string;
  owners: string[];
  sizeInGrams: number;
  price: number;
  createdAt?: string; // serialized date
  updatedAt?: string;
  pricePerGram?: number;
}

export interface IImage {
  url: string;
  alt?: string;
}
