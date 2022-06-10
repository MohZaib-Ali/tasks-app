export {};

import { UserDocument } from "../db/models/User";

declare global {
  namespace Express {
    interface Request {
      user: UserDocument;
    }
  }
}
