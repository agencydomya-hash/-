import { Redis } from '@upstash/redis';
import nodemailer from 'nodemailer';

const REDIS_URL = "https://emerging-trout-155511.upstash.io";
const REDIS_TOKEN = "gQAAAAAAAl93AAIgcDFiOTVjYzNhMWEzY2Q0NGM1YThkMzkxMmY3ZjA5OTBiMQ";

async function loadGoogleConfig() {
  const redis = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });
  let config = await redis.get("domya:google_config.json");
  if (typeof config === 'string') {
    config = JSON.parse(config);
  }
  return config || {};
}

async function sendRealEmail(to, subject, body) {
  const gConfig = await loadGoogleConfig();
  let sentSuccessfully = false;
  let methodUsed = "none";

  if (gConfig.smtpUser && gConfig.smtpPass) {
    try {
      console.log(`[SMTP Test] Attempting SMTP fallback to ${to}...`);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gConfig.smtpUser,
          pass: gConfig.smtpPass
        }
      });
      const info = await transporter.sendMail({
        from: `"Domya Agency" <${gConfig.smtpUser}>`,
        to,
        subject,
        text: body
      });
      console.log(`[SMTP Test] Email successfully sent to ${to}. MessageId: ${info.messageId}`);
      sentSuccessfully = true;
      methodUsed = "SMTP";
    } catch (err) {
      console.error("[SMTP Test] Failed to send email via SMTP:", err);
    }
  }

  // Log locally
  const redis = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });
  let logs = await redis.get("domya:email_logs.json") || [];
  if (typeof logs === 'string') {
    logs = JSON.parse(logs);
  }
  logs.push({
    id: `log_mail_${Date.now()}`,
    timestamp: new Date().toISOString(),
    to,
    subject,
    sentSuccessfully,
    methodUsed
  });
  await redis.set("domya:email_logs.json", JSON.stringify(logs));
  console.log("Email logged to Redis successfully.");
}

async function run() {
  const doctorEmail = "atef88950@gmail.com";
  const name = "أحمد خالد (تجربة)";
  const specialty = "الجلدية والتجميل";
  const clinicName = "عيادة أحمد";
  const goal = "جذب مرضى حقيقيين وزيادة تعاقدات العيادة";
  
  const targetReceiver = "agencydomya@gmail.com";
  
  const doctorSubject = `✅ تأكيد استلام حجزك — وكالة دوميا للتسويق الطبي`;
  const doctorBody = `أهلاً دكتور ${name}،\n\nتم استلام طلب حجز الاستشارة التسويقية الخاص بك بنجاح.\nالتخصص: ${specialty}\nالعيادة: ${clinicName || 'غير محدد'}\nالهدف المختار: ${goal}\n\nسيقوم مستشار تسويق من فريق دوميا بالاتصال بك خلال 24 ساعة عمل لترتيب الخطوة القادمة وزيارة العيادة.\n\nمع خالص التحية،\nفريق وكالة دوميا`;

  const agencySubject = `🚨 حجز جديد من طبيب: د. ${name} — ${specialty}`;
  const agencyBody = `=== بيانات الطبيب الجديد ===\nالاسم: د. ${name}\nالتخصص: ${specialty}\nالعيادة: ${clinicName}\nالهاتف: 01224052417\nالبريد الإلكتروني: ${doctorEmail}\nالهدف التسويقي: ${goal}`;

  console.log("Starting simulation of email sending...");
  await sendRealEmail(doctorEmail, doctorSubject, doctorBody);
  await sendRealEmail(targetReceiver, agencySubject, agencyBody);
  console.log("Simulation finished successfully!");
}

run();
