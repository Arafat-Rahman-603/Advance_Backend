import { Schema, model } from "mongoose";

const UserSchma = Schema({
    name: String,
    email: String,
    pass: String,
    verify: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const User = model("User", UserSchma);

export default User;