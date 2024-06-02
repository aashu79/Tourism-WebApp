import mongoose, { InferSchemaType } from "mongoose";
import bcrypt from "bcrypt";

async function isUnique(email: string) {
  try {
    const response = await User.findOne({ email: email });
    if (response) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    return false;
  }
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required.."],
    unique: true,
    validate: [
      {
        validator: isUnique,
        message: "Email is already registered!!!!",
      },
      {
        validator: (value: string) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Please enter a valid email address..",
      },
    ],
  },
  firstName: {
    type: String,
    required: [true, "First name is required"],

    max: [20, "First Name cannot exceed 40 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],

    max: [20, "Last Name cannot exceed 40 characters"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    min: [8, "Password must be at least 8 characters"],
  },
  userType: {
    type: String,
    enum: ["admin", "general"],
    default: "general",
    required: [true, "User type is required"],
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
  },
});

export type UserType = InferSchemaType<typeof UserSchema>;

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  }
});

const User = mongoose.model("User", UserSchema);
export default User;
