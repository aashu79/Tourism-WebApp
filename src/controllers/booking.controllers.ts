import { Request, Response } from "express";
import Booking, { bookingType } from "../models/booking.model";
import { customRequest } from "../middleware/authenticator.middleware";
import { validationResult } from "express-validator";
import asyncErrorHandler from "../middleware/asyncErrorHandler.middleware";

// get all bookings
const getBookings = asyncErrorHandler(async (req: Request, res: Response) => {
  // const userId = (req as any).userId;
  const bookings = await Booking.find();
  if (bookings.length) {
    res
      .status(200)
      .json({ success: true, message: "Bookings found..", data: bookings });
  }
  if (!bookings.length) {
    res.status(400).json({ success: true, message: "Bookings not found.." });
  }
});

////get a single booking...
const getSingleBooking = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const booking = await Booking.findOne({ _id: id });
    if (!booking) {
      res.status(400).json({ success: false, message: "Booking not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Booking found", data: booking });
  }
);

//create a new booking
const createBooking = asyncErrorHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    res.status(400).json({ success: false, message: messages });
    return;
  }
  const newBooking: bookingType = req.body;

  newBooking.userId = (req as customRequest).id as any;
  newBooking.bookingDate = new Date();

  const booking = await Booking.create(newBooking);
  res.status(200).json({
    success: true,
    message: "Booking created successfully...",
    data: booking,
  });
});

///update a booking

const updateBooking = asyncErrorHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    res.status(400).json({ success: false, message: messages });
    return;
  }
  const { id } = req.params;
  const updatedBooking: bookingType = req.body;

  const newBooking = await Booking.findOneAndUpdate(
    { _id: id },
    updatedBooking,
    { new: true, runValidators: true }
  );
  if (newBooking) {
    res.status(200).json({
      success: true,
      message: "Booking was updated..",
      data: newBooking,
    });
  } else {
    res
      .status(500)
      .json({ success: false, message: "Couldn't update booking" });
  }
});

//Delete Booking

const deleteBooking = asyncErrorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await Booking.findByIdAndDelete({ _id: id });
  if (response) {
    res
      .status(200)
      .json({ success: true, message: "Bookings deleted successfully" });
  } else {
    res
      .status(500)
      .json({ success: false, message: "Error deleting booking!!" });
  }
});

export {
  createBooking,
  getBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
};
