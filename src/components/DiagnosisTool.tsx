import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle, ArrowRight, ArrowLeft, Star, Phone } from 'lucide-react';
import { DiagnosisInput, DiagnosisOutput } from '../types';
import { translations } from '../translations';

interface DiagnosisToolProps {
  onDiagnosisComplete: (diagnosis: DiagnosisOutput) => void;
  onSelectBookingWithDiagnosis: (diagnosis: DiagnosisOutput) => void;
  lang?: 'ar' | 'en';
}

const getSpecialties = (isEn: boolean) => [
  isEn ? "Orthopedics & Joint Surgery" : "جراحة العظام والمفاصل",
  isEn ? "Dermatology, Aesthetics & Laser" : "الجلدية والتجميل والليزر",
  isEn ? "Dental & Oral Surgery" : "طب وجراحة الأسنان",
  isEn ? "Pediatrics & Neonatology" : "طب الأطفال وحديثي الولادة",
  isEn ? "Obstetrics & Gynecology" : "أمراض النساء والتوليد",
  isEn ? "Internal Medicine & Cardiology" : "الباطنة والقلب والأوعية الدموية",
  isEn ? "Ophthalmology & Eye Surgery" : "طب وجراحة العيون",
  isEn ? "Clinical Nutrition & Dietetics" : "تغذية علاجية وتخسيس",
];

const getStruggles = (isEn: boolean) => [
  { id: "no_time", label: isEn ? "No time to film or prepare medical content" : "مفيش وقت للتصوير والتحضير للمحتوى الطبي" },
  { id: "poor_quality", label: isEn ? "Video quality or editing does not look professional" : "جودة التصوير والمونتاج مش احترافية" },
  { id: "dont_know_how", label: isEn ? "I don't know how to start or talk in front of the camera" : "مش عارف أبدأ إزاي وأتكلم إزاي قدام الكاميرا" },
  { id: "complex_info", label: isEn ? "Difficulty simplifying medical info without being boring" : "صعوبة في تبسيط المعلومة الطبية بدون ملل" },
  { id: "no_results", label: isEn ? "I post many videos but get no patient bookings" : "بصوّر فيديوهات كتير بس مفيش حجوزات للمرضى" },
];

const getTestimonials = (isEn: boolean) => [
  {
    name: isEn ? "Dr. Mahmoud El-Ezaby" : "د. محمود العزبي",
    specialty: isEn ? "Orthopedic Surgeon" : "جراح عظام",
    stars: 5,
    quote: isEn ? "After a month with DOMYA, my clinic filled up with new patient appointments. The videos and content were world-class." : "بعد شهر مع دوميا، عيادتي اتملأت بمواعيد من مرضى جدد. التصوير والمحتوى كان على مستوى عالمي.",
    result: isEn ? "+120% bookings" : "+120% في الحجوزات"
  },
  {
    name: isEn ? "Dr. Fatima El-Sayed" : "د. فاطمة السيد",
    specialty: isEn ? "Dermatologist" : "أخصائية جلدية وتجميل",
    stars: 5,
    quote: isEn ? "I was afraid medical content would feel dry, but DOMYA created engaging yet highly respected professional content." : "كنت خايفة إن المحتوى الطبي يبقى جاف، لكن دوميا عملت محتوى بيجذب المريض ومحترم في نفس الوقت.",
    result: isEn ? "+200% views" : "+200% في المشاهدات"
  },
  {
    name: isEn ? "Dr. Ahmed Nabil" : "د. أحمد نبيل",
    specialty: isEn ? "Dentist" : "طبيب أسنان",
    stars: 5,
    quote: isEn ? "In just 30 days, I ranked first on Google Maps local search. DOMYA truly changed my practice's trajectory." : "في 30 يوم بس، ظهرت على أول نتيجة في جوجل ماب لمنطقتي. دوميا فعلاً غيرت حياة عيادتي.",
    result: isEn ? "+85% followers" : "+85% نمو في المتابعين"
  }
];

const getLoadingMessages = (isEn: boolean) => [
  isEn ? "Checking your clinic's digital pulse..." : "جاري فحص النبض الرقمي لعيادتك...",
  isEn ? "Analyzing your medical digital engagement..." : "تحليل تفاعل حضورك الطبي الرقمي...",
  isEn ? "AI is writing your digital prescription now..." : "الذكاء الاصطناعي يكتب روشتك العلاجية الآن..."
];

export default function DiagnosisTool({ onDiagnosisComplete, onSelectBookingWithDiagnosis, lang = 'ar' }: DiagnosisToolProps & { lang?: 'ar' | 'en' }) {
  const [form, setForm] = useState<DiagnosisInput>({
    name: '',
    specialty: '',
    struggle: '',
    clinicDetails: '',
    targetAudience: '',
    email: '',
    phone: '',
    clinicName: '',
    city: ''
  });

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const isEn = lang === 'en';
  const commonSpecialties = getSpecialties(isEn);
  const commonStruggles = getStruggles(isEn);
  const testimonials = getTestimonials(isEn);
  const loadingMessages = getLoadingMessages(isEn);

  const [result, setResult] = useState<DiagnosisOutput | null>(() => {
    const saved = localStorage.getItem('domya_doctor_diagnosis');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          onDiagnosisComplete(parsed);
        }, 100);
        return parsed;
      } catch (err) {
        return null;
      }
    }
    return null;
  });
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectStruggle = (label: string) => {
    setForm(prev => ({ ...prev, struggle: label }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!form.name.trim()) {
        setError(isEn ? "Please write your name." : "برجاء كتابة اسمك الكريم.");
        return;
      }
      if (!form.specialty) {
        setError(isEn ? "Please select your medical specialty." : "برجاء اختيار تخصصك الطبي.");
        return;
      }
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.specialty || !form.struggle) {
      setError(isEn ? "Please enter your name, specialty, and choose your primary struggle." : "برجاء إدخال اسمك، تخصصك، واختيار التحدي الأبرز.");
      return;
    }

    setError('');
    setLoading(true);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      clearInterval(interval);

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        localStorage.setItem('domya_doctor_diagnosis', JSON.stringify(data));
        onDiagnosisComplete(data);
      } else {
        const errData = await response.json();
        setError(errData.error || (isEn ? "Failed to generate your digital Rx." : "فشل إعداد روشتتك العلاجية الرقمية."));
      }
    } catch (err) {
      clearInterval(interval);
      setError(isEn ? "Server connection error." : "خطأ في الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-[#2C3E50] dark:text-slate-100 text-base md:text-sm font-semibold transition placeholder-slate-400 dark:placeholder-slate-600";
  const labelClass = "block text-xs font-bold text-[#2C3E50] dark:text-slate-355 mb-1.5";

  return (
    <div className="py-20 bg-gradient-to-br from-[#F0F4F8] to-[#E0E7FF] dark:from-slate-950 dark:to-indigo-950 text-[#2C3E50] dark:text-slate-200 relative z-10 transition-colors" id="diagnosis-section">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Header */}
        <div className={`text-center mb-10 space-y-3 ${isEn ? 'text-left lg:text-center' : 'text-right lg:text-center'}`} dir={isEn ? "ltr" : "rtl"}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/25 text-[#FF6B35] rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? "Instant Medical Presence Audit" : "فحص الحضور الطبي الفوري"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-sans font-black text-[#003D7A] dark:text-white">
            {isEn ? "Get Your Digital Presence Rx in 1 Minute 🩺" : "احصل على روشتة حضورك الرقمي في دقيقة 🩺"}
          </h2>
          <div className={`flex flex-wrap justify-center gap-x-5 gap-y-1 text-[#10B981] text-xs font-bold`} dir={isEn ? "ltr" : "rtl"}>
            <span>{isEn ? "✓ Detailed condition diagnosis" : "✓ تشخيص مفصل لحالتك"}</span>
            <span>{isEn ? "✓ Services you need most" : "✓ الخدمات التي تحتاجها أكثر"}</span>
            <span>{isEn ? "✓ Free instant content plan" : "✓ خطة محتوى فورية مجاناً"}</span>
          </div>
          <p className="text-[#2C3E50] dark:text-slate-300 text-xs sm:text-sm font-semibold">
            {isEn 
              ? "Answer a few questions and our AI will immediately generate your clinic branding diagnosis and Reels content plan."
              : "أجب عن بضعة أسئلة وسيقوم الذكاء الاصطناعي بتحرير تشخيصك الطبي التسويقي وخطة Reels فوراً."
            }
          </p>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px] shadow-sm"
            >
              <div className="w-12 h-12 border-4 border-slate-100 dark:border-slate-850 border-t-[#FF6B35] rounded-full animate-spin"></div>
              <motion.p
                key={loadingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-base font-bold text-[#003D7A] dark:text-white"
              >
                {loadingMessages[loadingStep]}
              </motion.p>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                {isEn ? "AI is analyzing your clinic data..." : "الذكاء الاصطناعي يحلل بيانات عيادتك..."}
              </p>
            </motion.div>
          ) : result ? (
            /* SUCCESS SCREEN WITH TESTIMONIALS */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              id="diagnosis-results"
            >
              {/* Prescription Output Card */}
              <div className={`bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-3xl overflow-hidden shadow-md ${isEn ? 'text-left' : 'text-right'}`}>
                {/* Top accent bar */}
                <div className="h-1.5 bg-[#FF6B35]" />
                
                {/* Success banner */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-b border-emerald-100 dark:border-emerald-900/35 px-6 py-4 flex items-center justify-between" dir={isEn ? "ltr" : "rtl"}>
                  <div>
                    <h3 className="text-lg font-black text-[#003D7A] dark:text-white">
                      {isEn ? "Thank you! 🎉 Your clinic details received" : "شكراً! 🎉 تم استقبال بيانات عيادتك بنجاح"}
                    </h3>
                    <p className="text-xs text-[#10B981] font-bold mt-0.5">
                      {isEn ? "DOMYA team will contact you within 24 hours" : "سيتواصل معك فريق دوميا خلال 24 ساعة"}
                    </p>
                  </div>
                  <span className="px-3 py-1.5 bg-[#10B981]/15 text-[#10B981] rounded-lg text-xs font-bold border border-[#10B981]/25 whitespace-nowrap">
                    {isEn ? "Rx Ready ✓" : "روشتتك جاهزة ✓"}
                  </span>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Doctor details */}
                  <div className="bg-[#F0F4F8] dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 text-xs font-semibold text-[#2C3E50] dark:text-slate-300" dir={isEn ? "ltr" : "rtl"}>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[9px] mb-0.5 uppercase">
                        {isEn ? "Doctor:" : "الطبيب:"}
                      </span>
                      <span className="text-[#003D7A] dark:text-white font-bold">
                        {isEn ? "" : "د. "}{result.patientName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[9px] mb-0.5 uppercase">
                        {isEn ? "Specialty:" : "التخصص:"}
                      </span>
                      <span className="text-[#003D7A] dark:text-white font-bold">{result.specialty}</span>
                    </div>
                  </div>

                  <div className="space-y-4" dir={isEn ? "ltr" : "rtl"}>
                    {/* Diagnosis */}
                    <div>
                      <h4 className={`text-xs font-bold text-[#FF6B35] ${isEn ? 'border-l-2 pl-1.5' : 'border-r-2 pr-1.5'} border-[#FF6B35] mb-1.5`}>
                        {isEn ? "Suggested Digital Diagnosis:" : "التشخيص الرقمي المقترح:"}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#2C3E50] dark:text-slate-355 leading-relaxed font-semibold bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-100 dark:border-red-900/35">
                        {result.symptoms[0]}
                      </p>
                    </div>

                    {/* Prescription */}
                    <div>
                      <h4 className={`text-xs font-bold text-[#FF6B35] ${isEn ? 'border-l-2 pl-1.5' : 'border-r-2 pr-1.5'} border-[#FF6B35] mb-1.5`}>
                        {isEn ? "Suggested Digital Prescription (Rx):" : "الروشتة العلاجية المقترحة (Rx):"}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#2C3E50] dark:text-slate-355 leading-relaxed font-semibold bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-100 dark:border-orange-900/35">
                        {result.prescriptionRx[0]}
                      </p>
                    </div>

                    {/* Reels Topics */}
                    <div>
                      <h4 className={`text-xs font-bold text-[#10B981] ${isEn ? 'border-l-2 pl-1.5' : 'border-r-2 pr-1.5'} border-[#10B981] mb-1.5`}>
                        {isEn ? "Suggested Reels Video Ideas to Start Immediately:" : "أفكار الـ Reels المقترحة للبدء فوراً:"}
                      </h4>
                      <ul className="space-y-1.5">
                        {result.contentPlan.topics.map((topic, idx) => (
                          <li key={idx} className="bg-emerald-50 dark:bg-emerald-950/20 text-xs sm:text-sm text-[#2C3E50] dark:text-slate-300 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/35 flex items-start gap-2 font-semibold">
                            <CheckCircle className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between" dir={isEn ? "ltr" : "rtl"}>
                    <button
                      onClick={() => {
                        localStorage.removeItem('domya_doctor_diagnosis');
                        setResult(null);
                        setStep(1);
                        onDiagnosisComplete(null as any);
                      }}
                      className="text-xs text-slate-400 hover:text-[#FF6B35] font-bold transition flex items-center gap-1 cursor-pointer order-2 sm:order-1"
                    >
                      {isEn ? (
                        <>
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Restart Diagnosis & Audit</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>إعادة الفحص والتشخيص</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onSelectBookingWithDiagnosis(result)}
                      className="w-full sm:w-auto px-6 py-3 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20 order-1 sm:order-2 cursor-pointer"
                    >
                      <span>
                        {isEn ? "Apply this Rx to Booking Form 📲" : "تطبيق هذه الروشتة في استمارة الحجز 📲"}
                      </span>
                      {isEn ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="text-center space-y-3" dir={isEn ? "ltr" : "rtl"}>
                <p className="text-sm font-bold text-[#2C3E50] dark:text-slate-300">
                  {isEn ? "Waiting? Chat with us directly now 👇" : "في الانتظار؟ تحدث معنا الآن مباشرة 👇"}
                </p>
                <a
                  href="https://wa.me/201090121000?text=مرحباً%20دوميا%2C%20أريد%20معرفة%20المزيد%20عن%20خدماتكم"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-xl transition shadow-md shadow-emerald-500/20 text-sm cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>{isEn ? "Waiting? Chat with us now →" : "في الانتظار؟ تحدث معنا الآن →"}</span>
                </a>
              </div>

              {/* Testimonials */}
              <div dir={isEn ? "ltr" : "rtl"}>
                <h3 className="text-lg font-black text-[#003D7A] dark:text-white text-center mb-6">
                  {isEn ? "Doctors who succeeded right after joining us ⭐" : "أطباء نجحوا بعدنا مباشرةً ⭐"}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {testimonials.map((t, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className={`space-y-1.5 flex-1 ${isEn ? 'text-left' : 'text-right'}`}>
                          <div className={`flex items-center gap-1 ${isEn ? 'justify-start' : 'justify-end'}`}>
                            {[...Array(t.stars)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                          <p className="text-sm font-semibold text-[#2C3E50] dark:text-slate-300 leading-relaxed">"{t.quote}"</p>
                          <div className={`flex items-center gap-3 ${isEn ? 'justify-start' : 'justify-end'}`}>
                            <div className={isEn ? "text-left" : "text-right"}>
                              <span className="text-xs font-black text-[#003D7A] dark:text-white block">{t.name}</span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{t.specialty}</span>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <span className="inline-block px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-[#10B981] font-bold text-xs rounded-lg border border-emerald-100 dark:border-emerald-900/35 whitespace-nowrap">
                            {t.result}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* QUESTION FORM */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-right space-y-6 shadow-md transition-colors"
            >
              {/* Progress Bar & Indicators */}
              <div className="mb-4" dir={isEn ? "ltr" : "rtl"}>
                <div className="flex justify-between items-center mb-2 text-xs font-bold text-[#003D7A] dark:text-white">
                  <span className="bg-[#003D7A]/10 dark:bg-slate-800 px-2 py-1 rounded-md">
                    {isEn ? `Step ${step} of 3` : `الخطوة ${step} من 3`}
                  </span>
                  <span>
                    {step === 1 
                      ? (isEn ? "🔬 Medical Identity" : "🔬 الهوية الطبية") 
                      : step === 2 
                        ? (isEn ? "📍 Clinic & Contact" : "📍 عيادتك واتصالك") 
                        : (isEn ? "⚠️ Primary Struggle" : "⚠️ التحدي الأبرز")
                    }
                  </span>
                </div>
                <div className="w-full h-2 bg-[#F0F4F8] dark:bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-[#FF6B35] transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/35 text-red-650 text-xs rounded-lg font-bold" dir={isEn ? "ltr" : "rtl"}>
                  {error}
                </div>
              )}

              <form onSubmit={(e) => e.preventDefault()} className="space-y-5" dir={isEn ? "ltr" : "rtl"}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5">
                        <label className={labelClass}>
                          {isEn ? "Doctor's Name *" : "اسم الطبيب الكريم *"}
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder={isEn ? "e.g., Dr. John Doe" : "مثال: د. محمد خالد"}
                          value={form.name}
                          onChange={handleInputChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelClass}>
                          {isEn ? "Medical Specialty *" : "التخصص الطبي *"}
                        </label>
                        <select
                          name="specialty"
                          value={form.specialty}
                          onChange={handleInputChange}
                          className={inputClass}
                        >
                          <option value="">{isEn ? "-- Select Specialty --" : "-- اختر التخصص --"}</option>
                          {commonSpecialties.map((spec, i) => (
                            <option key={i} value={spec}>{spec}</option>
                          ))}
                        </select>
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={nextStep}
                          className="w-full py-4 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/10"
                        >
                          <span>{isEn ? "Next Step: Clinic Info →" : "الخطوة التالية: معلومات العيادة ←"}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className={labelClass}>{isEn ? "Clinic Name" : "اسم العيادة"}</label>
                          <input
                            type="text"
                            name="clinicName"
                            placeholder={isEn ? "e.g., Al-Noor Medical Clinic" : "مثال: عيادة النور الطبية"}
                            value={form.clinicName}
                            onChange={handleInputChange}
                            className={inputClass}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className={labelClass}>{isEn ? "City" : "المدينة"}</label>
                          <input
                            type="text"
                            name="city"
                            placeholder={isEn ? "e.g., Cairo, Riyadh..." : "مثال: القاهرة، الإسكندرية..."}
                            value={form.city}
                            onChange={handleInputChange}
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className={labelClass}>{isEn ? "Phone / WhatsApp Number" : "رقم الهاتف / واتساب"}</label>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="01xxxxxxxxx"
                            value={form.phone}
                            onChange={handleInputChange}
                            className={inputClass}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className={labelClass}>{isEn ? "Email Address" : "البريد الإلكتروني"}</label>
                          <input
                            type="email"
                            name="email"
                            placeholder="doctor@example.com"
                            value={form.email}
                            onChange={handleInputChange}
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="w-1/3 py-4 bg-[#F0F4F8] dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-[#2C3E50] dark:text-slate-355 font-bold rounded-xl text-sm transition cursor-pointer"
                        >
                          <span>{isEn ? "Previous" : "السابق"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={nextStep}
                          className="w-2/3 py-4 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/10"
                        >
                          <span>{isEn ? "Next: Define Challenges →" : "التالي: حدد تحدياتك ←"}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <label className={labelClass}>
                          {isEn ? "Primary challenge facing your digital presence *" : "أبرز تحدي يواجه حضورك الطبي الرقمي حالياً *"}
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                          {commonStruggles.map((struggle) => (
                            <button
                              key={struggle.id}
                              type="button"
                              onClick={() => handleSelectStruggle(struggle.label)}
                              className={`w-full ${isEn ? 'text-left' : 'text-right'} p-3 rounded-xl border text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                                form.struggle === struggle.label
                                  ? 'bg-[#FF6B35]/15 border-[#FF6B35] text-[#FF6B35] shadow-sm'
                                  : 'bg-[#F0F4F8] dark:bg-slate-950 border-[#E5E7EB] dark:border-slate-800 text-[#2C3E50] dark:text-slate-300 hover:border-[#FF6B35]/50'
                              }`}
                            >
                              <span>{struggle.label}</span>
                              {form.struggle === struggle.label && <CheckCircle className="w-4 h-4 text-[#FF6B35]" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="w-1/3 py-4 bg-[#F0F4F8] dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-[#2C3E50] dark:text-slate-355 font-bold rounded-xl text-sm transition cursor-pointer"
                        >
                          <span>{isEn ? "Previous" : "السابق"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="w-2/3 py-4 bg-gradient-to-r from-orange-500 to-[#FF6B35] hover:from-orange-600 hover:to-[#E55A2B] text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/25 animate-pulse-subtle"
                        >
                          <span>{isEn ? "Start Instant Diagnosis 🩺" : "ابدأ التشخيص الفوري 🩺"}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-2">
                  {isEn ? "100% Free — No Obligation — Result in 1 minute" : "مجاني 100% — بدون التزام — النتيجة في دقيقة واحدة"}
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
