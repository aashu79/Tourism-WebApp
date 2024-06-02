import express from "express";
import { body } from "express-validator";
import multer from "multer";
import checkAdmin from "../middleware/checkAdmin.middleware";
import {
  createService,
  deleteService,
  getServices,
  getSingleService,
  updateService,
} from "../controllers/service.controllers";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.get("/", getServices);
router.get("/:id", checkAdmin, getSingleService);
router.post(
  "/",
  [
    checkAdmin,
    upload.single("image"),
    body("serviceName")
      .notEmpty()
      .withMessage("Servcie name is required")
      .isString()
      .withMessage("Please enter valid service name"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isString()
      .withMessage("Please enter valid description"),
  ],
  createService
);
router.put(
  "/:id",
  [
    checkAdmin,
    upload.single("image"),
    body("serviceName")
      .notEmpty()
      .withMessage("Servcie name is required")
      .isString()
      .withMessage("Please enter valid service name"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isString()
      .withMessage("Please enter valid description"),
  ],
  updateService
);

router.delete("/:id", checkAdmin, deleteService);

export default router;
