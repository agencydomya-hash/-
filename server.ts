/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Serve custom uploads directory
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use("/uploads", express.static(UPLOADS_DIR));

// Data file paths
const SUBMISSIONS_FILE = path.join(process.cwd(), "submissions.json");
const DIAGNOSES_FILE = path.join(process.cwd(), "diagnoses.json");

// Helper to load submissions
function loadSubmissions() {
  try {
    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading submissions:", err);
    return [];
  }
}

// Helper to save submissions
function saveSubmissions(submissions: any[]) {
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
  } catch (err) {
    console.error("Error saving submissions:", err);
  }
}

// Helper to load diagnoses
function loadDiagnoses() {
  try {
    if (!fs.existsSync(DIAGNOSES_FILE)) {
      fs.writeFileSync(DIAGNOSES_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(DIAGNOSES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading diagnoses:", err);
    return [];
  }
}

// Helper to save diagnoses
function saveDiagnoses(diagnoses: any[]) {
  try {
    fs.writeFileSync(DIAGNOSES_FILE, JSON.stringify(diagnoses, null, 2));
  } catch (err) {
    console.error("Error saving diagnoses:", err);
  }
}

const REELS_FILE = path.join(process.cwd(), "reels.json");
const GOOGLE_CONFIG_FILE = path.join(process.cwd(), "google_config.json");

const DEFAULT_REELS = [
  {
    id: "reel_ortho",
    specialty: "جراحة العظام والمفاصل 🦴",
    doctorName: "د. هاني الرفاعي",
    title: "خرافة طقطقة الرقبة.. هل بتسبب خشونة فعلاً؟",
    views: "124K",
    coverColor: "from-[#1E3A8A] to-[#3B82F6]",
    length: 12,
    qualityPillars: [
      "ميكروفون لاسلكي ذو عزل فائق لتنقية ترددات الصوت",
      "تصوير بكاميرا سوني السينمائية مع عمق عزل فخم خلف الطبيب",
      "مؤثرات بصرية وصور حية للمفاصل تظهر عند ذكرها"
    ],
    subtitles: [
      { time: 0, text: "طقطقة الرقبة والظهر.. حركة بنعملها كلنا لما نحس بضغط..." },
      { time: 3, text: "بس هل الحركة دي ممكن تدمر مفاصلك وتجيب لك خشونة مبكرة؟" },
      { time: 6, text: "العلم بيقول: دي مجرد فقاعات غاز بتنفجر في السائل الزلالي!" },
      { time: 9, text: "بس لو تكررت بألم، هنا الخطر الحقيقي ولازم فحص فوري عيادتنا." }
    ]
  },
  {
    id: "reel_derma",
    specialty: "الجلدية والتجميل والليزر 🌸",
    doctorName: "د. ياسمين شاهين",
    title: "الترتيب الصح لمنتجات العناية بالبشرة بالليل!",
    views: "310K",
    coverColor: "from-[#9D174D] to-[#F472B6]",
    length: 15,
    qualityPillars: [
      "إضاءة استوديو ناعمة دائرية تبرز صفاء البشرة بشكل طبيعي",
      "مونتاج ديناميكي سريع الحركة يمنع المشاهد من التمرير",
      "لوحة ألوان دافئة مريحة تعكس الفخامة والاهتمام بالجمال"
    ],
    subtitles: [
      { time: 0, text: "بتحطي السيروم قبل الكريم ولا الكريم الأول؟ 🤔" },
      { time: 3, text: "الترتيب الغلط للمنتجات بيضيع تأثيرها وفلوسك في الأرض!" },
      { time: 6, text: "القاعدة الذهبية: بنبدأ من الأخف وزناً زي التونر والسيروم..." },
      { time: 9, text: "ثم بنقفل بالمرطب التقيل لحبس الفوائد داخل خلايا الجلد." },
      { time: 12, text: "احفظي الفيديو ده عندك وشاركيه مع صاحبتك المهتمة بالبشرة!" }
    ]
  },
  {
    id: "reel_pedia",
    specialty: "طب الأطفال وحديثي الولادة 👶",
    doctorName: "د. عادل الشاذلي",
    title: "أول خطوة لو حرارة طفلك ارتفعت فجأة بالليل!",
    views: "185K",
    coverColor: "from-[#065F46] to-[#34D399]",
    length: 13,
    qualityPillars: [
      "مؤثرات صوتية هادئة مريحة للأمهات والآباء القلقين",
      "سيناريو يبسط طوارئ الأطفال بطمأنينة علمية فائقة",
      "تصوير خلفية دافئة مريحة لعيادة أطفال مبهجة"
    ],
    subtitles: [
      { time: 0, text: "لو حرارة طفلك ارتفعت بالليل.. أرجوكِ بلاش ذعر!" },
      { time: 3, text: "أول وأهم خطوة مش خافض الحرارة، بل الكمادات بمياه الحنفية..." },
      { time: 6, text: "بنحطها على الفخذين وتحت الإبطين، مش على الجبهة!" },
      { time: 9, text: "لأن دي المناطق اللي بيمر فيها الدم وبيرجع بارد للجسم." },
      { time: 11, text: "لو الحرارة مستمرة، كلمينا فوراً وسجلي زيارة للعيادة للاطمئنان." }
    ]
  }
];

function loadReels() {
  try {
    if (!fs.existsSync(REELS_FILE)) {
      fs.writeFileSync(REELS_FILE, JSON.stringify(DEFAULT_REELS, null, 2));
      return DEFAULT_REELS;
    }
    const data = fs.readFileSync(REELS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading reels:", err);
    return DEFAULT_REELS;
  }
}

function saveReels(reels: any[]) {
  try {
    fs.writeFileSync(REELS_FILE, JSON.stringify(reels, null, 2));
  } catch (err) {
    console.error("Error saving reels:", err);
  }
}

function loadGoogleConfig() {
  try {
    if (!fs.existsSync(GOOGLE_CONFIG_FILE)) {
      return { accessToken: "", spreadsheetId: "" };
    }
    const data = fs.readFileSync(GOOGLE_CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return { accessToken: "", spreadsheetId: "" };
  }
}

function saveGoogleConfig(config: any) {
  try {
    fs.writeFileSync(GOOGLE_CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (err) {
    console.error("Error saving google config:", err);
  }
}

// Lazy Gemini API Initializer
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY standard environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Routes

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 1. AI Diagnosis API (Uses Gemini 3.5 Flash server-side)
app.post("/api/diagnose", async (req, res) => {
  try {
    const { name, specialty, clinicDetails, struggle, targetAudience } = req.body;

    if (!name || !specialty || !struggle) {
      return res.status(400).json({ error: "الرجاء إدخال الاسم، التخصص، والمشكلة الأساسية." });
    }

    let ai;
    try {
      ai = getAiClient();
    } catch (apiErr: any) {
      console.error("Gemini init error:", apiErr.message);
      // Return beautiful simulated diagnostic if API key is missing, to preserve user experience
      const simulatedId = `diag_${Date.now()}`;
      return res.json({
        id: simulatedId,
        patientName: name,
        specialty,
        symptoms: [
          `ضعف الانتشار الرقمي بين جمهور ${targetAudience || 'المرضى المستهدفين'}`,
          `صعوبة إدارة المحتوى بسبب: ${struggle}`,
          "عدم استثمار الهوية الشخصية كطبيب لبناء الثقة والوعي المسبق"
        ],
        prescriptionRx: [
          "Rx 01: تصوير 6 فيديوهات Reels طبية احترافية بالعيادة تركز على حلول سريعة لأهم مخاوف المرضى.",
          "Rx 02: إطلاق هوية بصرية موحدة (ألوان مريحة شعار يحمل طابعك الخاص) وتثبيتها في جميع المنصات.",
          `Rx 03: كتابة نصوص طبية باللهجة العامية المصرية لتبسيط موضوعات ${specialty} المعقدة.`,
          "Rx 04: إعداد جدول نشر أسبوعي ثابت (فيديوين أسبوعياً) مع تفعيل ميزة المتابعة والتفاعل مع التعليقات."
        ],
        contentPlan: {
          theme: `تبسيط طوارئ ومفاهيم ${specialty} لعامة الناس وكسب ثقة المرضى`,
          topics: [
            `أول خطوة تعملها لو واجهت أشهر مشكلة في ${specialty}`,
            "خرافة طبية شائعة بنسمعها كل يوم في عيادتنا وحقيقتها العلمية",
            `إزاي تختار الطبيب الصح وأهم نصيحة سرية من دكتور ${name}`
          ]
        },
        actionSteps: [
          "تجهيز بيئة الإضاءة والصوت بالعيادة لتسجيل أول دفعة فيديوهات",
          "تنسيق المونتاج ليحتوي على خط واضح وعلامة الوكالة الخاصة بك لتعزيز الاحترافية",
          "بدء حملة توعية ممولة محلية تستهدف النطاق الجغرافي للعيادة"
        ],
        createdAt: new Date().toISOString(),
        isSimulated: true
      });
    }

    const systemInstruction = `أنت خبير براندنج تسويقي طبي محترف تعمل لدى وكالة "دومايا" (Domya Marketing Agency).
مهمتك هي تشخيص الحضور الرقمي للطبيب (المشار إليه بالمريض) وكتابة "روشتة براندنج علاجية" (Branding Prescription) تفصيلية وعملية باللغة العربية بلهجة تجمع بين الاحترافية العلمية والروح الودية المصرية الجاذبة.
يجب أن تركز خطتك على كيف يمكن للطبيب استخدام قوة الميديا بروداكشن الطبي وكتابة المحتوى لتبسيط المفاهيم وكسب ثقة المرضى.
أرجع البيانات بالتنسيق والمواصفات المحددة في الـ responseSchema حصراً باللغة العربية.`;

    const prompt = `الاسم: دكتور ${name}
التخصص: ${specialty}
تفاصيل العيادة والموقع: ${clinicDetails || 'غير محدد'}
المشكلة الأساسية التي يعاني منها: ${struggle}
الجمهور المستهدف: ${targetAudience || 'المرضى الباحثين عن الطمأنينة والأمان'}

قم بتوليد تشخيص دقيق للحالة (Symptoms - أعراض الحضور الرقمي الضعيف) وروشتة علاجية (Prescription Rx - خطوات علاجية برقم Rx)، وخطة محتوى ذكية (Content Plan مع فكرة محورية و 3 موضوعات مخصصة تهم تخصصهم وعامة الناس)، وخطوات عمل فورية (Action Steps).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            symptoms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 أعراض واضحة لضعف الحضور الرقمي بناءً على مشكلتهم"
            },
            prescriptionRx: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4 خطوات علاجية تبدأ بـ Rx 01, Rx 02, Rx 03, Rx 04"
            },
            contentPlan: {
              type: Type.OBJECT,
              properties: {
                theme: { type: Type.STRING, description: "الفكرة العامة أو العنوان المحوري لخطة المحتوى" },
                topics: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3 موضوعات فيديوهات Reels قصيرة تفصيلية مكتوبة بصيغة جذابة ومثيرة للاهتمام"
                }
              },
              required: ["theme", "topics"]
            },
            actionSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 خطوات عملية فورية يبدأ الطبيب بتنفيذها فوراً"
            }
          },
          required: ["symptoms", "prescriptionRx", "contentPlan", "actionSteps"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini API");
    }

    const diagnosisData = JSON.parse(responseText.trim());
    const finalDiagnosis = {
      id: `diag_${Date.now()}`,
      patientName: name,
      specialty,
      ...diagnosisData,
      createdAt: new Date().toISOString()
    };

    // Save diagnosis history
    const diagnoses = loadDiagnoses();
    diagnoses.push(finalDiagnosis);
    saveDiagnoses(diagnoses);

    res.json(finalDiagnosis);
  } catch (err: any) {
    console.error("Diagnosis error:", err);
    res.status(500).json({ error: "حدث خطأ أثناء إعداد الروشتة العلاجية الرقمية. برجاء المحاولة مرة أخرى." });
  }
});

// Helper for sending real emails using SMTP/Gmail
async function sendRealEmail(to: string, subject: string, body: string, receiverEmailConfig?: string) {
  const gConfig = loadGoogleConfig();
  const smtpUser = gConfig.smtpUser || process.env.SMTP_USER || "";
  const smtpPass = gConfig.smtpPass || process.env.SMTP_PASS || "";
  const fallbackSender = receiverEmailConfig || "Contact@domya.net";
  
  // Always log locally
  const logFile = path.join(process.cwd(), "email_logs.json");
  let logs: any[] = [];
  if (fs.existsSync(logFile)) {
    try { logs = JSON.parse(fs.readFileSync(logFile, "utf-8")); } catch {}
  }
  logs.push({
    id: `log_mail_${Date.now()}`,
    timestamp: new Date().toISOString(),
    to,
    subject,
    body,
    sentViaSmtp: !!(smtpUser && smtpPass)
  });
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
      await transporter.sendMail({
        from: `"Domya Agency" <${smtpUser}>`,
        to,
        subject,
        text: body
      });
      console.log(`[SMTP] Email successfully sent to ${to}`);
    } catch (err) {
      console.error("[SMTP] Failed to send email via SMTP, logged to file:", err);
    }
  } else {
    console.log(`[SIMULATOR] Email simulation logged to file. (SMTP credentials missing in environment)`);
  }
}

// 2. Form Submission API (Booking consultation)
app.post("/api/submit", async (req, res) => {
  try {
    const { name, specialty, clinicName, phone, email, socialLink, goal, diagnosisId } = req.body;

    if (!name || !specialty || !phone) {
      return res.status(400).json({ error: "برجاء توفير الاسم، التخصص، ورقم الهاتف لإكمال الفحص." });
    }

    const submissions = loadSubmissions();
    const newSubmission = {
      id: `sub_${Date.now()}`,
      name,
      specialty,
      clinicName: clinicName || "غير محدد",
      phone,
      email: email || "غير محدد",
      socialLink: socialLink || "غير محدد",
      goal: goal || "بناء براند شخصي متكامل وكسب ثقة المرضى",
      status: "new",
      createdAt: new Date().toISOString(),
      diagnosisId: diagnosisId || null,
      notes: "",
      synced: false
    };

    submissions.push(newSubmission);
    saveSubmissions(submissions);

    const gConfig = loadGoogleConfig();

    // Try to sync with Google Sheets in real-time
    try {
      if (gConfig && gConfig.spreadsheetId && gConfig.accessToken) {
        const rowValues = [
          newSubmission.id,
          `د. ${newSubmission.name}`,
          newSubmission.specialty,
          newSubmission.clinicName,
          newSubmission.phone,
          newSubmission.email,
          newSubmission.socialLink,
          newSubmission.goal,
          "جديد",
          new Date(newSubmission.createdAt).toLocaleString("ar-EG"),
          ""
        ];

        const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${gConfig.spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`;
        const sheetRes = await fetch(sheetUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${gConfig.accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            values: [rowValues]
          })
        });

        if (sheetRes.ok) {
          newSubmission.synced = true;
          // Save with updated sync status
          const updatedSubmissions = loadSubmissions();
          const subIdx = updatedSubmissions.findIndex((s: any) => s.id === newSubmission.id);
          if (subIdx !== -1) {
            updatedSubmissions[subIdx].synced = true;
            saveSubmissions(updatedSubmissions);
          }
        }
      }
    } catch (sheetErr) {
      console.error("Google Sheets background sync error:", sheetErr);
    }

    // Try to sync with Google Forms / Apps Script Webhook in real-time
    const targetReceiver = gConfig.receiverEmail || "Contact@domya.net";
    if (gConfig && gConfig.webhookUrl) {
      try {
        console.log(`Triggering webhook sync: ${gConfig.webhookUrl}`);
        await fetch(gConfig.webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "new_lead",
            lead: newSubmission
          })
        });
        console.log("Webhook sync completed successfully.");
      } catch (webhookErr) {
        console.error("Webhook synchronization error:", webhookErr);
      }
    }

    // Send Real Emails using Nodemailer helper
    const doctorSubject = `✅ تأكيد استلام حجزك — وكالة دومايا للتسويق الطبي`;
    const doctorBody = `أهلاً دكتور ${name}،\n\nتم استلام طلب حجز الاستشارة التسويقية الخاص بك بنجاح.\nالتخصص: ${specialty}\nالعيادة: ${clinicName || 'غير محدد'}\nالهدف المختار: ${goal}\n\nسيقوم مستشار تسويق من فريق دومايا بالاتصال بك خلال 24 ساعة عمل لترتيب الخطوة القادمة وزيارة العيادة.\n\nمع خالص التحية،\nفريق وكالة دومايا\nContact@domya.net | +201090121000`;

    const agencySubject = `🚨 حجز جديد من طبيب: د. ${name} — ${specialty}`;
    const agencyBody = `=== بيانات الطبيب الجديد ===\nالاسم: د. ${name}\nالتخصص: ${specialty}\nاسم العيادة: ${clinicName || 'غير محدد'}\nالهاتف: ${phone}\nالبريد الإلكتروني: ${email || 'غير محدد'}\nرابط السوشيال ميديا: ${socialLink || 'غير محدد'}\nالهدف التسويقي: ${goal}\nرقم التشخيص المرتبط: ${diagnosisId || 'لا يوجد'}\n\n=== إجراء مطلوب ===\nيرجى الاتصال بالطبيب خلال 24 ساعة عمل.`;

    // 1. To doctor
    if (email && email !== "غير محدد") {
      await sendRealEmail(email, doctorSubject, doctorBody, targetReceiver);
    }
    // 2. To agency (configured email)
    await sendRealEmail(targetReceiver, agencySubject, agencyBody, targetReceiver);

    res.json({
      success: true,
      submission: newSubmission,
      emailConfirmation: {
        clientEmail: email !== "غير محدد" ? email : null,
        agencyEmail: targetReceiver,
        sentAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error("Submission error:", err);
    res.status(500).json({ error: "فشل إرسال طلب الحجز. برجاء المحاولة لاحقاً." });
  }
});

// Google Workspace Integration Endpoints

// Save Google Sheets Config
app.post("/api/google/config", (req, res) => {
  try {
    const { auth, accessToken, spreadsheetId, webhookUrl, receiverEmail, smtpUser, smtpPass } = req.body;
    if (auth !== "domya2026") {
      return res.status(401).json({ error: "غير مصرح." });
    }
    saveGoogleConfig({ 
      accessToken: accessToken || "", 
      spreadsheetId: spreadsheetId || "",
      webhookUrl: webhookUrl || "",
      receiverEmail: receiverEmail || "Contact@domya.net",
      smtpUser: smtpUser || "",
      smtpPass: smtpPass || ""
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "فشل حفظ إعدادات جوجل." });
  }
});

// Fetch Google Sheets Config
app.get("/api/google/config", (req, res) => {
  try {
    const { auth } = req.query;
    if (auth !== "domya2026") {
      return res.status(401).json({ error: "غير مصرح." });
    }
    const config = loadGoogleConfig();
    res.json({
      spreadsheetId: config.spreadsheetId || "",
      accessToken: config.accessToken || "",
      webhookUrl: config.webhookUrl || "",
      receiverEmail: config.receiverEmail || "Contact@domya.net",
      smtpUser: config.smtpUser || "",
      smtpPass: config.smtpPass || ""
    });
  } catch (err) {
    res.status(500).json({ error: "فشل قراءة إعدادات جوجل شيتس." });
  }
});

// Bulk Sync Pending Submissions
app.post("/api/google/sync-pending", async (req, res) => {
  try {
    const { auth, accessToken } = req.body;
    if (auth !== "domya2026") {
      return res.status(401).json({ error: "غير مصرح." });
    }

    const config = loadGoogleConfig();
    const tokenToUse = accessToken || config.accessToken;
    const sheetId = config.spreadsheetId;

    if (!tokenToUse || !sheetId) {
      return res.status(400).json({ error: "لم يتم ربط جدول بيانات جوجل شيتس بعد." });
    }

    // Update config with fresh token if sent
    if (accessToken) {
      config.accessToken = accessToken;
      saveGoogleConfig(config);
    }

    const submissions = loadSubmissions();
    const pending = submissions.filter((s: any) => !s.synced);

    if (pending.length === 0) {
      return res.json({ success: true, count: 0, message: "جميع الطلبات مسبقة المزامنة بالفعل!" });
    }

    let successCount = 0;
    for (const sub of pending) {
      try {
        const rowValues = [
          sub.id,
          `د. ${sub.name}`,
          sub.specialty,
          sub.clinicName,
          sub.phone,
          sub.email,
          sub.socialLink,
          sub.goal,
          sub.status === "new" ? "جديد" : sub.status === "contacted" ? "تم المتابعة" : "مؤرشف",
          new Date(sub.createdAt).toLocaleString("ar-EG"),
          sub.notes || ""
        ];

        const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:append?valueInputOption=USER_ENTERED`;
        const sheetRes = await fetch(sheetUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${tokenToUse}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            values: [rowValues]
          })
        });

        if (sheetRes.ok) {
          sub.synced = true;
          successCount++;
        }
      } catch (err) {
        console.error(`Failed to sync submission ${sub.id}:`, err);
      }
    }

    if (successCount > 0) {
      saveSubmissions(submissions);
    }

    res.json({ success: true, count: successCount });
  } catch (err) {
    console.error("Bulk sync error:", err);
    res.status(500).json({ error: "فشل مزامنة البيانات المعلقة." });
  }
});

// Dynamic Video Reference Manager Endpoints

// File Upload API
app.post("/api/upload", (req, res) => {
  try {
    const { auth, fileName, fileData } = req.body;
    if (auth !== "domya2026") {
      return res.status(401).json({ error: "غير مصرح." });
    }
    if (!fileName || !fileData) {
      return res.status(400).json({ error: "بيانات الملف ناقصة." });
    }

    const buffer = Buffer.from(fileData, 'base64');
    const uploadsDir = path.join(process.cwd(), "uploads");
    const filePath = path.join(uploadsDir, fileName);
    
    fs.writeFileSync(filePath, buffer);
    res.json({ success: true, url: `/uploads/${fileName}` });
  } catch (err: any) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "فشل رفع الملف." });
  }
});

// Fetch Reference Reels
app.get("/api/reels", (req, res) => {
  try {
    const reels = loadReels();
    res.json(reels);
  } catch (err) {
    res.status(500).json({ error: "فشل تحميل فيديوهات المعرض." });
  }
});

// Add or Update Reference Reel
app.post("/api/reels", (req, res) => {
  try {
    const { auth, reel } = req.body;
    if (auth !== "domya2026") {
      return res.status(401).json({ error: "غير مصرح." });
    }

    if (!reel || !reel.title || !reel.doctorName || !reel.specialty) {
      return res.status(400).json({ error: "الرجاء توفير جميع الحقول الأساسية للفيديو." });
    }

    const reels = loadReels();
    const existingIdx = reels.findIndex((r: any) => r.id === reel.id);

    if (existingIdx !== -1) {
      // Update existing
      reels[existingIdx] = { ...reels[existingIdx], ...reel };
    } else {
      // Create new
      const newReel = {
        ...reel,
        id: reel.id || `reel_${Date.now()}`,
        views: reel.views || "10K"
      };
      reels.push(newReel);
    }

    saveReels(reels);
    res.json({ success: true, reels });
  } catch (err) {
    res.status(500).json({ error: "فشل حفظ بيانات الفيديو." });
  }
});

// Delete Reference Reel
app.delete("/api/reels/:id", (req, res) => {
  try {
    const { auth } = req.query;
    if (auth !== "domya2026") {
      return res.status(401).json({ error: "غير مصرح." });
    }

    const { id } = req.params;
    let reels = loadReels();
    reels = reels.filter((r: any) => r.id !== id);
    saveReels(reels);

    res.json({ success: true, reels });
  } catch (err) {
    res.status(500).json({ error: "فشل حذف الفيديو." });
  }
});

// 3. Admin CRM Fetch API
app.get("/api/submissions", (req, res) => {
  try {
    const { auth } = req.query;
    if (auth !== "domya2026") {
      return res.status(401).json({ error: "رمز الدخول غير صالح للوصول إلى لوحة التحكم." });
    }
    const submissions = loadSubmissions();
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: "فشل تحميل البيانات." });
  }
});

// 4. Update Submission Status
app.post("/api/submissions/status", (req, res) => {
  try {
    const { auth, id, status } = req.body;
    if (auth !== "domya2026") {
      return res.status(401).json({ error: "غير مصرح." });
    }
    const submissions = loadSubmissions();
    const index = submissions.findIndex((s: any) => s.id === id);
    if (index !== -1) {
      submissions[index].status = status;
      saveSubmissions(submissions);
      return res.json({ success: true, submission: submissions[index] });
    }
    res.status(404).json({ error: "الطلب غير موجود." });
  } catch (err) {
    res.status(500).json({ error: "فشل تحديث الحالة." });
  }
});

// 5. Update Submission Notes
app.post("/api/submissions/notes", (req, res) => {
  try {
    const { auth, id, notes } = req.body;
    if (auth !== "domya2026") {
      return res.status(401).json({ error: "غير مصرح." });
    }
    const submissions = loadSubmissions();
    const index = submissions.findIndex((s: any) => s.id === id);
    if (index !== -1) {
      submissions[index].notes = notes;
      saveSubmissions(submissions);
      return res.json({ success: true, submission: submissions[index] });
    }
    res.status(404).json({ error: "الطلب غير موجود." });
  } catch (err) {
    res.status(500).json({ error: "فشل تحديث الملاحظات." });
  }
});

// Start server
async function startServer() {
  // Integrate Vite for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        watch: { usePolling: true }
      },
      appType: "spa",
      optimizeDeps: { force: true }
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted with force-reload.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
