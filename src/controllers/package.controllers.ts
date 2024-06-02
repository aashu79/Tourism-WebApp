import cloudinary from "cloudinary";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Package, { PackageType } from "../models/package.model";
import { customRequest } from "../middleware/authenticator.middleware";
import { validationResult } from "express-validator";

// get all packages
const getPackages = expressAsyncHandler(async (req: Request, res: Response) => {
  // const userId = (req as any).userId;
  const packages = await Package.find();
  if (packages.length) {
    res
      .status(200)
      .json({ success: true, message: "Packages found..", data: packages });
  }
  if (!packages.length) {
    res.status(400).json({ success: true, message: "Packages not found.." });
  }
});

////get a single package...
const getSinglePackage = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const packages = await Package.findOne({ _id: id });
    if (packages?.packageName) {
      res
        .status(200)
        .json({ success: true, message: "Package found", data: packages });
    }
    if (!packages?.packageName) {
      res.status(400).json({ success: false, message: "Package not found" });
    }
  }
);

//create a new package
const createPackage = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map((err) => err.msg);
      res.status(400).json({ success: false, message: messages });
      return;
    }
    const thumbnail = uploadImage(req.files as Express.Multer.File[]);
    const newPackage: PackageType = req.body;
    newPackage.createdBy = (req as customRequest).id as any;
    newPackage.images = thumbnail as any;

    const packages = await Package.create(newPackage);
    res.status(200).json({
      success: true,
      message: "Package created successfully...",
      data: packages,
    });
  }
);

///update a package

const updatePackage = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map((err) => err.msg);
      res.status(400).json({ success: false, message: messages });
      return;
    }
    const { packageId } = req.params;
    const updatedPackage: PackageType = req.body;
    console.log(req.body);
    const imageFiles = req.files as Express.Multer.File[];
    if (imageFiles.length > 0) {
      const imageUrl = await uploadImage(imageFiles);
      updatedPackage.images = imageUrl as string[];
    }

    const newPackage = await Package.findOneAndUpdate(
      { _id: packageId },
      updatedPackage,
      { new: true, runValidators: true }
    );
    if (newPackage) {
      res.status(200).json({
        success: true,
        message: "Package was updated..",
        data: newPackage,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Couldn't update package" });
    }
  }
);

//Delete Package

const deletePackage = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await Package.findByIdAndDelete({ _id: id });
    if (response) {
      res
        .status(200)
        .json({ success: true, message: "Packages deleted successfully" });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Error deleting package!!" });
    }
  }
);

export {
  createPackage,
  getPackages,
  getSinglePackage,
  updatePackage,
  deletePackage,
};

async function uploadImage(imageFiles: Express.Multer.File[]) {
  const imagePromises = imageFiles?.map(async (file) => {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataUri = "data:" + file.mimetype + ";" + "base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataUri);
    return res.url;
  });

  const imageUrl = await Promise.all(imagePromises);
  return imageUrl;
}
