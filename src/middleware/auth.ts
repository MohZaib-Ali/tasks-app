import jwt from "jsonwebtoken";
import UserModel from "../db/models/User";
import { NextFunction, Response } from "express";

const auth = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.header("Authorization")) {
      throw new Error("No Authorization Token Provided.")
    }
    const token = req.header("Authorization").replace("Bearer", "").trim();
    const { _id, exp } = jwt.verify(token, process.env.SECRET_KEY) as any;
    if (Date.now() >= exp * 1000) {
      throw new Error("Token expired");
    }
    const user = await UserModel.findOne({ token });
    if (!user) {
      throw new Error("Not a valid token.");
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    if (err.message.includes('jwt')) {
      err.message = 'Not a valid token';
    }
    res.status(401).send({ error: "Not Authorized - " + err });
  }
};

export default auth;
