import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, BarChart3, Microscope, 
  FlaskConical, Globe, Atom, 
  ArrowRight, Sparkles 
} from 'lucide-react';

const KhoaBoMon = () => {
  const navigate = useNavigate();

  const faculties = [
    {
      id: "fit",
      name: "Công nghệ Thông tin",
      enName: "Faculty of Information Technology",
      icon: <Cpu size={40} />,
      color: "from-blue-600 to-cyan-500",
      desc: "Đơn vị trọng điểm quốc gia về đào tạo nguồn nhân lực CNTT chất lượng cao, dẫn đầu về nghiên cứu AI và Cybersecurity.",
      majors: ["Khoa học máy tính", "Kỹ thuật phần mềm", "Hệ thống thông tin"]
    },
    {
      id: "fme",
      name: "Toán – Tin học",
      enName: "Faculty of Mathematics & Computer Science",
      icon: <BarChart3 size={40} />,
      color: "from-purple-600 to-pink-500",
      desc: "Nền tảng của mọi ngành khoa học hiện đại, chuyên sâu về toán ứng dụng, cơ sở dữ liệu và thống kê số lớn.",
      majors: ["Toán học", "Toán ứng dụng", "Thống kê dữ liệu"]
    },
    {
      id: "fbp",
      name: "Vật lý – Vật lý kỹ thuật",
      enName: "Faculty of Physics & Engineering Physics",
      icon: <Atom size={40} />,
      color: "from-orange-500 to-red-600",
      desc: "Nghiên cứu các quy luật của vũ trụ và ứng dụng công nghệ vật lý vào đời sống, điện tử vi mạch.",
      majors: ["Vật lý hạt nhân", "Vật lý điện tử", "Quang tử"]
    },
    {
      id: "fch",
      name: "Hóa học",
      enName: "Faculty of Chemistry",
      icon: <FlaskConical size={40} />,
      color: "from-green-500 to-emerald-600",
      desc: "Nơi nghiên cứu vật liệu mới, hóa dược và các quy trình công nghệ hóa học tiên tiến.",
      majors: ["Hóa hữu cơ", "Hóa dược", "Công nghệ hóa học"]
    },
    {
      id: "fbi",
      name: "Sinh học – Công nghệ Sinh học",
      enName: "Faculty of Biology & Biotechnology",
      icon: <Microscope size={40} />,
      color: "from-teal-500 to-blue-500",
      desc: "Đi đầu trong nghiên cứu di truyền, tế bào gốc và ứng dụng công nghệ sinh học vào nông nghiệp, y tế.",
      majors: ["Công nghệ sinh học", "Vi sinh vật học", "Sinh học phân tử"]
    },
    {
      id: "fenv",
      name: "Môi trường",
      enName: "Faculty of Environment",
      icon: <Globe size={40} />,
      color: "from-cyan-500 to-green-500",
      desc: "Giải quyết các thách thức về biến đổi khí hậu, quản lý tài nguyên và bảo vệ hệ sinh thái bền vững.",
      majors: ["Khoa học môi trường", "Quản lý tài nguyên"]
    }
  ];

  return (
    /* ĐỔI: bg-[#020617] text-white -> bg-white text-slate-900 */
    <div className="min-h-screen bg-white text-slate-900 font-['Inter']">
      
      {/* HEADER SECTION */}
      <section className="relative py-24 px-10 overflow-hidden border-b border-slate-100">
        {/* Lớp decor chìm điều chỉnh cho nền sáng */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-slate-50 to-transparent"></div>
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-[#a88c34]/5 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 max-w-[1800px] mx-auto">
          {/* Badge: Đổi bg-white/5 -> bg-slate-100 */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-100 border border-slate-200 backdrop-blur rounded-full text-[11px] font-[1000] uppercase tracking-[0.3em] text-[#a88c34] mb-8 shadow-sm">
            <Sparkles size={16} />
            VUST Academic Structure
          </div>
          
          <h1 className="text-[4rem] md:text-[6rem] font-[1000] leading-none tracking-tighter uppercase mb-6 text-slate-900">
            KHOA & <br />
            <span className="italic text-[#a88c34]">BỘ MÔN</span>
          </h1>
          <div className="w-32 h-3 bg-[#a88c34] rounded-full mb-8"></div>
          <p className="max-w-2xl text-slate-500 text-xl font-medium leading-relaxed uppercase">
            Hệ thống đào tạo đa ngành với các đơn vị mũi nhọn dẫn đầu trong lĩnh vực Khoa học & Công nghệ.
          </p>
        </div>
      </section>

      {/* FACULTIES GRID */}
      <section className="py-24 px-10">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {faculties.map((fac) => (
            <div 
              key={fac.id}
              className="group relative bg-slate-50 rounded-[4rem] p-12 border border-slate-100 hover:border-[#a88c34]/40 hover:bg-white hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer"
              onClick={() => navigate(`/khoa/${fac.id}`)}
            >
              {/* Background Glow - Giảm độ đậm cho nền trắng */}
              <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${fac.color} opacity-0 group-hover:opacity-5 rounded-full blur-[60px] transition-opacity duration-500`}></div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
                {/* Icon Box - Giữ nguyên màu Gradient để làm điểm nhấn */}
                <div className={`shrink-0 w-24 h-24 bg-gradient-to-br ${fac.color} rounded-[2rem] flex items-center justify-center text-white shadow-xl transition-transform duration-500 group-hover:rotate-[-10deg]`}>
                  {fac.icon}
                </div>

                <div className="flex-grow space-y-4">
                  <div>
                    <h3 className="text-3xl font-[1000] italic uppercase tracking-tighter text-slate-900 group-hover:text-[#a88c34] transition-colors">
                      Khoa {fac.name}
                    </h3>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-1">
                      {fac.enName}
                    </p>
                  </div>
                  
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {fac.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-4">
                    {fac.majors.map(major => (
                      <span key={major} className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-600 shadow-sm">
                        {major}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="self-end md:self-center">
                  {/* Arrow: Đổi bg-white/5 -> bg-white */}
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-[#a88c34] group-hover:text-white group-hover:border-[#a88c34] transition-all duration-500 shadow-sm">
                    <ArrowRight size={32} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-10">
        <div className="max-w-[1800px] mx-auto bg-[#a88c34] rounded-[5rem] p-20 text-white flex flex-col lg:flex-row justify-between items-center gap-10 overflow-hidden relative shadow-2xl shadow-[#a88c34]/20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          
          <div className="relative z-10">
            <h2 className="text-[3.5rem] font-[1000] italic leading-tight uppercase tracking-tighter">
              BẠN ĐÃ SẴN SÀNG <br /> GIA NHẬP VUST?
            </h2>
            <p className="text-white/80 font-bold uppercase tracking-widest mt-4">Tìm hiểu quy trình tuyển sinh ngay hôm nay</p>
          </div>

          <button 
            onClick={() => navigate('/tuyen-sinh')}
            className="relative z-10 px-16 py-8 bg-slate-900 text-white rounded-[2.5rem] font-[1000] uppercase italic tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 group"
          >
            Đăng ký tuyển sinh
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default KhoaBoMon;