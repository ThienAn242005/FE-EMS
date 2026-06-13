import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History, Target, ShieldCheck, 
  Users2, Building2, Sparkles, ArrowRight,
  Globe
} from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  const milestones = [
    { year: "1995", event: "Thành lập Tiền thân Khoa Công nghệ Thông tin VUST." },
    { year: "2000", event: "Khởi động chương trình đào tạo Cử nhân Tài năng mũi nhọn." },
    { year: "2011", event: "Trở thành đơn vị đầu tiên đạt chuẩn kiểm định quốc tế AUN-QA." },
    { year: "2023", event: "Xác lập vị thế trung tâm đổi mới sáng tạo CNTT với hơn 5000 sinh viên xuất sắc." }
  ];

  return (
    /* ĐỔI: bg-[#020617] -> bg-white | text-white -> text-slate-900 */
    <div className="bg-white text-slate-900 min-h-screen font-['Inter']">
      
      {/* 1. HERO GIỚI THIỆU */}
      <section className="relative py-32 px-10 overflow-hidden border-b border-slate-100">
        {/* Lớp decor chìm - Đổi màu vàng nhẹ hơn cho nền trắng */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#a88c34]/5 rounded-full blur-[120px] -z-0"></div>
        
        <div className="relative z-10 max-w-[1800px] mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 space-y-10">
            {/* ĐỔI: bg-white/5 -> bg-slate-50 | border-white/10 -> border-slate-200 */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-50 border border-slate-200 backdrop-blur rounded-full text-[11px] font-[1000] uppercase tracking-[0.3em] text-[#a88c34]">
              <Sparkles size={16} />
              VUST Identity & Vision
            </div>

            <h1 className="text-[4rem] lg:text-[6.5rem] font-[1000] uppercase italic tracking-tighter leading-[0.9] text-slate-900">
              TẦM NHÌN & <br /> <span className="text-[#a88c34]">SỨ MỆNH</span>
            </h1>
            
            {/* ĐỔI: text-slate-400 -> text-slate-500 */}
            <p className="text-xl font-medium text-slate-500 italic max-w-xl leading-relaxed uppercase border-l-4 border-[#a88c34] pl-8">
              "Xây dựng hệ sinh thái giáo dục số tiên tiến, nơi kiến tạo nguồn nhân lực công nghệ dẫn dắt sự thay đổi của thế giới."
            </p>
          </div>

          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ĐỔI: bg-white/5 -> bg-slate-50 | border-white/10 -> border-slate-200 */}
            <div className="bg-slate-50 p-10 rounded-[3.5rem] border border-slate-200 hover:border-[#a88c34]/50 transition-all group shadow-sm">
              <Target size={48} className="mb-6 text-[#a88c34] group-hover:scale-110 transition-transform" />
              <h3 className="font-[1000] uppercase italic text-2xl mb-4 tracking-tighter">Sứ mạng</h3>
              <p className="text-sm leading-relaxed text-slate-500 uppercase font-bold">Tiên phong trong đào tạo, nghiên cứu đỉnh cao và chuyển giao công nghệ đột phá trong kỷ nguyên số.</p>
            </div>
            
            <div className="bg-[#a88c34] p-10 rounded-[3.5rem] text-white mt-10 hover:scale-105 transition-all shadow-2xl shadow-[#a88c34]/20">
              <ShieldCheck size={48} className="mb-6" />
              <h3 className="font-[1000] uppercase italic text-2xl mb-4 tracking-tighter">Giá trị cốt lõi</h3>
              <p className="text-sm leading-relaxed font-black uppercase italic opacity-90">Sáng tạo - Trách nhiệm - Xuất sắc - Tầm vóc toàn cầu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LỊCH SỬ HÌNH THÀNH */}
      <section className="py-32 max-w-[1800px] mx-auto px-10">
        <div className="flex flex-col lg:flex-row gap-24">
          <div className="lg:w-1/3">
            <div className="sticky top-40 space-y-6">
              <History size={64} className="text-[#a88c34]" />
              <h2 className="text-5xl font-[1000] uppercase italic tracking-tighter leading-none text-slate-900">
                HÀNH TRÌNH <br /> <span className="text-[#a88c34]">KIẾN TẠO</span>
              </h2>
              <div className="w-20 h-2 bg-[#a88c34] rounded-full"></div>
              <p className="text-slate-500 font-medium text-lg uppercase leading-relaxed">
                Hơn 25 năm dẫn đầu sự nghiệp đào tạo nhân lực công nghệ cao tại Việt Nam.
              </p>
            </div>
          </div>

          <div className="lg:w-2/3 space-y-16">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-12 group">
                <div className="flex flex-col items-center">
                  {/* ĐỔI: bg-[#0f172a] -> bg-slate-50 | border-white/10 -> border-slate-200 */}
                  <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center font-[1000] text-2xl text-[#a88c34] border border-slate-200 group-hover:bg-[#a88c34] group-hover:text-white transition-all duration-500 shadow-sm">
                    {m.year}
                  </div>
                  {i !== milestones.length - 1 && (
                    <div className="w-[2px] h-full bg-gradient-to-b from-[#a88c34] to-transparent mt-6"></div>
                  )}
                </div>
                {/* ĐỔI: border-white/5 -> border-slate-100 */}
                <div className="pt-4 pb-16 border-b border-slate-100 w-full">
                  <h4 className="text-2xl font-[1000] text-slate-900 uppercase italic mb-4 tracking-tighter group-hover:text-[#a88c34] transition-colors">Dấu mốc chiến lược</h4>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed uppercase">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NĂNG LỰC ĐÀO TẠO */}
      <section className="py-32 px-10 max-w-[1800px] mx-auto">
        {/* ĐỔI: bg-white/5 -> bg-slate-50 | border-white/10 -> border-slate-200 */}
        <div className="bg-slate-50 rounded-[5rem] p-20 border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#a88c34_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-5xl font-[1000] uppercase italic tracking-tighter text-slate-900">Năng lực đào tạo</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Tiêu chuẩn hóa quốc tế trong mọi hoạt động</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: <Building2 />, title: "Phòng thí nghiệm", val: "15+", desc: "Hệ thống Lab AI và Chip Bán dẫn hiện đại bậc nhất." },
                { icon: <Users2 />, title: "Chuyên gia đầu ngành", val: "120+", desc: "90% giảng viên đào tạo tại các trường top đầu thế giới." },
                { icon: <Globe />, title: "Đối tác chiến lược", val: "200+", desc: "Mạng lưới kết nối Google, Microsoft, NVIDIA, FPT..." }
              ].map((box, i) => (
                /* ĐỔI: bg-[#020617]/60 -> bg-white | border-white/5 -> border-slate-200 */
                <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-slate-200 hover:border-[#a88c34]/40 transition-all text-center group shadow-sm">
                  <div className="text-[#a88c34] mb-8 flex justify-center group-hover:scale-125 transition-transform">
                    {React.cloneElement(box.icon, { size: 48 })}
                  </div>
                  <h3 className="text-6xl font-[1000] mb-4 tracking-tighter group-hover:text-[#a88c34] transition-colors text-slate-900">{box.val}</h3>
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">{box.title}</h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed uppercase italic">{box.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA CUỐI TRANG */}
      <section className="py-32 text-center px-10">
        {/* ĐỔI: from-[#0f172a] to-[#020617] -> from-slate-50 to-white */}
        <div className="max-w-4xl mx-auto space-y-12 bg-gradient-to-br from-slate-50 to-white p-24 rounded-[4rem] border border-slate-200 shadow-xl">
          <h2 className="text-4xl md:text-6xl font-[1000] uppercase italic tracking-tighter leading-tight text-slate-900">
            GIA NHẬP CỘNG ĐỒNG <br /> <span className="text-[#a88c34]">VUST-ER</span> HÔM NAY?
          </h2>
          <p className="text-slate-500 text-lg font-medium uppercase italic">Hãy trở thành một phần của thế hệ dẫn dắt công nghệ tương lai.</p>
          
          <div className="flex flex-wrap justify-center gap-6">
              <button 
                onClick={() => navigate('/tuyen-sinh')}
                className="bg-[#a88c34] text-white px-12 py-5 rounded-2xl font-[1000] uppercase italic text-xs tracking-[0.2em] shadow-2xl shadow-[#a88c34]/20 active:scale-95 transition-all flex items-center gap-3"
              >
                Quy chế tuyển sinh <ArrowRight size={16} />
              </button>
              
              <button className="border-2 border-slate-200 px-12 py-5 rounded-2xl font-[1000] uppercase italic text-xs tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all text-slate-900">
                Liên hệ tư vấn
              </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;