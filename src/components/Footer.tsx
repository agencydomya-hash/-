
import React from 'react';
import { Phone, MapPin, Mail, Facebook, Instagram, Linkedin, MessageCircle, ArrowUp } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  lang?: 'ar' | 'en';
}

export default function Footer({ lang = 'ar' }: FooterProps) {
  const isEn = lang === 'en';

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#003D7A] dark:bg-slate-900 text-white/75 py-16 border-t border-white/10 dark:border-slate-800 relative z-10 transition-colors" id="footer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10 dark:border-slate-800 ${isEn ? 'text-left' : 'text-right'}`} dir={isEn ? "ltr" : "rtl"}>
          
          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-4 space-y-4">
            <Logo light lang={lang} />
            <p className="text-xs sm:text-sm text-white/65 leading-relaxed pt-2">
              {isEn 
                ? "A digital and creative marketing agency specializing in crafting premium personal brands for doctors and medical centers in Egypt and Saudi Arabia. We turn medical expertise into influential digital messages." 
                : "وكالة تسويق رقمي وإبداعي متخصصة في صناعة الهوية والبراند الشخصي الفاخر للأطباء والمجمعات الطبية في مصر والمملكة العربية السعودية. نسعى دائماً إلى تحويل المعرفة الطبية لرسالة رقمية مؤثرة وناجحة تزيد الموثوقية وتجذب المرضى."
              }
            </p>
            <div className={`flex items-center gap-3 pt-2 ${isEn ? 'justify-start' : 'justify-start'}`}>
              <a
                href="https://www.facebook.com/domyaworld"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#FF6B35] hover:border-[#FF6B35] transition duration-300"
                aria-label="Facebook Page"
                id="footer-social-facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/domya_marketing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#FF6B35] hover:border-[#FF6B35] transition duration-300"
                aria-label="Instagram Profile"
                id="footer-social-instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/domyaworld"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#FF6B35] hover:border-[#FF6B35] transition duration-300"
                aria-label="LinkedIn Profile"
                id="footer-social-linkedin"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            {/* Trust Badges */}
            <div className={`flex flex-wrap gap-2 items-center pt-3 ${isEn ? 'justify-start' : 'justify-start'}`}>
              <div className="flex items-center gap-1 bg-white/10 border border-white/15 px-2 py-0.5 rounded text-[9px] text-white font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                <span>Google Partner</span>
              </div>
              <div className="flex items-center gap-1 bg-white/10 border border-white/15 px-2 py-0.5 rounded text-[9px] text-white font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-300"></span>
                <span>Meta Business Partner</span>
              </div>
              <div className="flex items-center gap-1 bg-white/10 border border-white/15 px-2 py-0.5 rounded text-[9px] text-white font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]"></span>
                <span>10+ Years Exp</span>
              </div>
            </div>
          </div>

          {/* Column 2: Egypt Office Contacts */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-white font-bold text-sm tracking-wide border-r-4 border-[#FF6B35] pr-2 rtl:border-r-4 ltr:border-l-4 border-[#FF6B35] rtl:pr-2 ltr:pl-2">
              {isEn ? "Egypt Branch Office 🇪🇬" : "فرع جمهورية مصر العربية 🇪🇬"}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-white/75">
              <li className="flex items-start gap-2.5 justify-start">
                <MapPin className="w-4 h-4 text-[#FF6B35] mt-0.5 flex-shrink-0" />
                <span>{isEn ? "Farid Nada St., Qalyubia, Banha, Egypt" : "القليوبية، بنها، شارع فريد ندا، أمام النجدة"}</span>
              </li>
              <li className="flex items-center gap-2.5 justify-start" dir="ltr">
                <Phone className="w-4 h-4 text-[#FF6B35] flex-shrink-0" />
                <a href="tel:+201090121000" className="hover:text-white transition">+201090121000</a>
              </li>
              <li className="flex items-center gap-2.5 justify-start">
                <MessageCircle className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                <a href="https://wa.me/201090121000" target="_blank" rel="noopener noreferrer" className="hover:text-white font-semibold transition">
                  {isEn ? "Direct Chat on WhatsApp" : "تواصل مباشر عبر الواتساب"}
                </a>
              </li>
              <li className="flex items-center gap-2.5 justify-start">
                <Mail className="w-4 h-4 text-[#FF6B35] flex-shrink-0" />
                <a href="mailto:domyaadv@gmail.com" className="hover:text-white transition font-mono">domyaadv@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Saudi KSA Office Contacts */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-white font-bold text-sm tracking-wide border-r-4 border-white/30 pr-2 rtl:border-r-4 ltr:border-l-4 border-white/30 rtl:pr-2 ltr:pl-2">
              {isEn ? "Saudi Arabia Branch Office 🇸🇦" : "فرع المملكة العربية السعودية 🇸🇦"}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-white/75">
              <li className="flex items-start gap-2.5 justify-start">
                <MapPin className="w-4 h-4 text-white/50 mt-0.5 flex-shrink-0" />
                <span>{isEn ? "7221 Prince Mishari bin Abdulaziz, Al Sulaimaniyah, Riyadh, KSA" : "7221 الأمير مشاري بن عبد العزيز، حي السليمانية 4588، الرياض"}</span>
              </li>
              <li className="flex items-center gap-2.5 justify-start" dir="ltr">
                <Phone className="w-4 h-4 text-white/50 flex-shrink-0" />
                <a href="tel:+9660566082850" className="hover:text-white transition">+9660566082850</a>
              </li>
              <li className="flex items-center gap-2.5 justify-start">
                <Mail className="w-4 h-4 text-[#FF6B35] flex-shrink-0" />
                <a href="mailto:domyaadv@gmail.com" className="hover:text-white transition font-mono">domyaadv@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50" dir={isEn ? "ltr" : "rtl"}>
          <div>
            <span>{isEn ? "All rights reserved to DOMYA Agency © June 2026" : "جميع الحقوق محفوظة لوكالة دوميا © يونيو 2026"}</span>
          </div>

          <div className="flex gap-4">
            <span>{isEn ? "DOMYA Advertising Agency - World in your hands" : "وكالة دوميا للدعاية والإعلان - World in your hands"}</span>
          </div>

          <button
            onClick={handleScrollToTop}
            className="p-2.5 bg-white/10 border border-white/20 hover:bg-[#FF6B35] hover:text-white rounded-xl text-white/75 transition duration-300 flex items-center justify-center gap-1 cursor-pointer"
            id="scroll-to-top"
          >
            <span>{isEn ? "Back to top" : "العودة للأعلى"}</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
