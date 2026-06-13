import React from 'react';
import { 
  FileCheck, Shield, BarChart2, School, 
  Users2, HardDrive, ScrollText, Download,
  ExternalLink, Search, CheckCircle2
} from 'lucide-react';

const CongKhaiGiaoDuc = () => {
  const disclosureCategories = [
    {
      title: "Cam kết chất lượng",
      icon: <FileCheck size={28} />,
      docs: [
        "Cam kết chất lượng đào tạo khóa 2021-2025",
        "Chuẩn đầu ra các ngành đào tạo chuẩn quốc tế",
        "Báo cáo tự đánh giá cơ sở giáo dục"
      ]
    },
    {
      title: "Điều kiện đảm bảo chất lượng",
      icon: <School size={28} />,
      docs: [
        "Công khai đội ngũ giảng viên cơ hữu",
        "Diện tích sàn xây dựng & Ký túc xá",
        "Hệ thống phòng thí nghiệm trọng điểm"
      ]
    },
    {
      title: "Tài chính & Học phí",
      icon: <BarChart2 size={28} />,
      docs: [
        "Mức học phí và các khoản thu năm học 2025-2026",
        "Chế độ học bổng & Miễn giảm học phí",
        "Báo cáo quyết toán ngân sách hàng năm"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-['Inter']">
      
      {/* 1. HEADER SECTION - WHITE CLEAN STYLE */}
      <section className="relative py-24 px-10 border-b border-slate-100 overflow-hidden">
        {/* Decor: Ánh vàng Gold nhẹ nhàng trên nền trắng */}
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[#a88c34]/5 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 max-w-[1800px] mx-auto">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-50 border border-slate-200 backdrop-blur rounded-full text-[11px] font-[1000] uppercase tracking-[0.3em] text-[#a88c34] mb-8 shadow-sm">
            <Shield size={16} />
            Transparency & Accountability
          </div>
          
          <h1 className="text-[4rem] md:text-[6.5rem] font-[1000] leading-none tracking-tighter uppercase mb-6 text-slate-900">
            CÔNG KHAI <br />
            <span className="italic text-[#a88c34]">GIÁO DỤC</span>
          </h1>
          <p className="max-w-3xl text-slate-500 text-xl font-medium leading-relaxed uppercase border-l-4 border-[#a88c34] pl-8 italic">
            VUST thực hiện công khai các điều kiện đảm bảo chất lượng giáo dục theo quy định của Bộ Giáo dục và Đào tạo, khẳng định uy tín và trách nhiệm đối với xã hội.
          </p>
        </div>
      </section>

      {/* 2. QUICK STATS - CHỈ SỐ MINH BẠCH */}
      <section className="py-20 px-10 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Giảng viên trình độ Tiến sĩ", value: "85%", icon: <Users2 /> },
            { label: "Tỷ lệ sinh viên có việc làm", value: "98.5%", icon: <CheckCircle2 /> },
            { label: "Diện tích thực hành/SV", value: "12m²", icon: <HardDrive /> },
            { label: "Thư viện số (Tài liệu)", value: "2M+", icon: <ScrollText /> }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex flex-col justify-between hover:bg-white hover:shadow-xl hover:border-[#a88c34]/30 transition-all duration-500 group">
              <div className="text-slate-400 group-hover:text-[#a88c34] transition-colors mb-4">
                {item.icon}
              </div>
              <div>
                <div className="text-4xl font-[1000] text-slate-900">{item.value}</div>
                <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mt-1 italic">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. DOCUMENT CATEGORIES - DANH MỤC TÀI LIỆU */}
      <section className="py-20 px-10 bg-slate-50/50">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {disclosureCategories.map((cat, i) => (
              <div key={i} className="bg-white rounded-[4rem] p-10 border border-slate-100 flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(168,140,52,0.1)] transition-all duration-500">
                <div className="w-16 h-16 bg-[#a88c34] rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-[#a88c34]/30">
                  {cat.icon}
                </div>
                
                <h3 className="text-2xl font-[1000] uppercase italic tracking-tighter mb-8 border-b border-slate-100 pb-4 text-slate-900">
                  {cat.title}
                </h3>

                <div className="space-y-4 flex-grow">
                  {cat.docs.map((doc, idx) => (
                    <div key={idx} className="group flex items-start justify-between gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100">
                      <p className="text-slate-500 font-bold text-sm uppercase leading-snug group-hover:text-slate-900 transition-colors italic">
                        {doc}
                      </p>
                      <Download size={18} className="text-[#a88c34] shrink-0 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    </div>
                  ))}
                </div>

                <button className="mt-10 w-full py-5 border border-slate-200 rounded-2xl text-slate-400 font-black uppercase italic tracking-widest text-xs hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center gap-3">
                  Xem chi tiết phân mục <ExternalLink size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SEARCH & ARCHIVE - KHU VỰC TRA CỨU */}
      <section className="py-32 px-10 max-w-[1800px] mx-auto text-center">
        <div className="bg-slate-900 rounded-[5rem] p-20 relative overflow-hidden shadow-2xl">
          {/* Pattern decor chìm trên nền tối duy nhất của trang */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#a88c34_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          
          <h2 className="relative z-10 text-4xl font-[1000] uppercase italic tracking-tighter mb-8 text-white">
            TRA CỨU VĂN BẢN QUY ĐỊNH
          </h2>
          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="text" 
                placeholder="Nhập tên tài liệu, mã số văn bản..." 
                className="w-full bg-white/10 border border-white/10 rounded-2xl py-6 pl-16 pr-6 focus:outline-none focus:bg-white focus:text-slate-900 transition-all font-bold uppercase text-xs text-white"
              />
            </div>
            <button className="w-full md:w-auto bg-[#a88c34] text-white px-12 py-6 rounded-2xl font-[1000] uppercase italic tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-[#a88c34]/20">
              Tìm kiếm
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CongKhaiGiaoDuc;