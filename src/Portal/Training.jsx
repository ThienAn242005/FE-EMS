import React from 'react';
import {
  Award,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Database,
  Brain,
  Globe,
  Briefcase,
  Sparkles
} from 'lucide-react';

const Training = () => {
  const programs = [
    { title: "Cử nhân CNTT (Đại trà)", code: "7480201", desc: "Chương trình chuẩn của Bộ GD&ĐT với lộ trình tối ưu hóa kỹ năng thực hành." },
    { title: "Cử nhân CNTT (CLP)", code: "7480201_VP", desc: "Chương trình Cử nhân tài năng & Chất lượng cao dành cho sinh viên xuất sắc." },
    { title: "Cử nhân CNTT (Liên kết)", code: "7480201_LK", desc: "Hợp tác đào tạo song bằng với các đại học danh tiếng hàng đầu thế giới." }
  ];

  const majors = [
    {
      icon: <Cpu />,
      title: "Kỹ thuật Phần mềm",
      desc: "Thiết kế – phát triển – vận hành hệ thống phần mềm quy mô lớn."
    },
    {
      icon: <Database />,
      title: "Khoa học Dữ liệu",
      desc: "Phân tích dữ liệu, AI, Machine Learning và hệ sinh thái Big Data."
    },
    {
      icon: <Brain />,
      title: "Trí tuệ Nhân tạo",
      desc: "Nghiên cứu Deep Learning, Computer Vision và xử lý ngôn ngữ NLP."
    },
    {
      icon: <Globe />,
      title: "Mạng & An ninh",
      desc: "Hạ tầng mạng Cloud, an toàn thông tin và phòng thủ an ninh mạng."
    }
  ];

  const outcomes = [
    "Làm việc tại các tập đoàn công nghệ toàn cầu",
    "Tham gia nghiên cứu & học tiếp bậc cao học",
    "Khởi nghiệp công nghệ & đổi mới sáng tạo",
    "Năng lực hội nhập và làm việc quốc tế"
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen font-['Inter']">
      {/* 1. BANNER SECTION - LIGHT ELITE STYLE */}
      <section className="relative py-24 px-10 overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#a88c34]/5 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 max-w-[1800px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-50 border border-slate-200 backdrop-blur rounded-full text-[11px] font-[1000] uppercase tracking-[0.3em] text-[#a88c34] shadow-sm">
              <Sparkles size={16} />
              Elite Education System
            </div>

            <h1 className="text-[4rem] md:text-[6.5rem] font-[1000] uppercase italic tracking-tighter leading-[0.9] text-slate-900">
              ĐÀO TẠO <br />
              <span className="text-[#a88c34]">VUST</span>
            </h1>
            
            <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-xl uppercase border-l-4 border-[#a88c34] pl-8 italic">
              Trường Đại học VUST xây dựng chương trình đào tạo theo định hướng nghiên cứu – ứng dụng, chuẩn quốc tế và gắn kết doanh nghiệp.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-slate-50 border border-slate-100 p-10 rounded-[3.5rem] text-center hover:bg-white hover:shadow-2xl transition-all duration-500 group">
              <Award size={56} className="mx-auto mb-6 text-[#a88c34] group-hover:scale-110 transition-transform" />
              <p className="text-3xl font-[1000] italic tracking-tighter uppercase text-slate-900">AUN-QA</p>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chuẩn Đông Nam Á</span>
            </div>
            <div className="bg-[#a88c34] p-10 rounded-[3.5rem] text-white text-center hover:scale-105 transition-all shadow-2xl shadow-[#a88c34]/20">
              <ShieldCheck size={56} className="mx-auto mb-6" />
              <p className="text-3xl font-[1000] italic tracking-tighter uppercase">ASIIN</p>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Chuẩn Châu Âu</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROGRAMS SECTION - CLEAN CARDS */}
      <section className="py-32 px-10 max-w-[1800px] mx-auto">
        <div className="mb-20 space-y-4">
          <h2 className="text-5xl font-[1000] uppercase italic tracking-tighter text-slate-900">
            Chương trình đào tạo
          </h2>
          <div className="w-24 h-2 bg-[#a88c34] rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {programs.map((p, i) => (
            <div
              key={i}
              className="group p-12 bg-white border border-slate-100 rounded-[4rem] hover:border-[#a88c34]/40 transition-all duration-500 cursor-pointer relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#a88c34]/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-[#a88c34]/10 transition-all"></div>
              
              <span className="text-[#a88c34] font-[1000] text-[10px] tracking-[0.2em] uppercase bg-slate-50 px-3 py-1 rounded-full">
                Mã ngành: {p.code}
              </span>
              <h3 className="text-3xl font-[1000] uppercase italic mt-6 mb-6 group-hover:text-[#a88c34] text-slate-900 leading-tight transition-colors">
                {p.title}
              </h3>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed uppercase text-sm italic">{p.desc}</p>
              
              <div className="flex items-center gap-3 text-xs font-[1000] uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                Xem chi tiết <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SPECIALIZED MAJORS - LIGHT GRID */}
      <section className="py-32 bg-slate-50/50 px-10">
        <div className="max-w-[1800px] mx-auto">
          <div className="mb-20 space-y-4">
            <h2 className="text-5xl font-[1000] uppercase italic tracking-tighter text-slate-900">
              Định hướng chuyên sâu
            </h2>
            <div className="w-24 h-2 bg-[#a88c34] rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {majors.map((m, i) => (
              <div
                key={i}
                className="group bg-white p-12 rounded-[3.5rem] border border-slate-100 hover:border-[#a88c34] transition-all duration-500 shadow-sm hover:shadow-xl"
              >
                <div className="w-20 h-20 rounded-2xl bg-slate-50 text-[#a88c34] flex items-center justify-center mb-8 group-hover:bg-[#a88c34] group-hover:text-white transition-all">
                  {React.cloneElement(m.icon, { size: 36 })}
                </div>
                <h3 className="text-2xl font-[1000] uppercase italic mb-4 tracking-tighter text-slate-900">
                  {m.title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed uppercase text-[12px] italic">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OUTCOMES SECTION - FINAL HIGHLIGHT */}
      <section className="py-32 px-10 max-w-[1800px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <h2 className="text-5xl font-[1000] uppercase italic tracking-tighter leading-tight text-slate-900">
              Chuẩn đầu ra <br /> Sinh viên VUST
            </h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed uppercase border-l-4 border-[#a88c34] pl-8 italic">
              Sinh viên tốt nghiệp được trang bị đầy đủ kiến thức, kỹ năng để thích ứng nhanh với thị trường lao động toàn cầu.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              {outcomes.map((o, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all duration-500 group"
                >
                  <CheckCircle className="text-[#a88c34] group-hover:scale-110 transition-transform" size={24} />
                  <span className="text-[11px] font-[1000] uppercase tracking-widest text-slate-600 group-hover:text-slate-900 transition-colors">
                    {o}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-10 bg-[#a88c34]/5 rounded-[5rem] blur-3xl group-hover:bg-[#a88c34]/10 transition-all"></div>
            <div className="relative bg-slate-900 border border-slate-800 rounded-[5rem] p-16 shadow-2xl overflow-hidden">
               {/* Decor subtle glow inside dark card */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#a88c34]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
               
              <div className="w-24 h-24 bg-[#a88c34] rounded-[2rem] flex items-center justify-center text-white mb-10 shadow-xl shadow-[#a88c34]/20">
                <Briefcase size={48} />
              </div>
              <h3 className="text-4xl font-[1000] uppercase italic mb-6 tracking-tighter text-white">
                Kết nối <br /> doanh nghiệp
              </h3>
              <p className="text-slate-400 font-medium leading-relaxed uppercase text-sm italic">
                VUST hợp tác với nhiều tập đoàn công nghệ lớn (Google, Microsoft, FPT), tạo điều kiện thực tập và đảm bảo việc làm ngay từ năm thứ 3.
              </p>
              <button className="mt-12 w-full py-6 bg-white text-slate-900 rounded-3xl font-[1000] uppercase italic tracking-[0.2em] hover:bg-[#a88c34] hover:text-white transition-all shadow-xl">
                Mạng lưới đối tác
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Training;