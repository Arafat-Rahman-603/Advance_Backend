import { Schema, model } from "mongoose";

const UserSchma = Schema({
    name: String,
    email: String,
    pass: String
});

const User = model("User", UserSchma);

export default User;