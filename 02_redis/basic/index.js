import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import Redis from "ioredis"
import User from "./model/user.model.js"
import connnectDB from "./lib/db.js";
import dns from "dns";
import {emailQueue} from "./email-queue/queue.js"
import ratelimitMiddleware from "./midddelware/ratelimite.middelwar.js"


dotenv.config()

const app = express();
app.use(express.json());

connnectDB();

const redis = new Redis("redis://localhost:6379");

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.post("/users", async (req, res) => {
    try {
        const { name, email, pass } = req.body;

        emailQueue.add("email-job", {
            email
        });

        const user = new User({ name, email, pass });

        user.save();

        const getUser = await User.findOne({ email });
        const id = getUser._id
        console.log(id, getUser)

        res.json({ message: "User created successfully", id });
    } catch (error) {
        res.json({ message: error.message });
    }
});

app.get("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userRedis = await redis.get(id);
        if (userRedis) {
            res.json({ user: JSON.parse(userRedis) })
        } else {
            const user = await User.findById(id);
            redis.set(id, JSON.stringify(user));
            res.json({ user })
        }
    } catch (error) {
        console.error(error)
    }
})

app.get("/verify/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const otp = Math.floor(100000 + Math.random() * 900000);
        const userRedis = await redis.get("otp" + id);
        if (userRedis) {
            res.json({ message: "Otp already sent", otp })
        } else {
            await redis.set("otp" + id, otp, 'EX', 120);

            res.json({ otp })
        }
    } catch (error) {
        console.error(error)
    }
})

app.get("/generate", ratelimitMiddleware, (req, res) => {
    const { prompt } = req.body;
    console.log(prompt)

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    res.json({
        image: url,
    });
});

app.post("/verify", async (req, res) => {
    try {
        const { id, otp } = req.body;
        const userRedis = await redis.get("otp" + id);

        if (userRedis == otp) {
            await User.findByIdAndUpdate(id, { verify: true })
            await redis.del("otp" + id);
            res.json({ message: "Otp verified successfully" })
        } else {
            res.json({ message: "Invalid Otp" })
        }
    } catch (error) {
        console.error("error", error)
    }
})

app.listen(process.env.PORT, () => {
    console.log("Server started on port", process.env.PORT)
})