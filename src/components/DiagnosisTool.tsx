/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Stethoscope, FileText, Printer, CheckCircle, HelpCircle, ArrowRight, PhoneCall } from 'lucide-react';
import { DiagnosisInput, DiagnosisOutput } from '../types';
import Logo from './Logo';

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
  { id: "poor_quality", label: "جودة التصوير والمونتاج مش سينمائية ولا تليق بمستواي" },
  { id: "dont_know_how", label: "مش عارف أبدأ إزاي وأتكلم إزاي قدام الكاميرا" },
  { id: "complex_info", label: "صعوبة في تبسيط وتوصيل المعلومة الطبية بدون ملل" },
  { id: "no_results", label: "بصوّر فيديوهات كتير بس مفيش حجوزات ولا تفاعل حقيقي" },
];

export default function DiagnosisTool({ onDiagnosisComplete, onSelectBookingWithDiagnosis }: DiagnosisToolProps) {
  const [form, setForm] = useState<DiagnosisInput>({
    name: '',
    specialty: '',
    clinicDetails: '',
    struggle: '',
    targetAudience: ''
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
    "جاري فحص النبض الرقمي لعيادتك الآن...",
    "تحليل أعراض ضعف التفاعل والمشاهدات على منصاتك...",
    "مقارنة تخصصك الطبي بالمنافسين في نطاقك الجغرافي...",
    "الذكاء الاصطناعي يحرر الآن الروشتة العلاجية المخصصة لك مع تيم دومايا..."
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectStruggle = (label: string) => {
    setForm(prev => ({ ...prev, struggle: label }));
  };

  const handleSelectSpecialty = (spec: string) => {
    setForm(prev => ({ ...prev, specialty: spec }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.specialty || !form.struggle) {
      setError("برجاء إدخال اسمك، تخصصك، واختيار التحدي الأبرز لديك.");
      return;
    }

    setError('');
    setLoading(true);
    setLoadingStep(0);

    // Dynamic loading screen steps
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2200);

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("حدث خطأ في معالجة طلب التشخيص.");
      }

      const data = await response.json();
      setResult(data);
      onDiagnosisComplete(data);
    } catch (err: any) {
      setError(err.message || "فشل الاتصال بالخادم الذكي. برجاء المحاولة لاحقاً.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-transparent py-16 border-y border-white/5" id="diagnosis-tool">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 space-y-3" dir="rtl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100/10 border border-orange-500/30 text-orange-400 rounded-full text-sm font-semibold">
            <Stethoscope className="w-4 h-4" />
            <span>التشخيص الرقمي الفوري بالذكاء الاصطناعي</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-white">
            احصل على روشتة حضورك الرقمي الآن مجاناً!
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            جاوب على 5 أسئلة سريرية بسيطة، ليقوم نظامنا المدعوم بالذكاء الاصطناعي وخبرات فريق دومايا بصياغة روشتة براندنج مخصصة لعيادتك فوراً.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* 1. Form view */}
          {!loading && !result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/5 text-right text-white"
              dir="rtl"
              id="diagnosis-form-wrapper"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-950/50 border border-red-500/30 text-red-400 text-sm rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-300">الاسم الكريم</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="مثال: د. محمد العشري"
                      value={form.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-[#FF5100] focus:border-[#FF5100] transition outline-none text-white placeholder-gray-500"
                    />
                  </div>

                  {/* Clinic Location */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">مقر عيادتك الأساسية وموقعها الجغرافي</label>
                    <input
                      type="text"
                      name="clinicDetails"
                      placeholder="مثال: التجمع الخامس، القاهرة أو حي السليمانية، الرياض"
                      value={form.clinicDetails}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF5100] focus:border-[#FF5100] transition outline-none text-gray-800"
                    />
                  </div>
                </div>

                {/* Specialty Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-300">تخصصك الطبي</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {COMMON_SPECIALTIES.map((spec, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSpecialty(spec)}
                        className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition border ${
                          form.specialty === spec
                            ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    name="specialty"
                    required
                    placeholder="أو اكتب تخصصك مخصصاً هنا..."
                    value={form.specialty}
                    onChange={handleInputChange}
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-[#FF5100] focus:border-[#FF5100] transition outline-none text-white placeholder-gray-500"
                  />
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-300">مين هو جمهورك أو مريضك المستهدف بالتحديد؟</label>
                  <input
                    type="text"
                    name="targetAudience"
                    placeholder="مثال: الأمهات الجدد، الرياضيين، المهتمين بعمليات النحت والتجميل"
                    value={form.targetAudience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-[#FF5100] focus:border-[#FF5100] transition outline-none text-white placeholder-gray-500"
                  />
                </div>

                {/* Struggle / Symptom Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-300">إيه أكتر تحدي أو عَرَض بتعاني منه في السوشيال ميديا؟</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {COMMON_STRUGGLES.map((struggleItem) => (
                      <button
                        key={struggleItem.id}
                        type="button"
                        onClick={() => handleSelectStruggle(struggleItem.label)}
                        className={`p-4 rounded-xl text-right text-xs sm:text-sm font-medium transition border flex items-start gap-2.5 ${
                          form.struggle === struggleItem.label
                            ? 'bg-orange-500/10 border-orange-500 text-white ring-2 ring-orange-500/20'
                            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full border flex-shrink-0 mt-0.5 flex items-center justify-center ${
                          form.struggle === struggleItem.label
                            ? 'border-orange-500 bg-orange-500 text-white'
                            : 'border-white/20'
                        }`}>
                          {form.struggle === struggleItem.label && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                        </span>
                        <span>{struggleItem.label}</span>
                      </button>
                    ))}
                  </div>
                  <textarea
                    name="struggle"
                    placeholder="أو اكتب أي مشكلة تسويقية مخصصة تواجهك بالتفصيل هنا..."
                    value={form.struggle}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full mt-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-[#FF5100] focus:border-[#FF5100] transition outline-none text-white text-sm placeholder-gray-500"
                  />
                </div>

                <div className="pt-4 flex justify-start">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-10 py-4 bg-[#FF5100] hover:bg-orange-600 text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-3 text-lg cursor-pointer"
                    id="submit-diagnosis"
                  >
                    <span>كتابة روشتة الحضور الرقمي بالطاقة الذكائية</span>
                    <Sparkles className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* 2. Loading state */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass p-12 rounded-3xl shadow-2xl border border-white/5 text-center flex flex-col items-center justify-center min-h-[400px] text-white"
              id="diagnosis-loading"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-orange-500/10 border-t-orange-500 rounded-full animate-spin"></div>
                <Stethoscope className="w-8 h-8 text-orange-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
              </div>

              <motion.p
                key={loadingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-lg font-bold text-white max-w-md"
              >
                {loadingMessages[loadingStep]}
              </motion.p>
              <p className="text-gray-400 text-xs mt-3">نعمل على تحويل معرفتك الطبية لأداة جذب رقمية لا تُقاوم...</p>
            </motion.div>
          )}

          {/* 3. Output results "Medical Branding Prescription Sheet" */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              id="diagnosis-results"
            >
              <div
                className="bg-white rounded-2xl shadow-2xl border-4 border-[#091B65]/10 p-6 sm:p-10 relative overflow-hidden print:shadow-none print:border-none"
                id="printable-prescription-sheet"
              >
                {/* Paper header strip */}
                <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#091B65] via-[#FF5100] to-[#091B65]"></div>

                {/* Print watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
                  <Logo iconOnly className="w-96 h-96" />
                </div>

                {/* Prescription Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-gray-100 pb-6 mb-6 gap-4 text-right">
                  <div>
                    <div className="flex items-center gap-2 mb-1 justify-end">
                      <span className="px-2 py-0.5 rounded bg-orange-100 text-[#FF5100] text-[10px] font-bold">معتمد طبيّاً</span>
                      <h3 className="text-xl font-bold text-[#091B65]">عيادة البراند الطبي من دومايا</h3>
                    </div>
                    <p className="text-xs text-gray-500">ميديا بروداكشن طبي • تسويق طبي متكامل • صناعة وعي</p>
                    <p className="text-[10px] text-gray-400 mt-1">تاريخ التشخيص الرقمي: {new Date(result.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <Logo />
                </div>

                {/* Patient / Doctor Details Block */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50/80 p-4 rounded-xl border border-gray-100 text-right mb-6">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">اسم الطبيب (المريض)</span>
                    <span className="text-sm font-bold text-[#091B65]">د. {result.patientName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">التخصص الطبي</span>
                    <span className="text-sm font-bold text-gray-800">{result.specialty}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">الجمهور المستهدف</span>
                    <span className="text-xs font-bold text-gray-800 truncate block">{form.targetAudience || 'المرضى وعامة الناس'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">رقم التشخيص الموحد</span>
                    <span className="text-xs font-mono font-bold text-orange-600">{result.id}</span>
                  </div>
                </div>

                {/* Prescription Body Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column (Symptoms, Prescription RX) */}
                  <div className="lg:col-span-7 space-y-6 text-right">
                    {/* Observed Symptoms */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-[#091B65] border-r-4 border-red-500 pr-2 flex items-center gap-1.5 justify-start">
                        <span>أعراض الحضور الرقمي المرصودة</span>
                      </h4>
                      <ul className="space-y-2">
                        {result.symptoms.map((symptom, idx) => (
                          <li key={idx} className="bg-red-50/30 text-gray-700 text-sm p-3 rounded-lg border border-red-100/40 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                            <span>{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Rx Action steps */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-[#091B65] border-r-4 border-[#FF5100] pr-2 flex items-center gap-1.5 justify-start">
                        <span>الروشتة العلاجية (Rx)</span>
                      </h4>
                      <div className="space-y-3">
                        {result.prescriptionRx.map((rx, idx) => (
                          <div key={idx} className="bg-orange-50/20 p-3 rounded-xl border border-orange-100/50 flex gap-3">
                            <span className="text-orange-600 font-serif font-bold text-lg flex-shrink-0">Rx</span>
                            <div className="text-gray-800 text-sm font-semibold">{rx}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Suggested Content Plan, Action Steps) */}
                  <div className="lg:col-span-5 space-y-6 text-right">
                    {/* Content Plan */}
                    <div className="bg-[#091B65]/5 p-5 rounded-2xl border border-[#091B65]/10 space-y-4">
                      <h4 className="text-sm font-bold text-[#091B65] border-r-4 border-[#091B65] pr-2">
                        بروتوكول المحتوى المقترح (Reels)
                      </h4>
                      <div className="space-y-2">
                        <span className="text-[10px] text-gray-500 block">العنوان والمحور العام للمحتوى:</span>
                        <div className="text-sm font-bold text-[#091B65] bg-white p-3 rounded-lg border border-gray-100">
                          {result.contentPlan.theme}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] text-gray-500 block">أفكار Reels مخصصة لك:</span>
                        <div className="space-y-2">
                          {result.contentPlan.topics.map((topic, idx) => (
                            <div key={idx} className="bg-white p-2.5 rounded-lg border border-gray-100 text-xs font-semibold text-gray-700 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#091B65]/10 text-[#091B65] flex items-center justify-center font-mono font-bold flex-shrink-0 text-[10px]">
                                {idx + 1}
                              </span>
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Immediate Steps */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-emerald-800 border-r-4 border-emerald-500 pr-2">
                        خطوات العمل الفورية
                      </h4>
                      <ul className="space-y-2">
                        {result.actionSteps.map((step, idx) => (
                          <li key={idx} className="bg-emerald-50/20 text-gray-700 text-xs sm:text-sm p-3 rounded-lg border border-emerald-100/40 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Signature / stamp footer of the prescription */}
                <div className="border-t-2 border-dashed border-gray-100 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-center gap-4 text-xs text-gray-400">
                  <div>
                    <span>توقيع اللجنة الفنية والتسويقية لوكالة دومايا</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                    <span className="font-bold text-[#091B65]">Domya Marketing Agency - 2026</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons to save or proceed */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 text-sm"
                  id="print-prescription"
                >
                  <Printer className="w-4 h-4" />
                  <span>اطبع الروشتة (PDF)</span>
                </button>

                <button
                  onClick={() => onSelectBookingWithDiagnosis(result)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#FF5100] hover:bg-orange-600 text-white font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 text-sm animate-bounce"
                  id="diag-to-booking"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>تفعيل الروشتة وحجز الجلسة المجانية مع تيم دومايا</span>
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem('domya_doctor_diagnosis');
                    setResult(null);
                    setForm({ name: '', specialty: '', clinicDetails: '', struggle: '', targetAudience: '' });
                    onDiagnosisComplete(null as any);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-transparent hover:bg-gray-100 text-gray-500 font-medium rounded-xl transition duration-300 flex items-center justify-center gap-2 text-sm border border-gray-200"
                  id="redo-diagnosis"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>إعادة الفحص والتشخيص</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
