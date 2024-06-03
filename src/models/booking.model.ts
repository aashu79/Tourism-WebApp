import mongoose, { InferSchemaType } from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    bookingDate: {
      type: Date,
      required: [true, "Booking date is requirerd."],
    },
    packageId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Pacakage id is required"],
    },
    numberOfPerson: {
      type: Number,
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type bookingType = InferSchemaType<typeof BookingSchema>;

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;
