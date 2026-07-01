
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Stethoscope, CheckCircle, Clock, Calendar, ShieldCheck, Mail, Phone, Globe, ChevronDown, Award } from 'lucide-react';
import { DiagnosisOutput } from '../types';

interface BookingFormProps {
  diagnosisRef: DiagnosisOutput | null;
  onSuccess: () => void;
  lang?: 'ar' | 'en';
  isModal?: boolean;
}

export default function BookingForm({ diagnosisRef, onSuccess, lang = 'ar', isModal = false }: BookingFormProps) {
  const isEn = lang === 'en';

  const [form, setForm] = useState({
    name: '',
    specialty: '',
    clinicName: '',
    phone: '',
    email: '',
    socialLink: '',
    goal: isEn ? 'Attract actual patients and increase clinic bookings' : 'جذب مرضى حقيقيين وزيادة تعاقدات العيادة'
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
        goal: isEn ? 'Build the recommended medical brand from smart prescription' : 'بناء البراند الطبي الموصى به في الروشتة الذكية'
      }));
    }
  }, [diagnosisRef, isEn]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.specialty || !form.phone) {
      setError(isEn ? "Please fill in the required fields: Name, Specialty, and Phone." : "برجاء ملء الحقول الإجبارية: الاسم، التخصص، ورقم الهاتف.");
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
        throw new Error(isEn ? "An error occurred while submitting consultation request." : "حدث خطأ أثناء إرسال بيانات الاستشارة.");
      }

      setSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || (isEn ? "Server connection failed. Please check your internet connection and try again." : "فشل الاتصال بالخادم. يرجى مراجعة شبكة الإنترنت والمحاولة مرة أخرى."));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-[#2C3E50] dark:text-slate-100 text-base md:text-sm placeholder-slate-400 dark:placeholder-slate-600 transition duration-200";
  const labelClass = "block text-xs sm:text-sm font-bold text-[#2C3E50] dark:text-slate-355 mb-1.5";

  const innerContent = (
    <div className={`${isModal ? 'max-w-xl p-2' : 'max-w-3xl'} mx-auto px-4 sm:px-6`}>
      {/* Section Header */}
      <div className={`text-center ${isModal ? 'mb-6 space-y-2' : 'mb-12 space-y-3'} ${isEn ? 'text-left lg:text-center' : 'text-right lg:text-center'}`} dir={isEn ? "ltr" : "rtl"}>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/25 text-[#FF6B35] rounded-full text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>{isEn ? "Schedule Free Consultation" : "جدولة الاستشارة المجانية"}</span>
        </div>
        <h2 className={`${isModal ? 'text-xl sm:text-2xl' : 'text-3xl sm:text-4xl'} font-sans font-black text-[#003D7A] dark:text-white`}>
          {isEn ? "Book Free Medical Branding Consultation 📞" : "احجز استشارة براندنج طبي وتصوير مجانية 📞"}
        </h2>
        {!isModal && (
          <p className="text-[#2C3E50] dark:text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-semibold">
            {isEn 
              ? "Submit your medical details now. A branding consultant from DOMYA will contact you to schedule a clinic visit and analyze your digital presence."
              : "سجل بياناتك الطبية الآن، ليقوم مستشار تسويق من فريق دوميا بالاتصال بك وترتيب موعد لزيارة العيادة ودراسة حالتك الرقمية بالتفصيل."
            }
          </p>
        )}
      </div>

      {submitted ? (
        /* Success Card */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-8 sm:p-10 rounded-3xl text-center space-y-6 shadow-lg transition-colors"
          id="booking-success"
          dir={isEn ? "ltr" : "rtl"}
        >
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center mx-auto text-[#10B981] border border-emerald-200 dark:border-emerald-900/35">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-[#003D7A] dark:text-white">
              {isEn ? "Your growth consultation has been booked! 🎉" : "تم حجز استشارتك الطبية التسويقية بنجاح! 🎉"}
            </h3>
            <p className="text-[#2C3E50] dark:text-slate-300 text-sm max-w-md mx-auto font-semibold">
              {isEn 
                ? `Thank you Dr. ${form.name}. Your profile has been received and sent to DOMYA's technical committee for analysis.`
                : `شكراً دكتور ${form.name}. تم استلام ملفك وتحويله للجنة الفنية بوكالة دوميا لفحصه ومراجعته.`
              }
            </p>
          </div>

          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-md mx-auto">
            <Clock className="w-4 h-4 text-[#10B981] inline-block mr-1 ml-1" />
            <span>
              {isEn
                ? "Our advisor will call or WhatsApp you within 24 working hours to arrange the clinic visit. Get ready!"
                : "سيقوم مستشار نمو من فريق دوميا بالاتصال بك هاتفياً أو عبر الواتساب خلال 24 ساعة عمل لترتيب موعد المقابلة وزيارة عيادتك. كن مستعداً!"
              }
            </span>
          </div>

          {diagnosisRef && (
            <div className="p-4 bg-[#F0F4F8] dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-right max-w-md mx-auto space-y-2" dir={isEn ? "ltr" : "rtl"}>
              <h4 className="font-bold text-[#003D7A] dark:text-white flex items-center gap-1">
                <Stethoscope className="w-4 h-4 text-[#FF6B35]" />
                <span>{isEn ? "Diagnostic Prescription Attached:" : "الروشتة العلاجية المرفقة بالطلب:"}</span>
              </h4>
              <p className="text-[#2C3E50] dark:text-slate-355 font-semibold leading-relaxed">
                {diagnosisRef.prescriptionRx[0]}
              </p>
            </div>
          )}
        </motion.div>
      ) : (
        /* Booking Form */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-3xl ${isModal ? 'p-6' : 'p-8 sm:p-10'} shadow-xl relative overflow-hidden transition-colors`}
        >
          {/* Clinic Branding Accent Seal Watermark */}
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#FF6B35]/3 dark:bg-[#FF6B35]/1 pointer-events-none select-none blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[#003D7A]/5 dark:bg-[#003D7A]/2 pointer-events-none select-none blur-2xl" />

          {diagnosisRef && (
            <div className="mb-6 p-4 bg-orange-50/50 dark:bg-orange-950/15 rounded-2xl border border-orange-100 dark:border-orange-900/30 flex items-start gap-3" dir={isEn ? "ltr" : "rtl"}>
              <div className="w-8 h-8 rounded-full bg-[#FF6B35]/10 flex items-center justify-center text-[#FF6B35] flex-shrink-0 mt-0.5 border border-orange-500/25">
                <Award className="w-4 h-4" />
              </div>
              <div className={isEn ? "text-left" : "text-right"}>
                <span className="text-[10px] uppercase tracking-wider text-[#FF6B35] font-bold block">{isEn ? "AI PRESCRIPTION LINKED" : "روشتة التشخيص الذكي مرتبطة"}</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold leading-relaxed">
                  {isEn 
                    ? `Branding audit file #${diagnosisRef.id.slice(-6)} is attached to your submission. We have generated specialized recommendations for your medical specialty: ${diagnosisRef.specialty}.`
                    : `ملف تشخيص الحضور الرقمي الخاص بك رقم #${diagnosisRef.id.slice(-6)} تم ربطه بالطلب تلقائياً. تم إعداد التوصيات المخصصة لتخصصك: ${diagnosisRef.specialty}.`
                  }
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" dir={isEn ? "ltr" : "rtl"}>
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 text-xs font-bold rounded-xl border border-red-100 dark:border-red-900/35 text-center">
                ⚠️ {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Doctor Name */}
              <div className="space-y-1.5">
                <label htmlFor="booking-name" className={labelClass}>
                  {isEn ? "Full Name *" : "الاسم بالكامل *"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="booking-name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder={isEn ? "e.g., Dr. Ahmed Ali" : "مثال: د. أحمد علي"}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Specialty */}
              <div className="space-y-1.5">
                <label htmlFor="booking-specialty" className={labelClass}>
                  {isEn ? "Medical Specialty *" : "التخصص الطبي *"}
                </label>
                <input
                  type="text"
                  id="booking-specialty"
                  name="specialty"
                  required
                  value={form.specialty}
                  onChange={handleInputChange}
                  placeholder={isEn ? "e.g., Orthopedic Surgery" : "مثال: جراحة عظام، جلدية وتجميل..."}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="booking-phone" className={labelClass}>
                  {isEn ? "Phone/WhatsApp Number *" : "رقم الهاتف / الواتساب *"}
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-600 pointer-events-none" />
                  <input
                    type="tel"
                    id="booking-phone"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder="01090121000"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Clinic Name */}
              <div className="space-y-1.5">
                <label htmlFor="booking-clinicName" className={labelClass}>
                  {isEn ? "Clinic Name (Optional)" : "اسم العيادة (اختياري)"}
                </label>
                <input
                  type="text"
                  id="booking-clinicName"
                  name="clinicName"
                  value={form.clinicName}
                  onChange={handleInputChange}
                  placeholder={isEn ? "e.g., Al-Amal Specialized Center" : "مثال: مركز الأمل التخصصي"}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="booking-email" className={labelClass}>
                  {isEn ? "Email Address (Optional)" : "البريد الإلكتروني (اختياري)"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-600 pointer-events-none" />
                  <input
                    type="email"
                    id="booking-email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="doctor@example.com"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Social Link */}
              <div className="space-y-1.5">
                <label htmlFor="booking-socialLink" className={labelClass}>
                  {isEn ? "Social Media Link (Optional)" : "رابط السوشيال ميديا الحالي (اختياري)"}
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-600 pointer-events-none" />
                  <input
                    type="url"
                    id="booking-socialLink"
                    name="socialLink"
                    value={form.socialLink}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/doctor.page"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>

            {/* Growth Goal */}
            <div className="space-y-1.5">
              <label htmlFor="booking-goal" className={labelClass}>
                {isEn ? "Primary Growth Goal" : "الهدف التسويقي الأبرز لعيادتك"}
              </label>
              <div className="relative">
                <select
                  id="booking-goal"
                  name="goal"
                  value={form.goal}
                  onChange={handleInputChange}
                  className={`${inputClass} appearance-none pr-10`}
                >
                  <option value={isEn ? "Attract actual patients and increase clinic bookings" : "جذب مرضى حقيقيين وزيادة تعاقدات العيادة"}>
                    {isEn ? "Attract actual patients & increase bookings" : "جذب مرضى حقيقيين وزيادة تعاقدات العيادة"}
                  </option>
                  <option value={isEn ? "Build a prestigious personal medical brand" : "بناء براند شخصي وقار للأطباء وكسب الوجاهة"}>
                    {isEn ? "Build a prestigious personal medical brand" : "بناء براند شخصي وقار للأطباء وكسب الوجاهة"}
                  </option>
                  <option value={isEn ? "Improve digital media production quality" : "تحسين جودة إنتاج الفيديوهات وتعديل الألوان بالعيادة"}>
                    {isEn ? "Improve digital media production quality" : "تحسين جودة إنتاج الفيديوهات وتعديل الألوان بالعيادة"}
                  </option>
                  <option value={isEn ? "Establish map and local search SEO prominence" : "تصدر نتائج خرائط جوجل وجذب مرضى محليين"}>
                    {isEn ? "Establish map and local search SEO prominence" : "تصدر نتائج خرائط جوجل وجذب مرضى محليين"}
                  </option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-600 pointer-events-none" />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/35 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shine-effect"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>
                      {isEn ? "Submitting details and securing file..." : "جاري إرسال البيانات وتأمين الملف..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-5 h-5 text-white" />
                    <span>
                      {isEn ? "Submit Booking & Free Audit Request" : "تقديم طلب الحجز والفحص المجاني"}
                    </span>
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-2">
                {isEn 
                  ? "100% Free — No Fees — Our team will contact you within 24 hours" 
                  : "مجاني 100% — بدون رسوم — سيتواصل معك الفريق خلال 24 ساعة"
                }
              </p>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="bg-white dark:bg-[#061025] text-[#2C3E50] dark:text-slate-200 transition-colors">
        {innerContent}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#F0F4F8] to-[#E0E7FF] dark:from-slate-900 dark:to-indigo-950 py-20 border-b border-slate-200 dark:border-slate-800 relative z-10 transition-colors" id="booking-section">
      {innerContent}
    </div>
  );
}
