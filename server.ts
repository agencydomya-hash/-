
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.set("trust proxy", true); // Trust the reverse proxy (Cloud Run load balancer) to parse secure/https correctly
const PORT = 3000;

// Reusable helper to dynamically construct the redirect URI based on client request
const getRedirectUri = (req: express.Request): string => {
  const host = req.get("host") || "";
  // Check if we are running in local development mode or accessed locally
  if (host.includes("localhost") || host.includes("127.0.0.1") || process.env.NODE_ENV !== "production") {
    return `http://localhost:3000/api/google/callback`;
  }
  const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
  return `${protocol}://${host}/api/google/callback`;
};

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Serve custom uploads directory
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (err) {
  console.warn("Could not create uploads directory (expected on Vercel):", err);
}
app.use("/uploads", express.static(UPLOADS_DIR));

// Data file paths
const SUBMISSIONS_FILE = path.join(process.cwd(), "submissions.json");
const DIAGNOSES_FILE = path.join(process.cwd(), "diagnoses.json");

// Helper to load submissions
function loadSubmissions() {
  try {
    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      try {
        fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
      } catch (e) {
        console.warn("Could not write submissions default placeholder:", e);
      }
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
      try {
        fs.writeFileSync(DIAGNOSES_FILE, JSON.stringify([], null, 2));
      } catch (e) {
        console.warn("Could not write diagnoses default placeholder:", e);
      }
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
      try {
        fs.writeFileSync(REELS_FILE, JSON.stringify(DEFAULT_REELS, null, 2));
      } catch (e) {
        console.warn("Could not write default reels placeholder:", e);
      }
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

// Google OAuth Application Credentials (provided by environment variables)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

// Auto-refreshes Google Access Token if a refresh token is present
async function refreshGoogleAccessToken(): Promise<string | null> {
  const config = loadGoogleConfig();
  if (!config.refreshToken) {
    console.log("[Google API] No refresh token found, cannot refresh access token.");
    return null;
  }

  try {
    console.log("[Google API] Attempting to refresh access token using refresh token...");
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const params = new URLSearchParams();
    params.append("client_id", GOOGLE_CLIENT_ID);
    params.append("client_secret", GOOGLE_CLIENT_SECRET);
    params.append("refresh_token", config.refreshToken);
    params.append("grant_type", "refresh_token");

    const tokenRes = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    if (!tokenRes.ok) {
      console.error("[Google API] Token refresh request failed:", await tokenRes.text());
      return null;
    }

    const tokens = await tokenRes.json();
    config.accessToken = tokens.access_token;
    saveGoogleConfig(config);
    console.log("[Google API] Access token refreshed successfully.");
    return tokens.access_token;
  } catch (err) {
    console.error("[Google API] Error refreshing Google access token:", err);
    return null;
  }
}

// Unified Google Sheets row sync helper (handles token expiry automatically)
async function syncToGoogleSheets(rowValues: any[]): Promise<boolean> {
  const config = loadGoogleConfig();
  if (!config.spreadsheetId || !config.accessToken) {
    return false;
  }

  const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`;
  
  try {
    let response = await fetch(sheetUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        values: [rowValues]
      })
    });

    if (response.status === 401) {
      console.log("[Google API] Access token unauthorized (likely expired). Refreshing...");
      const newTok = await refreshGoogleAccessToken();
      if (newTok) {
        response = await fetch(sheetUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${newTok}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            values: [rowValues]
          })
        });
      }
    }

    return response.ok;
  } catch (err) {
    console.error("[Google API] Google Sheets API error:", err);
    return false;
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
    const { name, specialty, clinicDetails, struggle, targetAudience, email, phone, clinicName, city } = req.body;

    if (!name || !specialty || !struggle) {
      return res.status(400).json({ error: "الرجاء إدخال الاسم، التخصص، والمشكلة الأساسية." });
    }

    let finalDiagnosis: any;
    let ai;

    try {
      ai = getAiClient();
      const systemInstruction = `أنت خبير براندنج تسويقي طبي محترف تعمل لدى وكالة "دوميا" (Domya Marketing Agency).
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
      finalDiagnosis = {
        id: `diag_${Date.now()}`,
        patientName: name,
        specialty,
        ...diagnosisData,
        createdAt: new Date().toISOString()
      };
    } catch (apiErr: any) {
      console.error("Gemini/AI execution fallback:", apiErr.message);
      finalDiagnosis = {
        id: `diag_${Date.now()}`,
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
      };
    }

    // Save diagnosis history
    const diagnoses = loadDiagnoses();
    diagnoses.push(finalDiagnosis);
    saveDiagnoses(diagnoses);

    // --- EMAIL AUTOMATION FLOW ---
    
    // 1. Send Email to Doctor
    if (email) {
      const docSubject = "روشتة حضورك الرقمي جاهزة 🩺";
      const docBody = `أهلاً دكتور ${name}،
شكراً لتسجيلك معنا في منصة دوميا للنمو الرقمي للأطباء.

تم إعداد روشتة حضورك الرقمي المخصصة لعيادتك بنجاح:

=== الأعراض المكتشفة في حضورك الحالي ===
${finalDiagnosis.symptoms.map((s: string) => `• ${s}`).join("\n")}

=== الخدمات المقترحة لنمو عيادتك ===
${finalDiagnosis.prescriptionRx.map((r: string) => `• ${r}`).join("\n")}

=== خطة العمل المخصصة لعلاج المشكلة ===
${finalDiagnosis.actionSteps.map((a: string) => `• ${a}`).join("\n")}

🎁 عرض خاص بمناسبة تسجيلك هذا الشهر:
احصل على خصم فوري 20% على باقة الإنتاج وتصوير الميديا الأولى لعيادتك عند تأكيد حجزك اليوم!

يمكنك حجز استشارتك المجانية أو التحدث معنا مباشرة:
الهاتف والواتساب: +201090121000
البريد الإلكتروني: domyaadv@gmail.com

مع خالص التمنيات بالشفاء والنمو الرقمي لعيادتك،
فريق وكالة دوميا التسويقية`;

      sendRealEmail(email, docSubject, docBody).catch(err => console.error("Email to doctor failed:", err));
    }

    // 2. Send Email to Agency Admin
    const ownerEmail = "domyaadv@gmail.com";
    const ownerSubject = `تسجيل تشخيص جديد من د. ${name} — ${specialty}`;
    const ownerBody = `🚨 تم استقبال تشخيص حضور رقمي جديد:
الاسم: د. ${name}
التخصص: ${specialty}
البريد الإلكتروني: ${email || "غير محدد"}
الهاتف: ${phone || "غير محدد"}
العيادة: ${clinicName || "غير محدد"}
المدينة: ${city || "غير محدد"}
التحدي الأساسي: ${struggle}

=== التشخيص المقترح ===
الأعراض:
${finalDiagnosis.symptoms.join("\n")}
الروشتة:
${finalDiagnosis.prescriptionRx.join("\n")}`;

    sendRealEmail(ownerEmail, ownerSubject, ownerBody).catch(err => console.error("Email to agency failed:", err));

    res.json(finalDiagnosis);
  } catch (err: any) {
    console.error("Diagnosis error:", err);
    res.status(500).json({ error: "حدث خطأ أثناء إعداد الروشتة العلاجية الرقمية. برجاء المحاولة مرة أخرى." });
  }
});

// Helper for sending real emails using Gmail API or SMTP fallback
async function sendRealEmail(to: string, subject: string, body: string) {
  const gConfig = loadGoogleConfig();
  let sentSuccessfully = false;
  let methodUsed = "none";

  // Method 1: Try sending using the Gmail API (Google OAuth Token)
  if (gConfig.accessToken) {
    try {
      console.log(`[Gmail API] Attempting to send email to ${to}...`);
      
      const buildMimeMessage = (toAddr: string, subj: string, txt: string) => {
        const utf8Subject = `=?utf-8?B?${Buffer.from(subj).toString('base64')}?=`;
        const parts = [
          `To: ${toAddr}`,
          `Subject: ${utf8Subject}`,
          'Content-Type: text/plain; charset=utf-8',
          'MIME-Version: 1.0',
          '',
          txt
        ];
        return Buffer.from(parts.join('\r\n'))
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
      };

      const sendMailCall = async (token: string) => {
        const rawMessage = buildMimeMessage(to, subject, body);
        return fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ raw: rawMessage })
        });
      };

      let response = await sendMailCall(gConfig.accessToken);

      // If token expired, refresh and retry once
      if (response.status === 401) {
        console.log("[Gmail API] Token unauthorized. Attempting refresh...");
        const newTok = await refreshGoogleAccessToken();
        if (newTok) {
          response = await sendMailCall(newTok);
        }
      }

      if (response.ok) {
        console.log(`[Gmail API] Email successfully sent to ${to}`);
        sentSuccessfully = true;
        methodUsed = "Gmail API";
      } else {
        console.error("[Gmail API] Send failed:", await response.text());
      }
    } catch (err) {
      console.error("[Gmail API] Exception during send:", err);
    }
  }

  // Method 2: Fallback to SMTP/Nodemailer if Gmail API failed or wasn't configured
  if (!sentSuccessfully && gConfig.smtpUser && gConfig.smtpPass) {
    try {
      console.log(`[SMTP] Attempting SMTP fallback to ${to}...`);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gConfig.smtpUser,
          pass: gConfig.smtpPass
        }
      });
      await transporter.sendMail({
        from: `"Domya Agency" <${gConfig.smtpUser}>`,
        to,
        subject,
        text: body
      });
      console.log(`[SMTP] Email successfully sent to ${to}`);
      sentSuccessfully = true;
      methodUsed = "SMTP";
    } catch (err) {
      console.error("[SMTP] Failed to send email via SMTP:", err);
    }
  }

  if (!sentSuccessfully) {
    console.log(`[SIMULATOR] Email simulation logged to file. (No working send method)`);
  }

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
    sentSuccessfully,
    methodUsed
  });
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
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

      const synced = await syncToGoogleSheets(rowValues);
      if (synced) {
        newSubmission.synced = true;
        // Save with updated sync status
        const updatedSubmissions = loadSubmissions();
        const subIdx = updatedSubmissions.findIndex((s: any) => s.id === newSubmission.id);
        if (subIdx !== -1) {
          updatedSubmissions[subIdx].synced = true;
          saveSubmissions(updatedSubmissions);
        }
      }
    } catch (sheetErr) {
      console.error("Google Sheets background sync error:", sheetErr);
    }

    // Try to sync with Google Forms / Apps Script Webhook in real-time
    const targetReceiver = gConfig.receiverEmail || "agencydomya@gmail.com";
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
    const doctorSubject = `✅ تأكيد استلام حجزك — وكالة دوميا للتسويق الطبي`;
    const doctorBody = `أهلاً دكتور ${name}،\n\nتم استلام طلب حجز الاستشارة التسويقية الخاص بك بنجاح.\nالتخصص: ${specialty}\nالعيادة: ${clinicName || 'غير محدد'}\nالهدف المختار: ${goal}\n\nسيقوم مستشار تسويق من فريق دوميا بالاتصال بك خلال 24 ساعة عمل لترتيب الخطوة القادمة وزيارة العيادة.\n\nمع خالص التحية،\nفريق وكالة دوميا\nagencydomya@gmail.com | +201090121000`;

    const agencySubject = `🚨 حجز جديد من طبيب: د. ${name} — ${specialty}`;
    const agencyBody = `=== بيانات الطبيب الجديد ===\nالاسم: د. ${name}\nالتخصص: ${specialty}\nاسم العيادة: ${clinicName || 'غير محدد'}\nالهاتف: ${phone}\nالبريد الإلكتروني: ${email || 'غير محدد'}\nرابط السوشيال ميديا: ${socialLink || 'غير محدد'}\nالهدف التسويقي: ${goal}\nرقم التشخيص المرتبط: ${diagnosisId || 'لا يوجد'}\n\n=== إجراء مطلوب ===\nيرجى الاتصال بالطبيب خلال 24 ساعة عمل.`;

    // 1. To doctor
    if (email && email !== "غير محدد") {
      await sendRealEmail(email, doctorSubject, doctorBody);
    }
    // 2. To agency (configured email)
    await sendRealEmail(targetReceiver, agencySubject, agencyBody);

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
      receiverEmail: receiverEmail || "agencydomya@gmail.com",
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
      receiverEmail: config.receiverEmail || "agencydomya@gmail.com",
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
    const sheetId = config.spreadsheetId;

    if (!sheetId) {
      return res.status(400).json({ error: "لم يتم ربط جدول بيانات جوجل شيتس بعد." });
    }

    // Update config with fresh token if sent manually
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

        const synced = await syncToGoogleSheets(rowValues);
        if (synced) {
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

// Google OAuth Authorization Request URL
app.get("/api/google/auth-url", (req, res) => {
  try {
    const redirectUri = getRedirectUri(req);
    const authUrl = `https://accounts.google.com/o/oauth2/auth?` + 
      `client_id=${GOOGLE_CLIENT_ID}` + 
      `&redirect_uri=${encodeURIComponent(redirectUri)}` + 
      `&response_type=code` + 
      `&scope=${encodeURIComponent("https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/gmail.send")}` + 
      `&access_type=offline` + 
      `&prompt=consent`;
    res.json({ url: authUrl });
  } catch (err) {
    console.error("Auth URL generation error:", err);
    res.status(550).json({ error: "Failed to generate authorization URL" });
  }
});

// Google OAuth Authorization Code Callback
app.get("/api/google/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("Authorization code is missing.");
  }

  const redirectUri = getRedirectUri(req);

  try {
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const params = new URLSearchParams();
    params.append("code", code as string);
    params.append("client_id", GOOGLE_CLIENT_ID);
    params.append("client_secret", GOOGLE_CLIENT_SECRET);
    params.append("redirect_uri", redirectUri);
    params.append("grant_type", "authorization_code");

    const tokenRes = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      throw new Error(`Token exchange failed: ${errText}`);
    }

    const tokens = await tokenRes.json();
    const { access_token, refresh_token } = tokens;

    // Save to google_config.json
    const config = loadGoogleConfig();
    config.accessToken = access_token;
    if (refresh_token) {
      config.refreshToken = refresh_token;
    }
    saveGoogleConfig(config);

    console.log("[Google OAuth] Successfully authorized with client secret and stored refresh token.");

    // Redirect back to front-end admin dashboard tab
    res.redirect("/?google_auth_success=true&tab=integrations");
  } catch (err: any) {
    console.error("OAuth callback error:", err);
    res.status(500).send(`Failed to authenticate with Google: ${err.message}`);
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

// Partners Logo Ticker Endpoints
const PARTNERS_FILE = path.join(process.cwd(), "partners.json");
const loadPartners = (): string[] => {
  if (!fs.existsSync(PARTNERS_FILE)) {
    return [
      "/uploads/logo_dummy_1.png",
      "/uploads/logo_dummy_2.png",
      "/uploads/logo_dummy_3.png",
      "/uploads/logo_dummy_4.png",
      "/uploads/logo_dummy_5.png"
    ];
  }
  try {
    return JSON.parse(fs.readFileSync(PARTNERS_FILE, "utf8"));
  } catch (err) {
    return [];
  }
};
const savePartners = (partners: string[]) => {
  fs.writeFileSync(PARTNERS_FILE, JSON.stringify(partners, null, 2), "utf8");
};

app.get("/api/partners", (req, res) => {
  try {
    res.json(loadPartners());
  } catch (err) {
    res.status(500).json({ error: "فشل تحميل قائمة الشركاء." });
  }
});

app.post("/api/partners", (req, res) => {
  try {
    const { auth, partners } = req.body;
    if (auth !== "domya2026") {
      return res.status(401).json({ error: "غير مصرح." });
    }
    if (!Array.isArray(partners)) {
      return res.status(400).json({ error: "تنسيق البيانات غير صحيح." });
    }
    savePartners(partners);
    res.json({ success: true, partners });
  } catch (err) {
    res.status(500).json({ error: "فشل حفظ قائمة الشركاء." });
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

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
  });
}

export default app;
