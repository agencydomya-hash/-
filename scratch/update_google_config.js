import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { Redis } from '@upstash/redis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SMTP_USER = "agencydomya@gmail.com";
const SMTP_PASS = "vhocjboqhomqgvbt"; // Stripped of spaces
const REDIS_URL = "https://emerging-trout-155511.upstash.io";
const REDIS_TOKEN = "gQAAAAAAAl93AAIgcDFiOTVjYzNhMWEzY2Q0NGM1YThkMzkxMmY3ZjA5OTBiMQ";

async function run() {
  console.log("Starting SMTP config updater as ESM inside project root...");

  // 1. Update local file
  const localConfigPath = path.join(__dirname, "../google_config.json");
  let localConfig = { accessToken: "", spreadsheetId: "" };
  
  if (fs.existsSync(localConfigPath)) {
    try {
      localConfig = JSON.parse(fs.readFileSync(localConfigPath, 'utf8'));
    } catch (e) {
      console.warn("Could not read local config, starting fresh.");
    }
  }

  localConfig.smtpUser = SMTP_USER;
  localConfig.smtpPass = SMTP_PASS;
  
  fs.writeFileSync(localConfigPath, JSON.stringify(localConfig, null, 2));
  console.log("✓ Updated local google_config.json successfully.");

  // 2. Update Upstash Redis for Vercel
  try {
    const redis = new Redis({
      url: REDIS_URL,
      token: REDIS_TOKEN,
    });

    // Fetch existing config from Redis to preserve other keys
    let remoteConfig = await redis.get("domya:google_config.json");
    if (typeof remoteConfig === 'string') {
      try {
        remoteConfig = JSON.parse(remoteConfig);
      } catch (e) {}
    }

    if (!remoteConfig) {
      remoteConfig = { ...localConfig };
    } else {
      remoteConfig.smtpUser = SMTP_USER;
      remoteConfig.smtpPass = SMTP_PASS;
    }

    await redis.set("domya:google_config.json", JSON.stringify(remoteConfig));
    console.log("✓ Updated Vercel Upstash Redis database successfully.");

  } catch (redisErr) {
    console.error("✗ Failed to update Upstash Redis:", redisErr);
  }

  // 3. Test SMTP settings by sending a test email
  console.log("Testing SMTP settings with a test email...");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"Domya Agency" <${SMTP_USER}>`,
      to: SMTP_USER,
      subject: "🩺 اختبار نجاح تفعيل البريد التلقائي — دوميا",
      text: "أهلاً دكتور،\n\nتم تفعيل بريد SMTP للموقع الخاص بك بنجاح.\n\nالآن، سيقوم الموقع بإرسال كافة الحجوزات والتشخيصات فورياً وبشكل مستقر دون انقطاع!\n\nمع خالص التحية،\nفريق وكالة دوميا"
    });
    console.log("✓ SMTP Test email sent successfully to agencydomya@gmail.com!");
  } catch (smtpErr) {
    console.error("✗ SMTP Test email failed. Please verify App Password or account status:", smtpErr);
  }
}

run();
