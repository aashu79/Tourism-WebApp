import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyAccessToken } from "../utils/tokenGenerator";
import User from "../models/user.model";

export interface customRequest extends Request {
  id?: string;
}

const checkAdmin = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.AccessToken;

  if (!token) {
    res.status(401).json({ success: false, message: "You are not authorized" });
  }
  try {
    const payload = verifyAccessToken(token as string) as JwtPayload;

    if (!payload) {
      res
        .status(401)
        .json({ success: false, message: "You are not authorized" });
    }
    const user = await User.findOne({ _id: payload._id });
    if (user?.userType != "admin") {
      res
        .status(401)
        .json({ success: false, message: "You are not authorized" });
    }
    req.id = user?._id.toString();
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "You are not authorized" });
  }
};

export default checkAdmin;
