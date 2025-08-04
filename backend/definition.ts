import { Request, Response } from "express";
import { UserModel } from "./models/definitions";
import { Session } from "express-session";
import { LogOutOptions } from "passport";

export type RequestWithLocalVariables = Request & {
  session: Session & { discoverToken: string };
  user?: UserModel;
  // flash: (isSuccess?: "success" | "error", msg?: string) => string | void
  login: (registeredUser: { user: string; password: string }, cb: any) => any;
  logout: {
    (option: LogOutOptions, done: (err: any) => void): void;
    (done: (err: any) => void): void;
  };
  // isAuthenticated: () => any;
};