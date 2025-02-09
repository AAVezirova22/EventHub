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
        unique:true,
    },
    password: {
        type: String,
        required: [true, "Please, write your password!"],
    },
}
)

const User = mongoose.models.user || mongoose.model("user", userSchema)
export default User