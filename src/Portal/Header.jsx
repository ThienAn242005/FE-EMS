import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, Globe, Menu, X, ArrowRight, LayoutGrid } from "lucide-react";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setOpen(false);
  }, [location]);

  const navItems = [
    { name: "Giới thiệu", path: "/gioi-thieu" },
    { name: "Tuyển sinh", path: "/tuyen-sinh" },
    { name: "Khoa – Bộ môn", path: "/khoa-bo-mon" },
    { name: "Nghiên cứu", path: "/nghien-cuu" },
    { name: "Công khai giáo dục", path: "/cong-khai" },
    { name: "Đào tạo", path: "/dao-tao" },
  ];

  return (
    <header className="fixed top-0 z-[100] w-full font-['Inter'] shadow-2xl">
      {/* ===== TOP BAR (SOLID DARK) ===== */}
      <div className="bg-[#020617] text-[#94a3b8] text-[10px] font-black tracking-[0.2em] uppercase border-b border-white/5 relative z-20">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between px-10">
          <div className="flex gap-10">
            <Link to="/giang-vien" className="hover:text-[#a88c34] transition-colors">Cán bộ & Giảng viên</Link>
            <Link to="/sinh-vien" className="hover:text-[#a88c34] transition-colors">Sinh viên</Link>
            <Link to="/lien-ket" className="hover:text-[#a88c34] transition-colors">Liên kết nhanh</Link>
          </div>

          <div className="flex items-center gap-8">
            <button className="flex items-center gap-2 hover:text-white transition-colors group">
              <Globe size={12} className="group-hover:rotate-12 transition-transform" /> 
              <span>EN</span>
            </button>
            <div className="h-3 w-[1px] bg-slate-800"></div>
            <Search size={14} className="hover:text-[#a88c34] cursor-pointer transition-transform hover:scale-110" />
          </div>
        </div>
      </div>

      {/* ===== MAIN NAV (SOLID & BOLD) ===== */}
      <div className={`w-full bg-[#0f172a] border-b border-white/10 transition-all duration-300 ${scrolled ? "h-[100px]" : "h-[130px]"}`}>
        <div className="max-w-[1800px] mx-auto px-10 h-full flex items-center justify-between">
          
          {/* LOGO SECTION */}
          <Link to="/" className="flex items-center gap-6 group shrink-0">
            <div className="w-16 h-16 bg-[#a88c34] rounded-[1.5rem] flex items-center justify-center text-slate-950 font-[1000] text-2xl shadow-xl transition-transform group-hover:rotate-[-6deg]">
              VUST
            </div>

            <div className="flex flex-col">
              <h1 className="text-[14px] font-black leading-none tracking-tighter text-white/70">
                VIETNAM UNIVERSITY OF
              </h1>
              <h2 className="text-[2.2rem] font-[1000] text-white leading-none tracking-tighter mt-1 uppercase">
                SCIENCE & <span className="italic text-[#a88c34]">TECHNOLOGY</span>
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-8 h-[2px] bg-[#a88c34]"></div>
                <p className="text-[9px] uppercase font-black tracking-[0.3em] text-slate-400">
                  Empowering Excellence
                </p>
              </div>
            </div>
          </Link>

          {/* DESKTOP MENU (WITH ACTIVE STATE) */}
          <nav className="hidden xl:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  px-5 py-3 text-[13px] font-[1000] uppercase italic tracking-tighter transition-all relative group whitespace-nowrap
                  ${isActive ? "text-[#a88c34]" : "text-slate-300 hover:text-white"}
                `}
              >
                <span className="relative z-10">{item.name}</span>
                {/* Underline matching home accent */}
                <span className={`absolute bottom-1 left-5 h-[3px] bg-[#a88c34] transition-all duration-300 group-hover:w-8 ${location.pathname === item.path ? "w-8" : "w-0"}`}></span>
              </NavLink>
            ))}
            
            <div className="ml-8 flex items-center gap-4 shrink-0 border-l border-white/10 pl-8">
              <Link to="/" className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-[#a88c34] transition-all">
                <LayoutGrid size={22} />
              </Link>
              <Link 
                to="/login" 
                className="px-10 py-4 bg-[#a88c34] text-slate-950 rounded-[1.2rem] text-[12px] font-[1000] uppercase italic tracking-widest hover:bg-white transition-all shadow-lg active:scale-95"
              >
                Portal Login
              </Link>
            </div>
          </nav>

          {/* MOBILE TOGGLE */}
          <button
            className="xl:hidden p-5 rounded-2xl bg-slate-800 text-white border border-white/10"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      <div className={`fixed inset-0 bg-[#020617] transition-all duration-500 xl:hidden z-[-1] ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className="flex flex-col h-full px-12 py-44">
          <div className="space-y-4">
            {navItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center justify-between text-[2.5rem] font-[1000] italic uppercase transition-all transform
                  ${open ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"}
                  ${isActive ? "text-[#a88c34]" : "text-white hover:text-[#a88c34]"}
                `}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {item.name}
                <ArrowRight size={32} className="text-[#a88c34]" />
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;