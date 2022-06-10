import { NextFunction, Request, Response } from "express";

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).send({ error: error.message });
};

export default errorHandler;
