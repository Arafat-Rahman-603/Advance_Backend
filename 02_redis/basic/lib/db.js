import { connect } from "mongoose";

const connnectDB = async () => {
    try {
        await connect(process.env.MONGGO_URI);
        console.log("DB Connected");
    } catch (error) {
        console.log(error.message);
    }
}

export default connnectDB;