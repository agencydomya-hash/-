import { Redis } from '@upstash/redis';

const REDIS_URL = "https://emerging-trout-155511.upstash.io";
const REDIS_TOKEN = "gQAAAAAAAl93AAIgcDFiOTVjYzNhMWEzY2Q0NGM1YThkMzkxMmY3ZjA5OTBiMQ";

async function run() {
  try {
    const redis = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });
    let subs = await redis.get("domya:submissions.json");
    if (typeof subs === 'string') {
      subs = JSON.parse(subs);
    }
    console.log("Submissions from Redis:");
    console.log(JSON.stringify(subs ? subs.slice(-5) : [], null, 2)); // show last 5

    let logs = await redis.get("domya:email_logs.json");
    if (typeof logs === 'string') {
      logs = JSON.parse(logs);
    }
    console.log("\nEmail Logs from Redis:");
    console.log(JSON.stringify(logs ? logs.slice(-5) : [], null, 2)); // show last 5
  } catch (err) {
    console.error("Error reading from Redis:", err);
  }
}

run();
