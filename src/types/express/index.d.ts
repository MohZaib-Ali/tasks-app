import { UserDocument } from "../../db/models/User";
import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      token?: string; 
    }
  }
}