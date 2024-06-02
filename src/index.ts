import express from "express";
import "dotenv/config";
const app = express();

import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import connection from "./utils/connection";
import globalErrorHandler from "./middleware/globalErrorHandler";

app.set("trust proxy", 1);
app.use(
  cors({
    origin: [
      "https://hotel-booking-app-5adp.onrender.com",
      "https://hotelbookingapp1.netlify.app",
      "http://localhost:5173",
    ],

    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Import
import userRoute from "./routes/user.routes";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route
app.all("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Hotel Booking API" });
});
app.use("/api/v1/auth", userRoute);
// app.use("/api/v1/hotel", hotelRoutes);
// app.use("/api/v1/booking",bookingRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found!!!!" });
});

const port = process.env.PORT || 3000;

app.use(globalErrorHandler);
app.listen(port, async () => {
  try {
    const connString = process.env.MONGOOSE_CONNECTION_STRING;
    const dbConnection = await connection(connString as string);
    console.log("Connected to datbase....");
    console.log("Listening on port: " + port);
  } catch (error) {
    console.error(error);
  }
});
