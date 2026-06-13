import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, Phone, MapPin, Facebook, 
  Linkedin, Youtube, ArrowUpRight, 
  Globe2, ShieldCheck, Sparkles, LayoutGrid
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Danh sách đối tác đồng bộ với Header (grayscale nhạt trên nền tối)
  const partners = [
    { name: "VNPAY", logo: "https://vnpay.vn/wp-content/uploads/2020/07/Logo-VNPAY.png" },
    { name: "Vietcombank", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Logo_Vietcombank.svg/1280px-Logo_Vietcombank.svg.png" },
    { name: "BIDV", logo: "https://upload.wikimedia.org/wikipedia/vi/thumb/a/a2/Logo_BIDV.svg/1200px-Logo_BIDV.svg.png" },
    { name: "FPT Software", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/FPT_Software_logo.svg/2560px-FPT_Software_logo.svg.png" },
    { name: "NVIDIA", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Nvidia_logo.svg/2560px-Nvidia_logo.svg.png" }
  ];

  const faculties = [
    "Công nghệ Thông tin", "Toán – Tin học", "Vật lý kỹ thuật", 
    "Hóa học", "Công nghệ Sinh học", "Khoa học Môi trường"
  ];

  return (
    <footer className="w-full font-['Inter'] shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.5)]">
      
      {/* ===== TẦNG 1: ĐỐI TÁC CHIẾN LƯỢC (Nền Đen - Đồng bộ Top Bar) ===== */}
      <div className="bg-[#020617] py-12 border-b border-white/5">
        <div className="max-w-[1800px] mx-auto px-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-10 text-center italic">
            Strategic Partners & Global Accreditations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 hover:opacity-100 transition-opacity duration-700">
            {partners.map((p, i) => (
              <img 
                key={i} 
                src={p.logo} 
                alt={p.name} 
                className="h-7 md:h-9 object-contain brightness-0 invert" 
              />
            ))}
          </div>
        </div>
      </div>

      {/* ===== TẦNG 2: NỘI DUNG CHÍNH (Nền Navy - Đồng bộ Main Nav) ===== */}
      <div className="bg-[#0f172a] text-white py-24 px-10 relative overflow-hidden">
        {/* Decor: Ánh vàng chìm đặc trưng */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#a88c34]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
          
          {/* Cột 1: VUST Identity */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-[#a88c34] rounded-2xl flex items-center justify-center text-slate-950 font-[1000] text-xl shadow-2xl transition-transform group-hover:rotate-[-6deg]">
                VUST
              </div>
              <div>
                <h2 className="text-xl font-[1000] tracking-tighter uppercase leading-none">
                  VUST <span className="text-[#a88c34] italic">UNIVERSITY</span>
                </h2>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Empowering Excellence</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium uppercase leading-relaxed italic border-l-2 border-[#a88c34]/30 pl-6">
              Hệ thống giáo dục số tiên tiến, nơi hội tụ những tài năng công nghệ dẫn dắt tương lai toàn cầu.
            </p>
            <div className="flex gap-4 pt-4">
              {[Facebook, Linkedin, Youtube, Globe2].map((Icon, i) => (
                <a key={i} href="#" className="w-11 h-11 rounded-2xl bg-slate-800/50 flex items-center justify-center text-[#a88c34] hover:bg-[#a88c34] hover:text-slate-950 transition-all shadow-xl">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Cột 2: Các khoa đào tạo */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#a88c34] flex items-center gap-3">
              <div className="w-6 h-[2px] bg-[#a88c34]"></div>
              Academic Faculties
            </h4>
            <ul className="space-y-4">
              {faculties.map((item, i) => (
                <li key={i}>
                  <Link to="/khoa-bo-mon" className="group text-sm font-bold uppercase text-slate-400 hover:text-white transition-colors flex items-center gap-2 italic">
                    {item} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#a88c34]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Quick Links */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#a88c34] flex items-center gap-3">
              <div className="w-6 h-[2px] bg-[#a88c34]"></div>
              University Portal
            </h4>
            <ul className="space-y-4">
              {["Tuyển sinh 2026", "Công khai giáo dục", "Nghiên cứu khoa học", "Thư viện số", "Portal Sinh viên"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-sm font-bold uppercase text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Liên hệ & Hotline */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#a88c34] flex items-center gap-3">
              <div className="w-6 h-[2px] bg-[#a88c34]"></div>
              Contact Center
            </h4>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <MapPin className="text-[#a88c34] shrink-0" size={20} />
                <p className="text-sm font-bold uppercase text-slate-400 italic leading-snug">
                  227 Nguyễn Văn Cừ, P.4, Q.5, <br /> TP. Hồ Chí Minh, Việt Nam
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <Mail className="text-[#a88c34] shrink-0" size={20} />
                <p className="text-sm font-bold uppercase text-slate-400 tracking-tighter">contact@vust.edu.vn</p>
              </div>
              
              {/* Hotline Button Style */}
              <div className="mt-8 p-6 bg-slate-800/50 border border-white/5 rounded-[2rem] relative group cursor-pointer hover:bg-slate-800 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-[#a88c34] text-slate-950 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                    <Phone size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Admissions Hotline</span>
                    <p className="text-2xl font-[1000] italic tracking-tighter text-white">1900 60XX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TẦNG 3: BOTTOM BAR (Nền Đen cực đậm) ===== */}
      <div className="bg-[#020617] py-10 px-10 border-t border-white/5">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
              <ShieldCheck className="text-[#a88c34]" size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified Institution</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              © {currentYear} VUST IDENTITY. ALL RIGHTS RESERVED.
            </p>
          </div>
          
          <div className="flex gap-10">
            {["Chính sách bảo mật", "Điều khoản sử dụng", "Sơ đồ trang"].map((link, i) => (
              <a key={i} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-[#a88c34] transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;