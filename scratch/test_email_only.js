import { Redis } from '@upstash/redis';
import nodemailer from 'nodemailer';

const REDIS_URL = "https://emerging-trout-155511.upstash.io";
const REDIS_TOKEN = "gQAAAAAAAl93AAIgcDFiOTVjYzNhMWEzY2Q0NGM1YThkMzkxMmY3ZjA5OTBiMQ";

async function run() {
  try {
    const redis = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });
    let configStr = await redis.get("domya:google_config.json");
    if (typeof configStr === 'string') {
      configStr = JSON.parse(configStr);
    }
    console.log("Config retrieved from Redis:", configStr);

    console.log("Attempting SMTP direct send test...");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: configStr.smtpUser,
        pass: configStr.smtpPass
      }
    });

    const info = await transporter.sendMail({
      from: `"Domya Agency Test" <${configStr.smtpUser}>`,
      to: "agencydomya@gmail.com",
      subject: "Test email from Redis config direct",
      text: "This is a direct SMTP test verifying SMTP credentials retrieved from Redis."
    });
    console.log("SMTP Send success! Message ID:", info.messageId);

  } catch (err) {
    console.error("Direct send failed:", err);
  }
}

run();
