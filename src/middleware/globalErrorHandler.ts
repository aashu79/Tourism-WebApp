import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);
  if (error instanceof mongoose.Error.ValidationError) {
    const err = (error as any).errors;
    const keys = Object.keys(err);
    const errorMessage = keys.map((key) => {
      return err[key].message;
    });
    res.sendStatus(500).json({ success: false, message: errorMessage });
  } else {
    res.sendStatus(500).json({ success: false, message: error.message });
  }
};

export default globalErrorHandler;
