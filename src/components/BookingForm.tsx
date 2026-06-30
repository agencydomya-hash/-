
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Stethoscope, CheckCircle, Clock, Calendar, ShieldCheck, Mail, Phone, Globe, ChevronDown, Award } from 'lucide-react';
import { DiagnosisOutput } from '../types';

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

  const inputClass = "w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-[#2C3E50] text-sm placeholder-slate-400 transition duration-200";
  const labelClass = "block text-xs sm:text-sm font-bold text-[#2C3E50] mb-1.5";

  return (
    <div className="bg-gradient-to-br from-[#F0F4F8] to-[#E0E7FF] py-20 border-b border-slate-200 relative z-10" id="booking-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3" dir="rtl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/25 text-[#FF6B35] rounded-full text-sm font-semibold">
            <Calendar className="w-4 h-4" />
            <span>جدولة الاستشارة المجانية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-[#003D7A]">
            احجز استشارة براندنج طبي وتصوير مجانية 📞
          </h2>
          <p className="text-[#2C3E50] max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-semibold">
            سجل بياناتك الطبية الآن، ليقوم مستشار تسويق من فريق دوميا بالاتصال بك وترتيب موعد لزيارة العيادة ودراسة حالتك الرقمية بالتفصيل.
          </p>
        </div>

        {submitted ? (
          /* Success Card (Light Theme) */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-[#E5E7EB] p-8 sm:p-10 rounded-3xl text-center space-y-6 shadow-lg"
            id="booking-success"
            dir="rtl"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#10B981] border border-emerald-200">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#003D7A]">تم حجز استشارتك الطبية التسويقية بنجاح! 🎉</h3>
              <p className="text-[#2C3E50] text-sm max-w-md mx-auto font-semibold">
                شكراً دكتور <span className="font-bold text-[#FF6B35]">{form.name}</span>. تم استلام ملفك وتحويله للجنة الفنية بوكالة دوميا لفحصه ومراجعته.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F0F4F8] p-4 rounded-xl border border-slate-200 text-right text-xs max-w-lg mx-auto">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#FF6B35]" />
                <div>
                  <span className="text-slate-400 block">وقت الاتصال المتوقع:</span>
                  <span className="font-bold text-[#2C3E50]">خلال 24 ساعة عمل</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <div>
                  <span className="text-slate-400 block">نوع الملف:</span>
                  <span className="font-bold text-[#10B981]">سرية بيانات الطبيب مضمونة 🔒</span>
                </div>
              </div>
            </div>

            {/* Email Confirmation Notice */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-right space-y-2 max-w-lg mx-auto">
              <div className="flex items-center gap-2 justify-start">
                <Mail className="w-5 h-5 text-[#003D7A]" />
                <span className="font-bold text-[#003D7A] text-sm">تم إرسال تأكيد بالبريد الإلكتروني</span>
              </div>
              <p className="text-xs text-[#2C3E50] leading-relaxed font-semibold">
                تم إرسال إيميل تأكيدي إلى بريدك الإلكتروني{form.email && form.email !== 'غير محدد' ? ` (${form.email})` : ''} يتضمن تفاصيل حجزك، كما تم إرسال بياناتك لفريق دوميا للمتابعة الفورية.
              </p>
            </div>

            <p className="text-xs text-slate-400 font-semibold">
              ممثلو مكتب مصر (+20109) أو مكتب السعودية (+9665) سيتواصلون معك عبر الهاتف أو الواتساب مباشرة.
            </p>
          </motion.div>
        ) : (
          /* Light Form Card */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#E5E7EB] rounded-[32px] shadow-lg p-8 sm:p-12 relative overflow-hidden"
            id="booking-form-wrapper"
            dir="rtl"
          >
            {/* Branded Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#003D7A] via-[#FF6B35] to-[#003D7A]" />

            {diagnosisRef && (
              <div className="mb-6 p-4 bg-[#FF6B35]/10 border border-[#FF6B35]/25 text-[#FF6B35] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
                <Award className="w-5 h-5 text-[#FF6B35]" />
                <span>تم ربط الروشتة العلاجية رقم {diagnosisRef.id} بنجاح! تم تعبئة البيانات تلقائياً دكتور 🩺</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Doctor Name */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    اسم الطبيب الكريم <span className="text-[#FF6B35]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="مثال: د. هاني الرفاعي"
                    value={form.name}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>

                {/* Specialty */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    التخصص الدقيق <span className="text-[#FF6B35]">*</span>
                  </label>
                  <input
                    type="text"
                    name="specialty"
                    required
                    placeholder="مثال: جراحة التجميل والترميم"
                    value={form.specialty}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Clinic / Hospital Name */}
                <div className="space-y-1.5">
                  <label className={labelClass}>اسم العيادة أو المركز الطبي</label>
                  <input
                    type="text"
                    name="clinicName"
                    placeholder="مثال: مجمع عيادات الرفاعي لطب المفاصل"
                    value={form.clinicName}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    رقم الهاتف للاتصال والواتساب <span className="text-[#FF6B35]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="مثال: +201090121000 أو +9665..."
                      value={form.phone}
                      onChange={handleInputChange}
                      className={inputClass + " pr-10"}
                      dir="ltr"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute top-1/2 right-3.5 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className={labelClass}>البريد الإلكتروني</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="doctor@example.com"
                      value={form.email}
                      onChange={handleInputChange}
                      className={inputClass + " pr-10"}
                      dir="ltr"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute top-1/2 right-3.5 -translate-y-1/2" />
                  </div>
                </div>

                {/* Current Social Link */}
                <div className="space-y-1.5">
                  <label className={labelClass}>رابط صفحتك الحالية إن وجد</label>
                  <div className="relative">
                    <input
                      type="url"
                      name="socialLink"
                      placeholder="https://facebook.com/doctor.page"
                      value={form.socialLink}
                      onChange={handleInputChange}
                      className={inputClass + " pr-10"}
                      dir="ltr"
                    />
                    <Globe className="w-4 h-4 text-slate-400 absolute top-1/2 right-3.5 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Selection of Marketing Goals */}
              <div className="space-y-1.5">
                <label className={labelClass}>الهدف الأبرز للبراندينج وعيادتك</label>
                <div className="relative">
                  <select
                    name="goal"
                    value={form.goal}
                    onChange={handleInputChange}
                    className={inputClass + " appearance-none"}
                  >
                    <option value="جذب مرضى حقيقيين وزيادة تعاقدات العيادة">جذب مرضى حقيقيين وزيادة حجوزات العيادة 📈</option>
                    <option value="تثبيت الهيبة والمصداقية العلمية ومواجهة المنافسين">تثبيت المصداقية العلمية ومواجهة المنافسين 🛡️</option>
                    <option value="بناء براند متكامل وتصوير Reels احترافي بالعيادة">بناء براند متكامل وتصوير Reels احترافي بالعيادة 🎥</option>
                    <option value="توسيع الانتشار والوصول لصفحات التلفزيون أو السفر الطبي">توسيع الانتشار والوصول للظهور الإعلامي المتميز 🌟</option>
                    <option value="بناء البراند الطبي الموصى به في الروشتة الذكية">بناء البراند الطبي الموصى به في الروشتة الذكية 📝</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute top-1/2 left-3.5 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-10 py-4 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-base cursor-pointer"
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
                <p className="text-center text-[10px] text-slate-400 font-semibold mt-2">مجاني 100% — بدون رسوم — سيتواصل معك الفريق خلال 24 ساعة</p>
              </div>
            </form>
          </motion.div>
        )}

      </div>
    </div>
  );
}
