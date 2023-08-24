import mongoose from "mongoose";

 const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide unique Username"],
        unique: [true, "Username exist"]
    },
    password: {
        type: String,
        required: [true, "Please provide unique password"],
        unique: [true, "password exist"]
    },
    email: {
        type: String,
        required: [true, "Please provide unique email"],
        unique: [true, "email exist"]
    },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: String },
    profile: { type: String },
    address: { type: String },
})

export default mongoose.model('User',UserSchema)