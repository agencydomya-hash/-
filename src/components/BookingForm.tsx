/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Stethoscope, CheckCircle, Clock, Calendar, ShieldCheck, Mail, Phone, Globe, ChevronDown, Award } from 'lucide-react';
import { DoctorSubmission, DiagnosisOutput } from '../types';

interface BookingFormProps {
  diagnosisRef: DiagnosisOutput | null;
  onSuccess: () => void;
}

export default function BookingForm({ diagnosisRef, onSuccess }: BookingFormProps) {
  const [form, setForm] = useState({
    name: '',
    specialty: '',
    clinicName: '',
    phone: '',
    email: '',
    socialLink: '',
    goal: 'جذب مرضى حقيقيين وزيادة تعاقدات العيادة'
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Auto-fill form if there is a diagnosis completed
  useEffect(() => {
    if (diagnosisRef) {
      setForm(prev => ({
        ...prev,
        name: diagnosisRef.patientName || '',
        specialty: diagnosisRef.specialty || '',
        goal: 'بناء البراند الطبي الموصى به في الروشتة الذكية'
      }));
    }
  }, [diagnosisRef]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.specialty || !form.phone) {
      setError("برجاء ملء الحقول الإجبارية: الاسم، التخصص، ورقم الهاتف.");
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          diagnosisId: diagnosisRef ? diagnosisRef.id : null
        })
      });

      if (!response.ok) {
        throw new Error("حدث خطأ أثناء إرسال بيانات الاستشارة.");
      }

      setSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "فشل الاتصال بالخادم. يرجى مراجعة شبكة الإنترنت والمحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent py-20 border-b border-white/5" id="booking-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 text-[#FF5100] rounded-full text-sm font-semibold">
            <Calendar className="w-4 h-4" />
            <span>جدولة الاستشارة المجانية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[#091B65]">
            احجز استشارة براندنج طبي وتصوير مجانية 📞
          </h2>
          <p className="text-slate-650 max-w-xl mx-auto text-sm sm:text-base">
            سجل بياناتك الطبية الآن، ليقوم مستشار تسويق من فريق دومايا بالاتصال بك وترتيب موعد لزيارة العيادة ودراسة حالتك الرقمية بالتفصيل.
          </p>
        </div>

        {submitted ? (
          /* Submission Receipt Box */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-2 border-emerald-500/20 p-8 sm:p-10 rounded-3xl text-center space-y-6 text-slate-800 shadow-xl"
            id="booking-success"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#091B65]">تم حجز استشارتك الطبية التسويقية بنجاح! 🎉</h3>
              <p className="text-slate-650 text-sm max-w-md mx-auto">
                شكراً دكتور <span className="font-bold text-orange-650">{form.name}</span>. تم استلام ملفك وتحويله للجنة الفنية بوكالة دومايا لفحصه ومراجعته.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-emerald-500/20 text-right text-xs max-w-lg mx-auto">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-orange-500" />
                <div>
                  <span className="text-slate-500 block">وقت الاتصال المتوقع:</span>
                  <span className="font-bold text-slate-800">خلال 24 ساعة عمل</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-slate-500 block">نوع الملف:</span>
                  <span className="font-bold text-emerald-700">سرية بيانات الطبيب مضمونة 🔒</span>
                </div>
              </div>
            </div>

            {/* Email Confirmation Notice */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-right space-y-2 max-w-lg mx-auto">
              <div className="flex items-center gap-2 justify-start">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-blue-800 text-sm">تم إرسال تأكيد بالبريد الإلكتروني</span>
              </div>
              <p className="text-xs text-blue-900/80">
                تم إرسال إيميل تأكيدي إلى بريدك الإلكتروني{form.email && form.email !== 'غير محدد' ? ` (${form.email})` : ''} يتضمن تفاصيل حجزك، كما تم إرسال بياناتك لفريق دومايا للمتابعة الفورية.
              </p>
            </div>

            <p className="text-xs text-slate-500 font-semibold">
              ممثلو مكتب مصر (+20109) أو مكتب السعودية (+9665) سيتواصلون معك عبر الهاتف أو الواتساب مباشرة.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-6 sm:p-10 text-slate-800"
            id="booking-form-wrapper"
          >
            {diagnosisRef && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 text-orange-850 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-600" />
                <span>تم Linking بنجاح مع الروشتة الذكية رقم {diagnosisRef.id}. بيانات الاسم والتخصص معبأة تلقائياً دكتور!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-950/50 border border-red-500/30 text-red-400 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Doctor Name */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700">
                    اسم الطبيب الكريم <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="مثال: د. هاني الرفاعي"
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#FF5100] focus:border-[#FF5100] outline-none text-slate-800 text-sm placeholder-slate-400 focus:bg-white transition duration-200"
                  />
                </div>

                {/* Specialty */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700">
                    التخصص الدقيق <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="specialty"
                    required
                    placeholder="مثال: جراحة التجميل والترميم"
                    value={form.specialty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#FF5100] focus:border-[#FF5100] outline-none text-slate-800 text-sm placeholder-slate-400 focus:bg-white transition duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Clinic / Hospital Name */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700">اسم العيادة أو المركز الطبي</label>
                  <input
                    type="text"
                    name="clinicName"
                    placeholder="مثال: مجمع عيادات الرفاعي لطب المفاصل"
                    value={form.clinicName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#FF5100] focus:border-[#FF5100] outline-none text-slate-800 text-sm placeholder-slate-400 focus:bg-white transition duration-200"
                  />
                </div>

                {/* Phone Number with country indicator */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700">
                    رقم الهاتف للاتصال والواتساب <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="مثال: +201090121000 أو +9665..."
                      value={form.phone}
                      onChange={handleInputChange}
                      className="w-full px-10 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#FF5100] focus:border-[#FF5100] outline-none text-slate-850 text-sm text-left placeholder-slate-400 focus:bg-white transition duration-200"
                      dir="ltr"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute top-1/2 right-3.5 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Email Address */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="doctor@example.com"
                      value={form.email}
                      onChange={handleInputChange}
                      className="w-full px-10 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#FF5100] focus:border-[#FF5100] outline-none text-slate-850 text-sm text-left placeholder-slate-400 focus:bg-white transition duration-200"
                      dir="ltr"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute top-1/2 right-3.5 -translate-y-1/2" />
                  </div>
                </div>

                {/* Current Social Link */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700">رابط صفحتك الحالية إن وجد</label>
                  <div className="relative">
                    <input
                      type="url"
                      name="socialLink"
                      placeholder="https://facebook.com/doctor.page"
                      value={form.socialLink}
                      onChange={handleInputChange}
                      className="w-full px-10 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#FF5100] focus:border-[#FF5100] outline-none text-slate-850 text-sm text-left placeholder-slate-400 focus:bg-white transition duration-200"
                      dir="ltr"
                    />
                    <Globe className="w-4 h-4 text-slate-400 absolute top-1/2 right-3.5 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Selection of Marketing Goals */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-700">الهدف الأبرز للبراندينج وعيادتك</label>
                <div className="relative">
                  <select
                    name="goal"
                    value={form.goal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#FF5100] focus:border-[#FF5100] outline-none text-slate-800 text-sm appearance-none font-medium focus:bg-white transition duration-200"
                  >
                    <option value="جذب مرضى حقيقيين وزيادة تعاقدات العيادة" className="bg-white text-slate-800">جذب مرضى حقيقيين وزيادة حجوزات العيادة 📈</option>
                    <option value="تثبيت الهيبة والمصداقية العلمية ومواجهة المنافسين" className="bg-white text-slate-800">تثبيت المصداقية العلمية ومواجهة المنافسين 🛡️</option>
                    <option value="بناء براند متكامل وتصوير Reels احترافي بالعيادة" className="bg-white text-slate-800">بناء براند متكامل وتصوير Reels احترافي بالعيادة 🎥</option>
                    <option value="توسيع الانتشار والوصول لصفحات التلفزيون أو السفر الطبي" className="bg-white text-slate-800">توسيع الانتشار والوصول للظهور الإعلامي المتميز 🌟</option>
                    <option value="بناء البراند الطبي الموصى به في الروشتة الذكية" className="bg-white text-slate-800">بناء البراند الطبي الموصى به في الروشتة الذكية 📝</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute top-1/2 left-3.5 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="pt-4 text-left">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-4 bg-[#FF5100] hover:bg-orange-600 text-white font-bold rounded-xl transition duration-300 shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 text-base cursor-pointer"
                  id="submit-booking-form"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>جاري إرسال البيانات وتأمين الملف...</span>
                    </>
                  ) : (
                    <>
                      <Stethoscope className="w-5 h-5 text-white" />
                      <span>تقديم طلب الحجز والفحص المجاني</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

      </div>
    </div>
  );
}
