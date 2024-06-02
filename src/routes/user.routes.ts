import express from "express";
const router = express.Router();
import {
  getUser,
  register,
  login,
  verifyUser,
  refreshToken,
} from "../controllers/user.controllers";
import multer from "multer";
import { body } from "express-validator";
import authenticator from "../middleware/authenticator.middleware";

//Multer config
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.get("/get-user", authenticator, getUser);
router.get("/verify-account/:token", verifyUser);
router.get("/refresh-token/:token", refreshToken);
router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please Enter valid email address"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password should be atleast 8 characters"),
  ],
  login
);
router.post(
  "/register",
  [
    upload.single("profilePicture"),
    body("email")
      .isEmail()
      .withMessage("Please Enter valid email address")
      .notEmpty()
      .withMessage("Please enter email."),
    body("firstName").notEmpty().withMessage("Please enter first name"),
    body("lastName").notEmpty().withMessage("Please enter last name"),
    body("password")
      .notEmpty()
      .withMessage("Please enter password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  register
);

export default router;
