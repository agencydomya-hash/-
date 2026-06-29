/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, MapPin, Mail, Facebook, Instagram, Linkedin, MessageCircle, ArrowUp } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050b1a] text-gray-400 py-16 border-t border-white/5 relative z-10" id="footer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 text-right pb-12 border-b border-white/5">
          
          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-4 space-y-4">
            <Logo light />
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed pt-2">
              وكالة تسويق رقمي وإبداعي متخصصة في صناعة الهوية والبراند الشخصي الفاخر للأطباء والمجمعات الطبية في مصر والمملكة العربية السعودية. نسعى دائماً إلى تحويل المعرفة الطبية لرسالة رقمية مؤثرة وناجحة تزيد الموثوقية وتجذب المرضى.
            </p>
            <div className="flex justify-start items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/domyaworld"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#FF8C00] hover:border-orange-500 transition duration-300"
                aria-label="Facebook Page"
                id="footer-social-facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/domya_marketing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#FF8C00] hover:border-orange-500 transition duration-300"
                aria-label="Instagram Profile"
                id="footer-social-instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/domyaworld" // or custom linkedIn if needed
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#FF8C00] hover:border-orange-500 transition duration-300"
                aria-label="LinkedIn Profile"
                id="footer-social-linkedin"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Egypt Office Contacts */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-white font-bold text-sm tracking-wide border-r-4 border-[#FF8C00] pr-2">
              فرع جمهورية مصر العربية 🇪🇬
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5 justify-start">
                <MapPin className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span>القليوبية، بنها، شارع فريد ندا، أمام النجدة</span>
              </li>
              <li className="flex items-center gap-2.5 justify-start" dir="ltr">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <a href="tel:+201090121000" className="hover:text-[#FF8C00] transition">+201090121000</a>
              </li>
              <li className="flex items-center gap-2.5 justify-start">
                <MessageCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <a href="https://wa.me/201090121000" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 font-semibold transition">تواصل مباشر عبر الواتساب</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Saudi KSA Office Contacts */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-white font-bold text-sm tracking-wide border-r-4 border-blue-500 pr-2">
              فرع المملكة العربية السعودية 🇸🇦
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5 justify-start">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>7221 الأمير مشاري بن عبد العزيز، حي السليمانية 4588، الرياض</span>
              </li>
              <li className="flex items-center gap-2.5 justify-start" dir="ltr">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="tel:+9660566082850" className="hover:text-blue-400 transition">+9660566082850</a>
              </li>
              <li className="flex items-center gap-2.5 justify-start">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <a href="mailto:Contact@domya.net" className="hover:text-[#FF8C00] transition font-mono">Contact@domya.net</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div>
            <span>جميع الحقوق محفوظة لوكالة دومايا © يونيو 2026</span>
          </div>

          <div className="flex gap-4">
            <span>وكالة دومايا للدعاية والإعلان - World in your hands</span>
          </div>

          <button
            onClick={handleScrollToTop}
            className="p-2.5 bg-white/5 border border-white/10 hover:bg-[#FF8C00] hover:text-white rounded-xl text-gray-300 transition duration-300 flex items-center justify-center gap-1 cursor-pointer"
            id="scroll-to-top"
          >
            <span>العودة للأعلى</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
