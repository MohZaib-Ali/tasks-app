import jwt from "jsonwebtoken";
import UserModel from "../db/models/User";
import { NextFunction, Response } from "express";

const auth = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization").replace("Bearer", "").trim();
    const { _id, exp } = jwt.verify(token, process.env.SECRET_KEY) as any;
    if (Date.now() >= exp * 1000) {
      throw new Error("Token expired");
    }
    const user = await UserModel.findOne({ _id });
    if (!user) {
      throw new Error("User does not exist.");
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send({ error: "Not Authorized" });
  }
};

export default auth;
