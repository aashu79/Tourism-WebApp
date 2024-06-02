import mongoose from "mongoose";

const connection = (connString: string) => {
  if (typeof connString === "string") {
    return mongoose.connect(connString);
  } else {
    throw new Error("Connection string missing");
  }
};

export default connection;
