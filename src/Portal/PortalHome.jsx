import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, Flag, Landmark, ArrowRight, 
  Library, Cpu, GraduationCap, Globe2 
} from 'lucide-react';

const PortalHome = () => {
  const navigate = useNavigate();

  const achievements = [
    { icon: <Trophy />, title: "Huân chương Lao động", desc: "Đạt hạng Nhất trong sự nghiệp giáo dục và đào tạo." },
    { icon: <Globe2 />, title: "Top 200 QS Asia", desc: "Xếp hạng cao trong các đại học hàng đầu Châu Á." },
    { icon: <Cpu />, title: "Trọng điểm Quốc gia", desc: "Khoa CNTT là đơn vị mũi nhọn về chuyển đổi số." }
  ];

  const quickMenu = [
    { title: "Đào tạo", path: "/dao-tao", color: "bg-blue-600", icon: <GraduationCap /> },
    { title: "Tuyển sinh", path: "/tuyen-sinh", color: "bg-[#a88c34]", icon: <Library /> },
    { title: "Giới thiệu", path: "/gioi-thieu", color: "bg-slate-900", icon: <Flag /> }
  ];

  return (
    <div className="bg-white">
      {/* HERO PORTAL */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/1920/1080?university,campus"
            alt="campus"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/85 to-slate-900/40"></div>
        </div>

        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#a88c34]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[140px]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur rounded-full text-xs font-black uppercase tracking-[0.2em] text-white">
              <Landmark size={14} className="text-[#a88c34]" />
              25 Years of Excellence
            </div>

            <h1 className="text-[3.5rem] md:text-[5rem] xl:text-[6.5rem] font-[1000] text-white leading-[0.95] tracking-tight">
              VUST <br />
              <span className="italic text-[#a88c34]">Academic</span> <br />
              Portal
            </h1>

            <p className="max-w-xl text-slate-300 text-lg md:text-xl font-medium leading-relaxed">
              Empowering Academic Excellence through Digital Innovation and 
              shaping the future generation of technology leaders.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate("/login")}
                className="group bg-[#a88c34] text-slate-900 px-9 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:bg-white transition-all shadow-2xl"
              >
                Đăng nhập
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/gioi-thieu")}
                className="px-9 py-4 rounded-2xl border border-white/30 text-white font-black uppercase text-xs tracking-widest hover:bg-white hover:text-slate-900 transition-all backdrop-blur"
              >
                Giới thiệu
              </button>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#a88c34]/30 to-transparent rounded-[3.5rem] blur-2xl"></div>
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[3.5rem] p-10 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/90 rounded-3xl p-6 text-center shadow">
                  <GraduationCap className="mx-auto text-[#a88c34] mb-3" size={36} />
                  <div className="text-2xl font-black text-slate-900">15,000+</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Students</div>
                </div>
                <div className="bg-white/90 rounded-3xl p-6 text-center shadow">
                  <Cpu className="mx-auto text-[#a88c34] mb-3" size={36} />
                  <div className="text-2xl font-black text-slate-900">120+</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Programs</div>
                </div>
                <div className="bg-white/90 rounded-3xl p-6 text-center shadow col-span-2">
                  <Globe2 className="mx-auto text-[#a88c34] mb-3" size={36} />
                  <div className="text-xl font-black text-slate-900">
                    Top QS Asia University
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Global Recognition
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK MENU */}
      <section className="relative -mt-20 z-20 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickMenu.map((item, i) => (
          <div
            key={i}
            onClick={() => navigate(item.path)}
            className={`${item.color} p-10 rounded-[3rem] text-white shadow-2xl cursor-pointer hover:scale-105 transition-all group relative overflow-hidden`}
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
              {React.cloneElement(item.icon, { size: 120 })}
            </div>
            <h3 className="text-3xl font-black uppercase italic mb-2">{item.title}</h3>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-6">Khám phá phân khu</p>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-all">
              <ArrowRight size={24} />
            </div>
          </div>
        ))}
      </section>

      {/* ACHIEVEMENTS */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900">Thành tựu xuất sắc</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Khẳng định chất lượng đào tạo hàng đầu</p>
          <div className="w-24 h-2 bg-[#a88c34] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {achievements.map((item, i) => (
            <div key={i} className="group p-10 bg-slate-50 rounded-[3.5rem] hover:bg-white hover:shadow-2xl transition-all text-center">
              <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center mx-auto mb-8 text-[#a88c34] group-hover:bg-[#a88c34] group-hover:text-white transition-all">
                {React.cloneElement(item.icon, { size: 36 })}
              </div>
              <h4 className="text-xl font-black uppercase italic mb-4 text-slate-800">{item.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HIGHLIGHT */}
      <section className="py-24 bg-slate-50 rounded-[5rem] mx-6 mb-24 px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <img src="https://picsum.photos/800/600?award" className="rounded-[4rem] shadow-2xl relative z-10" alt="achieve" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#a88c34] rounded-[3rem] -z-0"></div>
          </div>
          <div className="space-y-6">
            <h3 className="text-4xl font-black uppercase italic leading-tight">
              Ghi nhận sự nỗ lực <br /> không ngừng nghỉ
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Khoa Công nghệ Thông tin liên tục nhận được các giải thưởng cao quý từ Chính phủ và các tổ chức Giáo dục Quốc tế.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
                <Trophy className="text-[#a88c34]" />
                <span className="font-bold text-sm">Giải Nhất Olympic Tin học sinh viên toàn quốc</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
                <Globe2 className="text-[#a88c34]" />
                <span className="font-bold text-sm">Đối tác chiến lược Google & Microsoft</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortalHome;
