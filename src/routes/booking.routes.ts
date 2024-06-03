import express from "express";
import { body } from "express-validator";
import multer from "multer";
import authenticator from "../middleware/authenticator.middleware";
import {
  createBooking,
  deleteBooking,
  getBookings,
  getSingleBooking,
  updateBooking,
} from "../controllers/booking.controllers";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.get("/", authenticator, getBookings);
router.get("/:id", authenticator, getSingleBooking);
router.post(
  "/",
  [
    authenticator,
    body("packageId")
      .notEmpty()
      .withMessage("Pacakage id is required")
      .isString()
      .withMessage("Please enter valid package id"),
    body("numberOfPerson")
      .notEmpty()
      .withMessage("Number of person is required")
      .isNumeric()
      .withMessage("Please enter valid number of perosn"),
    body("totalPrice")
      .notEmpty()
      .withMessage("Total price is required")
      .isNumeric()
      .withMessage("Please enter valid total price."),
  ],
  createBooking
);
router.put(
  "/:id",
  [
    authenticator,
    body("packageId")
      .notEmpty()
      .withMessage("Pacakage id is required")
      .isString()
      .withMessage("Please enter valid package id"),
    body("numberOfPerson")
      .notEmpty()
      .withMessage("Number of person is required")
      .isNumeric()
      .withMessage("Please enter valid number of perosn"),
    body("totalPrice")
      .notEmpty()
      .withMessage("Total price is required")
      .isNumeric()
      .withMessage("Please enter valid total price."),
  ],
  updateBooking
);

router.delete("/:id", authenticator, deleteBooking);

export default router;
