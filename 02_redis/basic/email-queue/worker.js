import { Worker } from "bullmq";
import sendMail from "./send-mail.js";
import Redis from "ioredis";

const connection = new Redis("redis://localhost:6379", { maxRetriesPerRequest: null });

const worker = new Worker(
    "email-queue",
    async (job) => {
        console.log(`[Worker] Processing email job ID: ${job.id}`);
        await sendMail(job.data);
    },
    { connection }
);

worker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} completed successfully.`);
});

worker.on("failed", (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed with error:`, err.message);
});

export default worker;
