import mongoose, { InferSchemaType } from "mongoose";
// import Service from "./service.model";

// const getServiceType = async (): Promise<string[]> => {
//   const response = await Service.find();
//   const data = response.map((item, index) => {
//     return item.serviceName;
//   });
//   return data;
// };

// const serviceType = getServiceType();

const PacakageScehma = new mongoose.Schema(
  {
    packageName: {
      type: String,
      required: [true, "Pacakage name is required"],
    },
    serviceType: {
      type: mongoose.Types.ObjectId,
      ref: "Service",
      required: [true, "Service type is required."],
    },
    pricePerPerson: {
      type: Number,
      default: 0,
      min: [1, "Price cannot be less than 1."],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration cannot be less than 1."],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    images: {
      type: [String],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type PackageType = InferSchemaType<typeof PacakageScehma>;

const Pacakage = mongoose.model("Pacakage", PacakageScehma);

export default Pacakage;
