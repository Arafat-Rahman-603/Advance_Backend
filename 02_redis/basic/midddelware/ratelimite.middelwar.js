import redis from "ioredis";

const Redis = new redis("redis://localhost:6379");

export default async function ratelimitMiddleware(req, res, next) {
    try {
        const ip = req.ip;
        const request = await Redis.incr(`rateLimit:${ip}`);
        if (request > 5) {
            res.json({ message: "Too many requests" })
        } else {
            await Redis.expire(`rateLimit:${ip}`, 60);
            next();
        }
    } catch (error) {
        console.error("Error in rate limiting:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}