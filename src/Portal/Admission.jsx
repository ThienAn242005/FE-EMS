import React, { useState } from 'react';
import { Send, FileText, Info, Sparkles, ArrowRight, GraduationCap } from 'lucide-react';
import { alertService } from "../utils/swalUtils";

const Admission = () => {
  const [email, setEmail] = useState("");

  const methods = [
    { title: "Xét tuyển thẳng", desc: "Dành cho học sinh giỏi quốc gia, quốc tế hoặc có thành tích đặc biệt." },
    { title: "Kỳ thi ĐGNL", desc: "Sử dụng kết quả thi Đánh giá năng lực của ĐHQG-HCM 2026." },
    { title: "Xét kết quả THPT", desc: "Dựa trên điểm thi tốt nghiệp THPT theo các tổ hợp môn xét tuyển." }
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen font-['Inter']">
      
      {/* 1. HEADER SECTION - Chuyển từ tối sang sáng đồng bộ */}
      <section className="relative py-24 px-10 overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#a88c34]/5 rounded-full blur-[120px] -z-0"></div>
        
        <div className="relative z-10 max-w-[1800px] mx-auto text-left">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-50 border border-slate-200 backdrop-blur rounded-full text-[11px] font-[1000] uppercase tracking-[0.3em] text-[#a88c34] mb-8 shadow-sm">
            <GraduationCap size={16} />
            Admission Center 2026
          </div>
          
          <h1 className="text-[4rem] md:text-[6.5rem] font-[1000] leading-[0.9] tracking-tighter uppercase mb-6">
            TUYỂN SINH <br />
            <span className="italic text-[#a88c34]">2026</span>
          </h1>
          <div className="w-32 h-3 bg-[#a88c34] rounded-full mb-8"></div>
          <p className="max-w-2xl text-slate-500 text-xl font-medium leading-relaxed uppercase">
            Cơ hội trở thành thế hệ dẫn dắt công nghệ tương lai tại hệ sinh thái giáo dục số VUST.
          </p>
        </div>
      </section>

      <div className="max-w-[1800px] mx-auto px-10 py-24 grid grid-cols-1 lg:grid-cols-3 gap-20">
        
        {/* 2. THÔNG TIN XÉT TUYỂN (Bên trái) */}
        <div className="lg:col-span-2 space-y-16">
          <div className="space-y-10">
            <h2 className="text-4xl font-[1000] uppercase italic tracking-tighter flex items-center gap-4">
              <Sparkles className="text-[#a88c34]" />
              Phương thức xét tuyển
            </h2>
            
            <div className="grid gap-6">
              {methods.map((m, i) => (
                <div key={i} className="group flex items-center gap-8 p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:border-[#a88c34]/40 hover:bg-white hover:shadow-2xl transition-all duration-500">
                  <div className="bg-white text-[#a88c34] p-5 rounded-2xl shadow-xl group-hover:bg-[#a88c34] group-hover:text-white transition-colors duration-500">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-[1000] uppercase italic tracking-tighter mb-2">{m.title}</h4>
                    <p className="text-lg text-slate-500 font-medium uppercase text-sm italic">{m.desc}</p>
                  </div>
                  <ArrowRight className="ml-auto text-slate-200 group-hover:text-[#a88c34] group-hover:translate-x-2 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* Alert Info Box */}
          <div className="bg-blue-50/50 border border-blue-100 p-10 rounded-[3.5rem] flex gap-8 items-start">
            <div className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200">
              <Info size={28} />
            </div>
            <div className="space-y-3">
              <h4 className="text-xl font-[1000] uppercase tracking-tighter text-blue-900">Lưu ý hồ sơ quan trọng</h4>
              <p className="text-blue-800/70 font-medium leading-relaxed uppercase text-xs italic">
                Thí sinh cần chuẩn bị bản sao công chứng học bạ, giấy chứng nhận tốt nghiệp tạm thời và các chứng chỉ ngoại ngữ (IELTS, TOEFL) để được ưu tiên xét tuyển vào các lớp tài năng.
              </p>
            </div>
          </div>
        </div>

        {/* 3. FORM ĐĂNG KÝ TƯ VẤN (Bên phải) */}
        <div className="relative">
          <div className="bg-white p-12 rounded-[4rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-slate-100 sticky top-24">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter mb-2">Đăng ký tư vấn</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#a88c34]">Nhận thông tin tuyển sinh mới nhất</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alertService.success("Cảm ơn! Chúng tôi sẽ liên hệ bạn sớm."); }}>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase ml-4 text-slate-400">Họ và tên học sinh</label>
                <input type="text" placeholder="NGUYÊN VĂN A" className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-[#a88c34]/20 border border-transparent focus:border-[#a88c34]/50 transition-all font-bold" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase ml-4 text-slate-400">Email liên hệ</label>
                <input type="email" placeholder="EXAMPLE@GMAIL.COM" className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-[#a88c34]/20 border border-transparent focus:border-[#a88c34]/50 transition-all font-bold" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase ml-4 text-slate-400">Nguyện vọng ngành</label>
                <select className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-slate-500 border border-transparent appearance-none">
                  <option>CHỌN NGÀNH QUAN TÂM</option>
                  <option>Kỹ thuật Phần mềm</option>
                  <option>An toàn Thông tin</option>
                  <option>Khoa học Máy tính</option>
                </select>
              </div>

              <button className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-[1000] uppercase italic text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#a88c34] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200">
                <Send size={18} /> Gửi yêu cầu ngay
              </button>
            </form>

            <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Hotline tư vấn: <span className="text-slate-900">1900 60XX</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admission;