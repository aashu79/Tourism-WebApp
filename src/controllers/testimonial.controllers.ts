import { Request, Response } from "express";
import Testimonial, { testimonialType } from "../models/testimonial.model";
import { customRequest } from "../middleware/authenticator.middleware";
import { validationResult } from "express-validator";
import asyncErrorHandler from "../middleware/asyncErrorHandler.middleware";

// get all testimonials
const getTestimonials = asyncErrorHandler(
  async (req: Request, res: Response) => {
    // const userId = (req as any).userId;
    const testimonials = await Testimonial.find({ isActive: true });
    if (testimonials.length) {
      res.status(200).json({
        success: true,
        message: "Testimonials found..",
        data: testimonials,
      });
    }
    if (!testimonials.length) {
      res
        .status(400)
        .json({ success: true, message: "Testimonials not found.." });
    }
  }
);

////get a single testimonial...
const getSingleTestimonial = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const testimonial = await Testimonial.findOne({ _id: id });
    if (!testimonial) {
      res
        .status(400)
        .json({ success: false, message: "Testimonial not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Testimonial found", data: testimonial });
  }
);

//create a new testimonial
const createTestimonial = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map((err) => err.msg);
      res.status(400).json({ success: false, message: messages });
      return;
    }
    const newTestimonial: testimonialType = req.body;

    newTestimonial.userId = (req as customRequest).id as any;
    newTestimonial.date = new Date();

    const testimonial = await Testimonial.create(newTestimonial);
    res.status(200).json({
      success: true,
      message: "Testimonial created successfully...",
      data: testimonial,
    });
  }
);

///update a testimonial

const updateTestimonial = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map((err) => err.msg);
      res.status(400).json({ success: false, message: messages });
      return;
    }
    const { id } = req.params;
    const updatedTestimonial: testimonialType = req.body;

    const newTestimonial = await Testimonial.findOneAndUpdate(
      { _id: id },
      updatedTestimonial,
      { new: true, runValidators: true }
    );
    if (newTestimonial) {
      res.status(200).json({
        success: true,
        message: "Testimonial was updated..",
        data: newTestimonial,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Couldn't update testimonial" });
    }
  }
);

//Delete Testimonial

const deleteTestimonial = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await Testimonial.findByIdAndDelete({ _id: id });
    if (response) {
      res
        .status(200)
        .json({ success: true, message: "Testimonials deleted successfully" });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Error deleting testimonial!!" });
    }
  }
);

export {
  createTestimonial,
  getTestimonials,
  getSingleTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
