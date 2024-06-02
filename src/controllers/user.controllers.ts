import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import User, { UserType } from "../models/user.model";

import { JwtPayload } from "jsonwebtoken";
import sendMail from "../utils/emailSender";
import {
  generateAccessToken,
  generateActivateToken,
  generateRefreshToken,
  verifyActivateToken,
  verifyRefreshToken,
} from "../utils/tokenGenerator";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import imageUpload from "../utils/imageUploader";
import { customRequest } from "../middleware/authenticator.middleware";

//-------------------------Register------------------------------------------------

const register = expressAsyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    res.status(400).json({ success: false, message: messages });
    return;
  }
  const userData: UserType = req.body;

  const profileImage = await imageUpload(req.file as Express.Multer.File);

  userData.profilePicture = profileImage;
  const response = await User.create(userData);
  if (response) {
    const token = generateActivateToken(response._id as any);
    const message = "http://localhost:3000/api/v1/auth/verify-account/" + token;
    const mailOpstions = {
      from: "aashusah435@gmail.com",
      to: userData.email,
      subject: "Account Verification",
      text: message,
    };
    const emailResponse = await sendMail(mailOpstions);
    res.status(200).json({
      success: true,
      message: "Email has been sent! Please verify your account",
    });
  }
});

//--------------------------Get logged in user-----------------------------
const getUser = expressAsyncHandler(
  async (req: customRequest, res: Response) => {
    const id = req.id;
    if (!id) {
      throw new Error("Something went wrong");
    }
    const user = await User.findById({ _id: id });
    if (user) {
      res.status(200).json({
        success: true,
        message: "User found",
        data: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
        },
      });
    }
  }
);

//-------------------Login-----------------------------------

const login = expressAsyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    res.status(400).json({ success: false, message: messages });
    return;
  }

  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(401)
      .json({ success: false, message: "Email or Password is missing" });
    return;
  }
  const user = await User.findOne({ email: email, isActive: true });

  if (!user?._id) {
    res
      .status(404)
      .json({ success: false, message: "Invalid email or password" });
    return;
  }
  const isCorrect = await bcrypt.compare(password, user?.password as string);
  if (!isCorrect) {
    res
      .status(404)
      .json({ success: false, message: "Invalid email or password" });
    return;
  }
  const accessToken = generateAccessToken(user?._id as any);
  const refreshToken = generateRefreshToken(user?._id as any);
  const time = 259200;
  res.cookie("AccessToken", accessToken, { maxAge: time });
  res.cookie("RefreshToekn", refreshToken, { maxAge: time });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      profilePicture: user?.profilePicture,
    },
  });
});

//-----------------------------------activate user-----------------------------------------------

const verifyUser = expressAsyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or missing token" });
    return;
  }
  const result = verifyActivateToken(token) as JwtPayload;
  if (result._id) {
    const response = await User.findOneAndUpdate(
      { _id: result._id },
      { isActive: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Account has been activated successfully",
    });
  }
});

//----------------------------------Refresh Token-----------------------------

const refreshToken = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;

    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "Invalid or missing token" });
      return;
    }
    const payload = verifyRefreshToken(token as any) as JwtPayload;
    if (!payload) {
      res
        .status(401)
        .json({ success: false, message: "Invalid or missing token" });
      return;
    }
    const accessToken = generateAccessToken(payload?._id);
    res.status(200).json({
      success: true,
      message: "Token refreshed",
      AccessToken: accessToken,
    });
  }
);

export { register, verifyUser, login, getUser, refreshToken };
