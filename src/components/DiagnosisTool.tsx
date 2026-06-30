
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle, ArrowRight, ArrowLeft, Star, Phone } from 'lucide-react';
import { DiagnosisInput, DiagnosisOutput } from '../types';

interface DiagnosisToolProps {
  onDiagnosisComplete: (diagnosis: DiagnosisOutput) => void;
  onSelectBookingWithDiagnosis: (diagnosis: DiagnosisOutput) => void;
}

const COMMON_SPECIALTIES = [
  "جراحة العظام والمفاصل",
  "الجلدية والتجميل والليزر",
  "طب وجراحة الأسنان",
  "طب الأطفال وحديثي الولادة",
  "أمراض النساء والتوليد",
  "الباطنة والقلب والأوعية الدموية",
  "طب وجراحة العيون",
  "تغذية علاجية وتخسيس",
];

const COMMON_STRUGGLES = [
  { id: "no_time", label: "مفيش وقت للتصوير والتحضير للمحتوى الطبي" },
  { id: "poor_quality", label: "جودة التصوير والمونتاج مش احترافية" },
  { id: "dont_know_how", label: "مش عارف أبدأ إزاي وأتكلم إزاي قدام الكاميرا" },
  { id: "complex_info", label: "صعوبة في تبسيط المعلومة الطبية بدون ملل" },
  { id: "no_results", label: "بصوّر فيديوهات كتير بس مفيش حجوزات للمرضى" },
];

const TESTIMONIALS = [
  {
    name: "د. محمود العزبي",
    specialty: "جراح عظام",
    stars: 5,
    quote: "بعد شهر مع دوميا، عيادتي اتملأت بمواعيد من مرضى جدد. التصوير والمحتوى كان على مستوى عالمي.",
    result: "+120% في الحجوزات"
  },
  {
    name: "د. فاطمة السيد",
    specialty: "أخصائية جلدية وتجميل",
    stars: 5,
    quote: "كنت خايفة إن المحتوى الطبي يبقى جاف، لكن دوميا عملت محتوى بيجذب المريض ومحترم في نفس الوقت.",
    result: "+200% في المشاهدات"
  },
  {
    name: "د. أحمد نبيل",
    specialty: "طبيب أسنان",
    stars: 5,
    quote: "في 30 يوم بس، ظهرت على أول نتيجة في جوجل ماب لمنطقتي. دوميا فعلاً غيرت حياة عيادتي.",
    result: "+85% نمو في المتابعين"
  }
];

export default function DiagnosisTool({ onDiagnosisComplete, onSelectBookingWithDiagnosis }: DiagnosisToolProps) {
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

  const loadingMessages = [
    "جاري فحص النبض الرقمي لعيادتك...",
    "تحليل تفاعل حضورك الطبي الرقمي...",
    "الذكاء الاصطناعي يكتب روشتك العلاجية الآن..."
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectStruggle = (label: string) => {
    setForm(prev => ({ ...prev, struggle: label }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.specialty || !form.struggle) {
      setError("برجاء إدخال اسمك، تخصصك، واختيار التحدي الأبرز.");
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
        setError(errData.error || "فشل إعداد روشتتك العلاجية الرقمية.");
      }
    } catch (err) {
      clearInterval(interval);
      setError("خطأ في الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-[#2C3E50] text-sm font-semibold transition placeholder-slate-400";
  const labelClass = "block text-xs font-bold text-[#2C3E50] mb-1.5";

  return (
    <div className="py-20 bg-gradient-to-br from-[#F0F4F8] to-[#E0E7FF] text-[#2C3E50] relative z-10" id="diagnosis-section">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-3" dir="rtl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/25 text-[#FF6B35] rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>فحص الحضور الطبي الفوري</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-sans font-black text-[#003D7A]">
            احصل على روشتة حضورك الرقمي في دقيقة 🩺
          </h2>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[#10B981] text-xs font-bold" dir="rtl">
            <span>✓ تشخيص مفصل لحالتك</span>
            <span>✓ الخدمات التي تحتاجها أكثر</span>
            <span>✓ خطة محتوى فورية مجاناً</span>
          </div>
          <p className="text-[#2C3E50] text-xs sm:text-sm font-semibold">
            أجب عن بضعة أسئلة وسيقوم الذكاء الاصطناعي بتحرير تشخيصك الطبي التسويقي وخطة Reels فوراً.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border border-[#E5E7EB] rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px] shadow-sm"
            >
              <div className="w-12 h-12 border-4 border-slate-100 border-t-[#FF6B35] rounded-full animate-spin"></div>
              <motion.p
                key={loadingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-base font-bold text-[#003D7A]"
              >
                {loadingMessages[loadingStep]}
              </motion.p>
              <p className="text-xs text-slate-400 font-semibold">الذكاء الاصطناعي يحلل بيانات عيادتك...</p>
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
              <div className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-md text-right">
                {/* Top accent bar */}
                <div className="h-1.5 bg-[#FF6B35]" />
                
                {/* Success banner */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 px-6 py-4 flex items-center justify-between" dir="rtl">
                  <div>
                    <h3 className="text-lg font-black text-[#003D7A]">شكراً! 🎉 تم استقبال بيانات عيادتك بنجاح</h3>
                    <p className="text-xs text-[#10B981] font-bold mt-0.5">سيتواصل معك فريق دوميا خلال 24 ساعة</p>
                  </div>
                  <span className="px-3 py-1.5 bg-[#10B981]/15 text-[#10B981] rounded-lg text-xs font-bold border border-[#10B981]/25 whitespace-nowrap">
                    روشتتك جاهزة ✓
                  </span>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Doctor details */}
                  <div className="bg-[#F0F4F8] p-3.5 rounded-xl border border-slate-100 grid grid-cols-2 gap-4 text-xs font-semibold text-[#2C3E50]" dir="rtl">
                    <div>
                      <span className="text-slate-400 block text-[9px] mb-0.5 uppercase">الطبيب:</span>
                      <span className="text-[#003D7A] font-bold">د. {result.patientName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] mb-0.5 uppercase">التخصص:</span>
                      <span className="text-[#003D7A] font-bold">{result.specialty}</span>
                    </div>
                  </div>

                  <div className="space-y-4" dir="rtl">
                    {/* Diagnosis */}
                    <div>
                      <h4 className="text-xs font-bold text-[#FF6B35] border-r-2 border-[#FF6B35] pr-1.5 mb-1.5">التشخيص الرقمي المقترح:</h4>
                      <p className="text-xs sm:text-sm text-[#2C3E50] leading-relaxed font-semibold bg-red-50 p-3 rounded-lg border border-red-100">
                        {result.symptoms[0]}
                      </p>
                    </div>

                    {/* Prescription */}
                    <div>
                      <h4 className="text-xs font-bold text-[#FF6B35] border-r-2 border-[#FF6B35] pr-1.5 mb-1.5">الروشتة العلاجية المقترحة (Rx):</h4>
                      <p className="text-xs sm:text-sm text-[#2C3E50] leading-relaxed font-semibold bg-orange-50 p-3 rounded-lg border border-orange-100">
                        {result.prescriptionRx[0]}
                      </p>
                    </div>

                    {/* Reels Topics */}
                    <div>
                      <h4 className="text-xs font-bold text-[#10B981] border-r-2 border-[#10B981] pr-1.5 mb-1.5">أفكار الـ Reels المقترحة للبدء فوراً:</h4>
                      <ul className="space-y-1.5">
                        {result.contentPlan.topics.map((topic, idx) => (
                          <li key={idx} className="bg-emerald-50 text-xs sm:text-sm text-[#2C3E50] p-2.5 rounded-lg border border-emerald-100 flex items-start gap-2 font-semibold">
                            <CheckCircle className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between" dir="rtl">
                    <button
                      onClick={() => {
                        localStorage.removeItem('domya_doctor_diagnosis');
                        setResult(null);
                        onDiagnosisComplete(null as any);
                      }}
                      className="text-xs text-slate-400 hover:text-[#FF6B35] font-bold transition flex items-center gap-1 cursor-pointer order-2 sm:order-1"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>إعادة الفحص والتشخيص</span>
                    </button>

                    <button
                      onClick={() => onSelectBookingWithDiagnosis(result)}
                      className="w-full sm:w-auto px-6 py-3 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20 order-1 sm:order-2 cursor-pointer"
                    >
                      <span>تطبيق هذه الروشتة في استمارة الحجز 📲</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="text-center space-y-3" dir="rtl">
                <p className="text-sm font-bold text-[#2C3E50]">في الانتظار؟ تحدث معنا الآن مباشرة 👇</p>
                <a
                  href="https://wa.me/201090121000?text=مرحباً%20دوميا%2C%20أريد%20معرفة%20المزيد%20عن%20خدماتكم"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-xl transition shadow-md shadow-emerald-500/20 text-sm cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>في الانتظار؟ تحدث معنا الآن →</span>
                </a>
              </div>

              {/* Testimonials */}
              <div dir="rtl">
                <h3 className="text-lg font-black text-[#003D7A] text-center mb-6">أطباء نجحوا بعدنا مباشرةً ⭐</h3>
                <div className="grid grid-cols-1 gap-4">
                  {TESTIMONIALS.map((t, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {[...Array(t.stars)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                          <p className="text-sm font-semibold text-[#2C3E50] leading-relaxed">"{t.quote}"</p>
                          <div className="flex items-center gap-3 justify-end">
                            <div className="text-right">
                              <span className="text-xs font-black text-[#003D7A] block">{t.name}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">{t.specialty}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="inline-block px-2.5 py-1 bg-emerald-50 text-[#10B981] font-bold text-xs rounded-lg border border-emerald-100 whitespace-nowrap">
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
              className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 text-right space-y-6 shadow-md"
            >
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg font-bold" dir="rtl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
                {/* Row 1: Name + Specialty */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelClass}>اسم الطبيب الكريم *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="مثال: د. محمد خالد"
                      value={form.name}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>التخصص الطبي *</label>
                    <select
                      name="specialty"
                      value={form.specialty}
                      onChange={handleInputChange}
                      className={inputClass}
                    >
                      <option value="">-- اختر التخصص --</option>
                      {COMMON_SPECIALTIES.map((spec, i) => (
                        <option key={i} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelClass}>البريد الإلكتروني</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="doctor@example.com"
                      value={form.email}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>رقم الهاتف / واتساب</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="01xxxxxxxxx"
                      value={form.phone}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Row 3: Clinic Name + City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelClass}>اسم العيادة</label>
                    <input
                      type="text"
                      name="clinicName"
                      placeholder="مثال: عيادة النور الطبية"
                      value={form.clinicName}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>المدينة</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="مثال: القاهرة، الإسكندرية..."
                      value={form.city}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Struggles */}
                <div className="space-y-2">
                  <label className={labelClass}>أبرز تحدي يواجه حضورك الطبي الرقمي حالياً *</label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {COMMON_STRUGGLES.map((struggle) => (
                      <button
                        key={struggle.id}
                        type="button"
                        onClick={() => handleSelectStruggle(struggle.label)}
                        className={`w-full text-right p-3 rounded-xl border text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                          form.struggle === struggle.label
                            ? 'bg-[#FF6B35]/10 border-[#FF6B35] text-[#FF6B35]'
                            : 'bg-[#F0F4F8] border-[#E5E7EB] text-[#2C3E50] hover:border-[#FF6B35]/50'
                        }`}
                      >
                        <span>{struggle.label}</span>
                        {form.struggle === struggle.label && <CheckCircle className="w-4 h-4 text-[#FF6B35]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl text-sm transition duration-300 shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                    style={{ borderRadius: '8px' }}
                  >
                    <span>ابدأ التشخيص الرقمي الفوري 🩺</span>
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-semibold mt-2">مجاني 100% — بدون التزام — النتيجة في دقيقة واحدة</p>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
