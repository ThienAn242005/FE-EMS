import React from 'react';
import { 
  Award, 
  BookOpen, 
  Globe, 
  CheckCircle, 
  ArrowRight, 
  School 
} from 'lucide-react';

const VustIntroduction = () => {
  // Dữ liệu nội dung từ hình ảnh của bạn
  const stats = [
    { label: "Chương trình đào tạo bậc Đại học", value: "23" },
    { label: "Chương trình liên kết đào tạo Quốc tế", value: "23" },
    { label: "Đạt chuẩn quốc tế AUN-QA", value: "11" },
    { label: "Kiểm định ASIIN (Đức)", value: "10" }
  ];

  const accreditations = [
    { name: "AUN – QA", desc: "11 chương trình đạt chuẩn Đông Nam Á" },
    { name: "ABET", desc: "02 chương trình đạt chuẩn Hoa Kỳ" },
    { name: "ASIIN", desc: "10 chương trình đạt chuẩn Châu Âu" },
    { name: "ACBSP", desc: "01 chương trình đạt chuẩn Hoa Kỳ" },
    { name: "FIBAA", desc: "02 chương trình đạt chuẩn Châu Âu" },
    { name: "MOET", desc: "01 chương trình đạt chuẩn Bộ GD&ĐT" }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* SECTION 1: HERO - TRỰC QUAN THEO ẢNH CỦA BẠN */}
      <section className="relative w-full py-16 px-6 lg:px-20 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Cột chữ bên trái */}
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h4 className="text-blue-700 font-black uppercase tracking-[0.3em] text-sm">Trường Đại học Quốc tế</h4>
              <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter italic leading-none">
                Tuyển sinh <br /> 
                <span className="text-blue-700">Đại học</span>
              </h1>
            </div>
            
            <p className="text-slate-500 font-medium leading-relaxed max-w-xl text-lg">
              Nhà trường hiện có 23 chương trình đào tạo bậc Đại học, trong đó có 11 chương trình 
              đã được công nhận đạt chuẩn <span className="font-bold text-slate-800">AUN – QA</span>; 
              bên cạnh đó còn có 23 chương trình liên kết đào tạo với các trường đại học danh tiếng trên thế giới.
            </p>

            <div className="flex gap-4 pt-4">
              <button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-blue-200">
                Tìm hiểu thêm <ArrowRight size={16} />
              </button>
              <button className="border-2 border-slate-200 hover:border-blue-700 px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all">
                Đăng ký ngay
              </button>
            </div>
          </div>

          {/* Cột ảnh bên phải - Theo phối cảnh ảnh bạn gửi */}
          <div className="flex-1 relative group">
            <div className="absolute -inset-4 bg-blue-100 rounded-[3rem] rotate-3 group-hover:rotate-0 transition-transform duration-500 opacity-50"></div>
            <img 
              src="/images/dhqg.jpg" // Thay link ảnh tòa nhà trường bạn tại đây
              alt="VUST Campus" 
              className="relative rounded-[2.5rem] shadow-2xl z-10 w-full object-cover transform transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: CON SỐ ẤN TƯỢNG (Style Card như Lịch dạy) */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tight">VUST qua những con số</h2>
            <div className="w-20 h-1.5 bg-blue-700 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center space-y-4 group hover:border-blue-500 transition-all">
                <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-all">
                  <School size={32} />
                </div>
                <h3 className="text-4xl font-black tracking-tighter text-slate-900">{stat.value}</h3>
                <p className="text-xs font-black uppercase text-slate-400 tracking-widest leading-relaxed">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: KIỂM ĐỊNH QUỐC TẾ (Sử dụng Grid Card phối màu) */}
      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3 sticky top-24 space-y-6">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-tight">
              Đẳng cấp <br />
              <span className="text-blue-700 text-5xl">Quốc tế</span>
            </h2>
            <p className="text-slate-500 font-medium italic">
              VUST tự hào là trường Đại học Việt Nam đạt nhiều kiểm định uy tín từ các tổ chức danh tiếng thế giới như ABET, ASIIN, FIBAA...
            </p>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {accreditations.map((item, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4 transition-all hover:shadow-xl ${
                  index % 2 === 0 ? 'bg-[#d0dae3] text-[#003366]' : 'bg-[#70c137] text-white'
                }`}
              >
                <div className={`p-3 rounded-xl ${index % 2 === 0 ? 'bg-white/50' : 'bg-black/10'}`}>
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="font-black text-xl mb-1">{item.name}</h4>
                  <p className="text-xs font-bold uppercase opacity-80 tracking-tight">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FOOTER BANNER */}
      <footer className="px-6 pb-20">
        <div className="w-full bg-slate-900 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center lg:text-left">
          <Globe className="absolute -right-20 -bottom-20 text-white opacity-5 w-96 h-96" />
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white uppercase italic leading-none">Khởi đầu tương lai <br /> tại VUST ngay hôm nay!</h2>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">Cổng tuyển sinh trực tuyến đang mở</p>
            </div>
            <button className="bg-[#70c137] hover:bg-[#5da32b] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest transition-all">
              Bắt đầu ứng tuyển
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VustIntroduction;