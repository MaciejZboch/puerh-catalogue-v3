import { ITea } from "./tea";

export interface IReview {
  _id: string; //Mongo id
  body: string;
  rating: number;
  author: string; //Mongo id
  tea: string; //Mongo id
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPopulatedReview extends Omit<IReview, "author" | "tea"> {
  author: {
    _id: string;
    username: string;
  };
  tea: ITea;
}
