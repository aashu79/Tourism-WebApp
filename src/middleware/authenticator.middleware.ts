import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyAccessToken } from "../utils/tokenGenerator";
import User from "../models/user.model";

export interface customRequest extends Request {
  id?: string;
}

const authenticator = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.AccessToken;
  console.log(token);

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "You are not authorized." });
    return;
  }
  try {
    const payload = verifyAccessToken(token as string) as JwtPayload;

    if (!payload) {
      res
        .status(401)
        .json({ success: false, message: "You are not authorized" });
      return;
    }
    const user = await User.findOne({ _id: payload._id });
    if (!user?._id) {
      res
        .status(401)
        .json({ success: false, message: "You are not authorized" });
      return;
    }
    req.id = user?._id.toString();
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "You are not authorized" });
  }
};

export default authenticator;
