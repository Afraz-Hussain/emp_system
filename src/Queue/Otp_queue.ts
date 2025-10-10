// queues/otpQueue.ts
import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

export const otpQueue = new Queue("otpQueue", { connection });
