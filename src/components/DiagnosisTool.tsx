/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
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

export default function DiagnosisTool({ onDiagnosisComplete, onSelectBookingWithDiagnosis }: DiagnosisToolProps) {
  const [form, setForm] = useState<DiagnosisInput>({
    name: '',
    specialty: '',
    struggle: '',
    clinicDetails: '',
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

  return (
    <div className="py-16 bg-transparent text-white border-b border-white/5 relative z-10" id="diagnosis-section">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF5100]/10 border border-[#FF5100]/25 text-[#FF5100] rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>فحص الحضور الطبي الفوري</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-sans font-black text-white">
            احصل على روشتة حضورك الرقمي في دقيقة 🩺
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            أجب عن 3 أسئلة سريعة وسيقوم الذكاء الاصطناعي بتحرير تشخيصك الطبي التسويقي وخطة Reels فوراً.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px] text-white"
            >
              <div className="w-12 h-12 border-4 border-white/10 border-t-[#FF5100] rounded-full animate-spin"></div>
              <motion.p
                key={loadingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-base font-bold text-slate-200"
              >
                {loadingMessages[loadingStep]}
              </motion.p>
            </motion.div>
          ) : result ? (
            /* COMPACT PRESCRIPTION OUTPUT CARD */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl overflow-hidden text-right text-white"
              id="diagnosis-results"
            >
              {/* Premium Top Line Accent */}
              <div className="h-1.5 bg-[#FF5100]" />
              
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">روشتة حضورك الطبي الرقمي</h3>
                    <p className="text-[10px] text-slate-450 mt-0.5">رقم الملف: {result.id}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-[#FF5100]/15 text-[#FF5100] rounded-lg text-xs font-bold border border-[#FF5100]/25">جاهزة ومكتملة ✓</span>
                </div>

                {/* Doctor details */}
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 grid grid-cols-2 gap-4 text-xs font-semibold text-slate-300">
                  <div>
                    <span className="text-slate-450 block text-[9px] mb-0.5">الطبيب:</span>
                    <span className="text-white font-bold">د. {result.patientName}</span>
                  </div>
                  <div>
                    <span className="text-slate-450 block text-[9px] mb-0.5">التخصص:</span>
                    <span className="text-white font-bold">{result.specialty}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Diagnosis */}
                  <div>
                    <h4 className="text-xs font-bold text-[#FF5100] border-r-2 border-[#FF5100] pr-1.5 mb-1.5">التشخيص الرقمي المقترح:</h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                      {result.symptoms[0]}
                    </p>
                  </div>

                  {/* Action Steps */}
                  <div>
                    <h4 className="text-xs font-bold text-orange-400 border-r-2 border-orange-500 pr-1.5 mb-1.5">الروشتة العلاجية المقترحة (Rx):</h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-orange-500/5 p-3 rounded-lg border border-orange-500/10">
                      {result.prescriptionRx[0]}
                    </p>
                  </div>

                  {/* Reels Topics */}
                  <div>
                    <h4 className="text-xs font-bold text-emerald-400 border-r-2 border-emerald-500 pr-1.5 mb-1.5">أفكار الـ Reels المقترحة للبدء فوراً:</h4>
                    <ul className="space-y-1.5">
                      {result.contentPlan.topics.map((topic, idx) => (
                        <li key={idx} className="bg-emerald-500/5 text-xs sm:text-sm text-slate-200 p-2.5 rounded-lg border border-emerald-500/15 flex items-start gap-2 font-medium">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call to Action direct to booking form */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <button
                    onClick={() => {
                      localStorage.removeItem('domya_doctor_diagnosis');
                      setResult(null);
                      onDiagnosisComplete(null as any);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 font-bold transition flex items-center gap-1 cursor-pointer order-2 sm:order-1"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>إعادة الفحص والتشخيص</span>
                  </button>

                  <button
                    onClick={() => onSelectBookingWithDiagnosis(result)}
                    className="w-full sm:w-auto px-6 py-3 bg-[#FF5100] hover:bg-orange-655 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20 order-1 sm:order-2 animate-pulse cursor-pointer"
                  >
                    <span>تطبيق هذه الروشتة في استمارة الحجز بالأسفل 📲</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* COMPACT QUESTION FORM */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass rounded-3xl p-6 sm:p-8 text-right space-y-6 text-white"
            >
              {error && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg font-bold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Doctor Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">اسم الطبيب الكريم</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="مثال: د. محمد خالد"
                      value={form.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-[#FF5100] focus:border-[#FF5100] outline-none text-white text-xs font-semibold transition focus:bg-white/10"
                    />
                  </div>

                  {/* Specialty */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">التخصص الطبي</label>
                    <div className="relative">
                      <select
                        name="specialty"
                        value={form.specialty}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#050B24] focus:ring-2 focus:ring-[#FF5100] focus:border-[#FF5100] outline-none text-white text-xs font-semibold appearance-none transition focus:bg-[#091B65]"
                      >
                        <option value="" className="bg-[#050B24]">-- اختر التخصص --</option>
                        {COMMON_SPECIALTIES.map((spec, i) => (
                          <option key={i} value={spec} className="bg-[#050B24]">{spec}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Struggles */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">أبرز تحدي يواجه حضورك الطبي الرقمي حالياً</label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {COMMON_STRUGGLES.map((struggle) => (
                      <button
                        key={struggle.id}
                        type="button"
                        onClick={() => handleSelectStruggle(struggle.label)}
                        className={`w-full text-right p-3 rounded-xl border text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                          form.struggle === struggle.label
                            ? 'bg-[#FF5100]/10 border-[#FF5100] text-[#FF5100]'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span>{struggle.label}</span>
                        {form.struggle === struggle.label && <CheckCircle className="w-4 h-4 text-[#FF5100]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-left">
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-[#FF5100] hover:bg-orange-655 text-white font-bold rounded-xl text-sm transition duration-300 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>ابدأ التشخيص الرقمي الفوري 🩺</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
