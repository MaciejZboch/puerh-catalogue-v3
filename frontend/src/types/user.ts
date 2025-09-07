export interface IUser {
  _id: string;
  username: string;
  email: string;
  moderator?: boolean;
  image?: {
    url: string;
    filename: string;
  };
  following: string[];
}