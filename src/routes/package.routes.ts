import express from "express";
import {
  createPackage,
  deletePackage,
  getPackages,
  getSinglePackage,
  updatePackage,
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
router.post(
  "/",
  [
    checkAdmin,
    upload.array("images", 4),
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
    body("location")
      .notEmpty()
      .withMessage("Location is required")
      .isString()
      .withMessage("Please enter a valid location"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isString()
      .withMessage("Please enter valid description."),
  ],
  createPackage
);

router.put(
  "/:id",
  [
    checkAdmin,
    upload.array("images", 4),
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
    body("location")
      .notEmpty()
      .withMessage("Location is required")
      .isString()
      .withMessage("Please enter a valid location"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isString()
      .withMessage("Please enter valid description."),
  ],
  updatePackage
);

router.delete("/:id", checkAdmin, deletePackage);

export default router;
