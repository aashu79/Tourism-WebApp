import { Request, Response, query } from "express";
import Service, { ServiceType } from "../models/service.model";
import { customRequest } from "../middleware/authenticator.middleware";
import imageUpload from "../utils/imageUploader";
import { validationResult } from "express-validator";
import asyncErrorHandler from "../middleware/asyncErrorHandler.middleware";

// get all services
const getServices = asyncErrorHandler(async (req: Request, res: Response) => {
  // const userId = (req as any).userId;
  const services = await Service.find();
  if (services.length) {
    res
      .status(200)
      .json({ success: true, message: "Services found..", data: services });
  }
  if (!services.length) {
    res.status(400).json({ success: true, message: "Services not found.." });
  }
});

////get a single service...
const getSingleService = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const service = await Service.findOne({ _id: id });
    if (service?.serviceName) {
      res
        .status(200)
        .json({ success: true, message: "Service found", data: service });
    }
    if (!service?.serviceName) {
      res.status(400).json({ success: false, message: "Service not found" });
    }
  }
);

//create a new service
const createService = asyncErrorHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    res.status(400).json({ success: false, message: messages });
    return;
  }
  const thumbnail = imageUpload(req.file as Express.Multer.File);
  const newService: ServiceType = req.body;

  newService.createdBy = (req as customRequest).id as any;

  newService.thumbnail = await Promise.resolve(thumbnail);

  const service = await Service.create(newService);
  res.status(200).json({
    success: true,
    message: "Service created successfully...",
    data: service,
  });
});

///update a service

const updateService = asyncErrorHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    res.status(400).json({ success: false, message: messages });
    return;
  }
  const { id } = req.params;
  const updatedService: ServiceType = req.body;
  console.log(req.body);
  const imageFile = req.file as Express.Multer.File;
  if (imageFile) {
    const imageUrl = await imageUpload(imageFile);
    updatedService.thumbnail = imageUrl as string;
  }

  const newService = await Service.findOneAndUpdate(
    { _id: id },
    updatedService,
    { new: true, runValidators: true }
  );
  if (newService) {
    res.status(200).json({
      success: true,
      message: "Service was updated..",
      data: newService,
    });
  } else {
    res
      .status(500)
      .json({ success: false, message: "Couldn't update service" });
  }
});

//Delete Service

const deleteService = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await Service.findByIdAndDelete({ _id: id });
  if (response) {
    res
      .status(200)
      .json({ success: true, message: "Services deleted successfully" });
  } else {
    res
      .status(500)
      .json({ success: false, message: "Error deleting service!!" });
  }
});

export {
  createService,
  getServices,
  getSingleService,
  updateService,
  deleteService,
};
