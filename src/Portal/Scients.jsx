import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dna, Cpu, Rocket, ShieldCheck, 
  BrainCircuit, Microscope, ArrowUpRight, 
  FileText, Users, Lightbulb 
} from 'lucide-react';

const NghienCuu = () => {
  const navigate = useNavigate();

  const researchFields = [
    {
      title: "Trí tuệ nhân tạo (AI)",
      icon: <BrainCircuit size={32} />,
      count: "45+ Dự án",
      desc: "Phát triển các mô hình học máy tiên tiến, xử lý ngôn ngữ tự nhiên và thị giác máy tính ứng dụng trong y tế và sản xuất."
    },
    {
      title: "An ninh mạng",
      icon: <ShieldCheck size={32} />,
      count: "28+ Dự án",
      desc: "Nghiên cứu các giải pháp bảo mật chuỗi khối (Blockchain) và hệ thống phòng thủ mã độc thế hệ mới."
    },
    {
      title: "Công nghệ Sinh học",
      icon: <Dna size={32} />,
      count: "32+ Dự án",
      desc: "Giải mã trình tự gene và phát triển các loại vật liệu sinh học thông minh phục vụ nông nghiệp công nghệ cao."
    },
    {
      title: "Vi mạch & Bán dẫn",
      icon: <Cpu size={32} />,
      count: "15+ Dự án",
      desc: "Thiết kế và thử nghiệm chip bán dẫn hiệu năng cao, tối ưu hóa quy trình sản xuất linh kiện điện tử."
    }
  ];

  const publications = [
    {
      title: "Deep Learning in Medical Imaging: A VUST Perspective",
      journal: "Nature Machine Intelligence",
      year: "2025",
      author: "Prof. Le Quang & Team"
    },
    {
      title: "Quantum Computing Algorithms for Supply Chain",
      journal: "IEEE Xplore",
      year: "2024",
      author: "Dr. Nguyen Minh & Co."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-['Inter']">
      {/* 1. HERO RESEARCH - Nền sáng sang trọng */}
      <section className="relative py-24 px-10 border-b border-slate-100 overflow-hidden">
        {/* Decor: Chuyển xanh đậm sang xanh Blue nhạt cho nền trắng */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] -z-0"></div>
        
        <div className="relative z-10 max-w-[1800px] mx-auto">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-[11px] font-[1000] uppercase tracking-[0.3em] text-[#a88c34] mb-10 shadow-sm">
            <Rocket size={16} />
            Innovation & Discovery
          </div>
          
          <h1 className="text-[4rem] md:text-[6.5rem] font-[1000] leading-[0.9] tracking-tighter uppercase mb-8 text-slate-900">
            NGHIÊN CỨU <br />
            <span className="italic text-[#a88c34]">& SÁNG TẠO</span>
          </h1>
          <p className="max-w-2xl text-slate-500 text-xl font-medium leading-relaxed uppercase border-l-4 border-[#a88c34] pl-8">
            VUST cam kết tiên phong trong việc giải quyết các thách thức toàn cầu thông qua nghiên cứu khoa học liên ngành và chuyển giao công nghệ đột phá.
          </p>
        </div>
      </section>

      {/* 2. RESEARCH STATS - Các thẻ chỉ số nổi bật */}
      <section className="py-20 px-10 max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { label: "BÀI BÁO QUỐC TẾ (ISI/SCOPUS)", value: "1,200+", icon: <FileText className="text-[#a88c34]" /> },
          { label: "PHÒNG THÍ NGHIỆM TRỌNG ĐIỂM", value: "15", icon: <Microscope className="text-[#a88c34]" /> },
          { label: "CHUYÊN GIA ĐẦU NGÀNH", value: "250+", icon: <Users className="text-[#a88c34]" /> }
        ].map((stat, i) => (
          <div key={i} className="p-10 bg-slate-50 border border-slate-100 rounded-[3rem] flex flex-col items-center text-center group hover:bg-white hover:shadow-2xl transition-all duration-500">
            <div className="mb-6 p-4 bg-white shadow-lg rounded-2xl group-hover:bg-[#a88c34] group-hover:text-white transition-all duration-500">
              {React.cloneElement(stat.icon, { className: "group-hover:text-white transition-colors" })}
            </div>
            <div className="text-5xl font-[1000] mb-2 text-slate-900">{stat.value}</div>
            <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* 3. STRATEGIC FIELDS - Grid các lĩnh vực */}
      <section className="py-24 px-10 bg-slate-50/50">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter text-slate-900">Lĩnh vực chiến lược</h2>
            <button className="hidden md:flex items-center gap-2 text-[#a88c34] font-black uppercase text-xs tracking-widest hover:underline">
              Xem tất cả lĩnh vực <ArrowUpRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {researchFields.map((field, i) => (
              <div key={i} className="p-10 bg-white rounded-[3.5rem] border border-slate-100 hover:border-[#a88c34]/40 hover:shadow-2xl transition-all group">
                <div className="w-16 h-16 bg-slate-50 text-[#a88c34] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#a88c34] group-hover:text-white transition-all">
                  {field.icon}
                </div>
                <h3 className="text-xl font-[1000] uppercase italic mb-4 tracking-tighter text-slate-900 group-hover:text-[#a88c34] transition-colors">
                  {field.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium uppercase italic">
                  {field.desc}
                </p>
                <div className="text-[10px] font-black text-[#a88c34] uppercase tracking-[0.2em] bg-slate-50 inline-block px-4 py-2 rounded-full">
                  {field.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PUBLICATIONS & JOURNALS */}
      <section className="py-32 px-10">
        <div className="max-w-[1800px] mx-auto grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter mb-12 text-slate-900">Công bố khoa học mới nhất</h2>
            <div className="space-y-6">
              {publications.map((pub, i) => (
                <div key={i} className="p-8 bg-slate-50 border-l-8 border-[#a88c34] rounded-r-[2rem] hover:bg-white hover:shadow-xl transition-all duration-500 border-y border-r border-slate-100">
                  <div className="text-[#a88c34] font-black text-xs uppercase tracking-widest mb-2">{pub.journal} • {pub.year}</div>
                  <h4 className="text-xl font-[1000] leading-snug mb-4 italic uppercase text-slate-900">{pub.title}</h4>
                  <div className="text-slate-400 text-sm font-bold tracking-wide uppercase italic">{pub.author}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Glow effect cho card bản quyền */}
            <div className="absolute -inset-4 bg-[#a88c34]/5 rounded-[4rem] blur-2xl"></div>
            <div className="relative bg-slate-900 rounded-[4rem] p-12 flex flex-col justify-center h-full shadow-2xl overflow-hidden group">
               {/* Decor nhẹ bên trong card tối */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#a88c34]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
               
               <Lightbulb className="text-[#a88c34] mb-8 group-hover:scale-110 transition-transform" size={48} />
               <h3 className="text-3xl font-[1000] italic uppercase tracking-tighter mb-6 text-white leading-tight">
                 Đăng ký bản quyền <br /> sáng chế
               </h3>
               <p className="text-slate-400 font-medium leading-relaxed mb-10 uppercase text-sm italic">
                 Chúng tôi hỗ trợ các nhà khoa học và sinh viên bảo hộ quyền sở hữu trí tuệ cho các phát minh đột phá tại thị trường quốc tế.
               </p>
               <button className="w-full py-6 bg-[#a88c34] text-white rounded-3xl font-[1000] uppercase italic tracking-[0.2em] hover:bg-white hover:text-slate-950 transition-all shadow-xl active:scale-95">
                 Liên hệ hỗ trợ sở hữu trí tuệ
               </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NghienCuu;