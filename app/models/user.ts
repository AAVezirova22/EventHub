import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please, write your name!"],
  },
  lastName: {
    type: String,
    required: [true, "Please, write your last name!"],
  },
  email: {
    type: String,
    required: [true, "Please, write your email!"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Please, write your username!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please, write your password!"],
  },
  image: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  country: {
    type: String,
    default: "",
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;