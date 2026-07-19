import { Worker } from "bullmq";
import sendMail from "./send-mail.js";
import Redis from "ioredis";

const connection = new Redis("redis://localhost:6379", {maxRetriesPerRequest: null,});

const worker = new Worker("email-queue", async (job) => {
    await sendMail(job)
}, { connection });

export default worker