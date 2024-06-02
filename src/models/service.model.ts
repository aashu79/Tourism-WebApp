import mongoose, { InferSchemaType } from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: [true, "Service name is required"],
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
    },
    thumbnail: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type ServiceType = InferSchemaType<typeof ServiceSchema>;

const Service = mongoose.model("Service", ServiceSchema);
export default Service;
