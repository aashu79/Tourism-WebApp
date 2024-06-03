import mongoose, { InferSchemaType } from "mongoose";

const TestimonialSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "User id is required"],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export type testimonialType = InferSchemaType<typeof TestimonialSchema>;

const Testimonail = mongoose.model("Testimonail", TestimonialSchema);

export default Testimonail;
