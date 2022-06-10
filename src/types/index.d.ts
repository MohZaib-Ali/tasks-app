export {};

import { UserDocument } from "../db/models/User";

declare namespace Express {
  export interface Request {
      user: UserDocument;
  }
  export interface Response {
      user: UserDocument;
  }
}