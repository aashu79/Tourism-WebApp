import express from "express";
import { body } from "express-validator";
import multer from "multer";

import authenticator from "../middleware/authenticator.middleware";
import {
  createTestimonial,
  deleteTestimonial,
  getSingleTestimonial,
  getTestimonials,
  updateTestimonial,
} from "../controllers/testimonial.controllers";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.get("/", getTestimonials);
router.get("/:id", authenticator, getSingleTestimonial);
router.post(
  "/",
  [
    authenticator,
    body("message")
      .notEmpty()
      .withMessage("Message is required")
      .isString()
      .withMessage("Please enter message"),
    body("rating")
      .notEmpty()
      .withMessage("rating is required")
      .isNumeric()
      .withMessage("Please enter valid rating"),
  ],
  createTestimonial
);
router.put(
  "/:id",
  [
    authenticator,
    upload.single("image"),
    body("message")
      .notEmpty()
      .withMessage("Message is required")
      .isString()
      .withMessage("Please enter message"),
    body("rating")
      .notEmpty()
      .withMessage("rating is required")
      .isNumeric()
      .withMessage("Please enter valid rating"),
  ],
  updateTestimonial
);

router.delete("/:id", authenticator, deleteTestimonial);

export default router;
