
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Stethoscope, CheckCircle, Clock, Calendar, ShieldCheck, Mail, Phone, Globe, ChevronDown, Award } from 'lucide-react';
import { DiagnosisOutput } from '../types';

interface BookingFormProps {
  diagnosisRef: DiagnosisOutput | null;
  onSuccess: () => void;
  lang?: 'ar' | 'en';
}

export default function BookingForm({ diagnosisRef, onSuccess, lang = 'ar' }: BookingFormProps) {
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

  return (
    <div className="bg-gradient-to-br from-[#F0F4F8] to-[#E0E7FF] dark:from-slate-900 dark:to-indigo-950 py-20 border-b border-slate-200 dark:border-slate-800 relative z-10 transition-colors" id="booking-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className={`text-center mb-12 space-y-3 ${isEn ? 'text-left lg:text-center' : 'text-right lg:text-center'}`} dir={isEn ? "ltr" : "rtl"}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/25 text-[#FF6B35] rounded-full text-sm font-semibold">
            <Calendar className="w-4 h-4" />
            <span>{isEn ? "Schedule Free Consultation" : "جدولة الاستشارة المجانية"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-[#003D7A] dark:text-white">
            {isEn ? "Book Free Medical Branding & Shoot Consultation 📞" : "احجز استشارة براندنج طبي وتصوير مجانية 📞"}
          </h2>
          <p className="text-[#2C3E50] dark:text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-semibold">
            {isEn 
              ? "Submit your medical details now. A branding consultant from DOMYA will contact you to schedule a clinic visit and analyze your digital presence."
              : "سجل بياناتك الطبية الآن، ليقوم مستشار تسويق من فريق دوميا بالاتصال بك وترتيب موعد لزيارة العيادة ودراسة حالتك الرقمية بالتفصيل."
            }
          </p>
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

            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F0F4F8] dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 ${isEn ? 'text-left' : 'text-right'} text-xs max-w-lg mx-auto`}>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#FF6B35]" />
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block">
                    {isEn ? "Expected Contact Time:" : "وقت الاتصال المتوقع:"}
                  </span>
                  <span className="font-bold text-[#2C3E50] dark:text-slate-300">
                    {isEn ? "Within 24 working hours" : "خلال 24 ساعة عمل"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block">
                    {isEn ? "File Security:" : "نوع الملف:"}
                  </span>
                  <span className="font-bold text-[#10B981]">
                    {isEn ? "Doctor data privacy guaranteed 🔒" : "سرية بيانات الطبيب مضمونة 🔒"}
                  </span>
                </div>
              </div>
            </div>

            {/* Email Confirmation Notice */}
            <div className={`bg-blue-50 dark:bg-indigo-950/20 border border-blue-200 dark:border-indigo-900/35 p-4 rounded-xl ${isEn ? 'text-left' : 'text-right'} space-y-2 max-w-lg mx-auto`}>
              <div className={`flex items-center gap-2 ${isEn ? 'justify-start' : 'justify-start'}`}>
                <Mail className="w-5 h-5 text-[#003D7A] dark:text-indigo-400" />
                <span className="font-bold text-[#003D7A] dark:text-indigo-400 text-sm">
                  {isEn ? "Email Confirmation Sent" : "تم إرسال تأكيد بالبريد الإلكتروني"}
                </span>
              </div>
              <p className="text-xs text-[#2C3E50] dark:text-slate-300 leading-relaxed font-semibold">
                {isEn 
                  ? `A confirmation email was sent to your email address${form.email && form.email !== 'unspecified' ? ` (${form.email})` : ''} containing details of your request.`
                  : `تم إرسال إيميل تأكيدي إلى بريدك الإلكتروني${form.email && form.email !== 'غير محدد' ? ` (${form.email})` : ''} يتضمن تفاصيل حجزك، كما تم إرسال بياناتك لفريق دوميا للمتابعة الفورية.`
                }
              </p>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
              {isEn 
                ? "Representatives from Egypt office (+20109) or Saudi office (+9665) will contact you on Phone or WhatsApp directly."
                : "ممثلو مكتب مصر (+20109) أو مكتب السعودية (+9665) سيتواصلون معك عبر الهاتف أو الواتساب مباشرة."
              }
            </p>
          </motion.div>
        ) : (
          /* Form Card */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-[32px] shadow-lg p-8 sm:p-12 relative overflow-hidden transition-colors"
            id="booking-form-wrapper"
            dir={isEn ? "ltr" : "rtl"}
          >
            {/* Branded Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#003D7A] via-[#FF6B35] to-[#003D7A]" />

            {diagnosisRef && (
              <div className="mb-6 p-4 bg-[#FF6B35]/10 border border-[#FF6B35]/25 text-[#FF6B35] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
                <Award className="w-5 h-5 text-[#FF6B35]" />
                <span>
                  {isEn 
                    ? `Prescription Rx #${diagnosisRef.id} linked successfully! Form pre-filled for you Dr. 🩺`
                    : `تم ربط الروشتة العلاجية رقم ${diagnosisRef.id} بنجاح! تم تعبئة البيانات تلقائياً دكتور 🩺`
                  }
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/35 text-red-650 rounded-lg font-semibold text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Doctor Name */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    {isEn ? "Doctor's Full Name" : "اسم الطبيب الكريم"} <span className="text-[#FF6B35]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder={isEn ? "e.g., Dr. John Doe" : "مثال: د. هاني الرفاعي"}
                    value={form.name}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>

                {/* Specialty */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    {isEn ? "Medical Sub-Specialty" : "التخصص الدقيق"} <span className="text-[#FF6B35]">*</span>
                  </label>
                  <input
                    type="text"
                    name="specialty"
                    required
                    placeholder={isEn ? "e.g., Plastic & Reconstructive Surgery" : "مثال: جراحة التجميل والترميم"}
                    value={form.specialty}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Clinic / Hospital Name */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    {isEn ? "Clinic or Medical Center Name" : "اسم العيادة أو المركز الطبي"}
                  </label>
                  <input
                    type="text"
                    name="clinicName"
                    placeholder={isEn ? "e.g., Elite Aesthetic Center" : "مثال: مجمع عيادات الرفاعي لطب المفاصل"}
                    value={form.clinicName}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    {isEn ? "Phone Number (Phone & WhatsApp)" : "رقم الهاتف للاتصال والواتساب"} <span className="text-[#FF6B35]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder={isEn ? "e.g., +201090121000 or +9665..." : "مثال: +201090121000 أو +9665..."}
                      value={form.phone}
                      onChange={handleInputChange}
                      className={inputClass + (isEn ? " pl-10" : " pr-10")}
                      dir="ltr"
                    />
                    <Phone className={`w-4 h-4 text-slate-400 absolute top-1/2 ${isEn ? 'left-3.5' : 'right-3.5'} -translate-y-1/2`} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    {isEn ? "Email Address" : "البريد الإلكتروني"}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="doctor@example.com"
                      value={form.email}
                      onChange={handleInputChange}
                      className={inputClass + (isEn ? " pl-10" : " pr-10")}
                      dir="ltr"
                    />
                    <Mail className={`w-4 h-4 text-slate-400 absolute top-1/2 ${isEn ? 'left-3.5' : 'right-3.5'} -translate-y-1/2`} />
                  </div>
                </div>

                {/* Current Social Link */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    {isEn ? "Current Social Page Link (Optional)" : "رابط صفحتك الحالية إن وجد"}
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="socialLink"
                      placeholder="https://facebook.com/doctor.page"
                      value={form.socialLink}
                      onChange={handleInputChange}
                      className={inputClass + (isEn ? " pl-10" : " pr-10")}
                      dir="ltr"
                    />
                    <Globe className={`w-4 h-4 text-slate-400 absolute top-1/2 ${isEn ? 'left-3.5' : 'right-3.5'} -translate-y-1/2`} />
                  </div>
                </div>
              </div>

              {/* Selection of Marketing Goals */}
              <div className="space-y-1.5">
                <label className={labelClass}>
                  {isEn ? "Primary Brand & Growth Goal" : "الهدف الأبرز للبراندينج وعيادتك"}
                </label>
                <div className="relative">
                  <select
                    name="goal"
                    value={form.goal}
                    onChange={handleInputChange}
                    className={inputClass + " appearance-none"}
                  >
                    <option value="جذب مرضى حقيقيين وزيادة تعاقدات العيادة">
                      {isEn ? "Attract actual patients & increase clinic bookings 📈" : "جذب مرضى حقيقيين وزيادة حجوزات العيادة 📈"}
                    </option>
                    <option value="تثبيت الهيبة والمصداقية العلمية ومواجهة المنافسين">
                      {isEn ? "Establish scientific authority & beat competitors 🛡️" : "تثبيت المصداقية العلمية ومواجهة المنافسين 🛡️"}
                    </option>
                    <option value="بناء براند متكامل وتصوير Reels احترافي بالعيادة">
                      {isEn ? "Build a complete brand & shoot professional Reels 🎥" : "بناء براند متكامل وتصوير Reels احترافي بالعيادة 🎥"}
                    </option>
                    <option value="توسيع الانتشار والوصول لصفحات التلفزيون أو السفر الطبي">
                      {isEn ? "Expand reach & secure premium media appearances 🌟" : "توسيع الانتشار والوصول للظهور الإعلامي المتميز 🌟"}
                    </option>
                    <option value="بناء البراند الطبي الموصى به في الروشتة الذكية">
                      {isEn ? "Build the recommended medical brand from Rx 📝" : "بناء البراند الطبي الموصى به في الروشتة الذكية 📝"}
                    </option>
                  </select>
                  <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 ${isEn ? 'right-3.5' : 'left-3.5'} -translate-y-1/2 pointer-events-none`} />
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
    </div>
  );
}
