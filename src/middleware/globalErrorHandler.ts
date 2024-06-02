import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

interface customeMessage {
  msg: string;
}

const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.name === "ValidationError") {
    let err: string[] = [];
    const k = Object.keys((error as any).errors);

    k.forEach((key) => {
      err.push((error as any).errors[key].message as string);
    });
    res.status(500).json({ sucess: false, error: err });
    console.error(error);
  } else {
    const code = (error as any).statusCode || 500;
    const message = error.message || "Internal Server Error..";
    res.status(code).json({ sucess: false, msg: message });
    console.error(error);
  }
};

export default globalErrorHandler;
