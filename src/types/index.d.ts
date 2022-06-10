export {};

import { UserDocument } from "../db/models/User";

declare namespace Express {
  export interface Request {
      user?: UserDocument;
      token?: string;
  }
  export interface Response {
      user?: UserDocument;
      token?: string;
  }
}