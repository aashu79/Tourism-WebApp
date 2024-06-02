import express from "express";
import {
  getPackages,
  getSinglePackage,
} from "../controllers/package.controllers";
import checkAdmin from "../middleware/checkAdmin.middleware";
import multer from "multer";
import { body } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.get("/", getPackages);
router.get("/:id", checkAdmin, getSinglePackage);
router.post("/", [
  checkAdmin,
  upload.array("image", 4),
  body("packageName")
    .notEmpty()
    .withMessage("Package name is required.")
    .isString()
    .withMessage("Please enter a valid pacakage name"),
  body("serviceType")
    .notEmpty()
    .withMessage("Servcie type is required.")
    .isString()
    .withMessage("Please enter a valid service type"),
  body("pricePerPerson")
    .notEmpty()
    .withMessage("Price per person is required.")
    .isNumeric()
    .withMessage("Please enter a valid price"),
  body("duration")
    .notEmpty()
    .withMessage("Duration is required.")
    .isNumeric()
    .withMessage("Please enter a valid duration."),
]);
