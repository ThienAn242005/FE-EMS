import React from 'react';
import { ArrowRight, Book, Users, Award, Newspaper } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative h-[600px] bg-[#a88c34] flex items-center overflow-hidden">
        {/* Background Pattern (Trang trí) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 border-8 border-white rounded-full"></div>
          <div className="absolute -bottom-20 right-20 w-96 h-96 border-[20px] border-white rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center justify-between">
          <div className="text-white space-y-6 z-10 lg:w-1/2">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-none">
              Khoa Công nghệ <br /> Thông tin
            </h2>
            <p className="text-xl font-medium opacity-90 max-w-lg italic">
              Trường Đại học Khoa học Tự nhiên (ĐHQG-HCM) - Nơi khơi nguồn đam mê công nghệ và sáng tạo.
            </p>
            <button className="bg-white text-[#a88c34] px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-slate-900 hover:text-white transition-all flex items-center gap-3 group">
              Khám phá ngay <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="hidden lg:block lg:w-1/2 relative">
             <img 
               src="https://media.fit.hcmus.edu.vn/api/v1/files/get/914c8106-f646-4447-9750-10e6e761661a" 
               alt="FIT Students" 
               className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 h-[450px] w-full object-cover"
             />
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="py-16 max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: <Book />, label: "Chương trình", val: "23+" },
          { icon: <Users />, label: "Sinh viên", val: "5000+" },
          { icon: <Award />, label: "Kiểm định", val: "AUN-QA" },
          { icon: <Award />, label: "Bằng cấp", val: "ASIIN" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-[2.5rem] hover:shadow-xl transition-all border border-slate-100">
            <div className="text-[#a88c34] mb-4 scale-150">{item.icon}</div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{item.val}</h3>
            <p className="text-xs font-bold uppercase text-slate-400 tracking-widest mt-2">{item.label}</p>
          </div>
        ))}
      </section>

      {/* TIN TỨC MỚI (News Section) */}
      <section className="py-20 bg-white max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
             <h4 className="text-[#a88c34] font-black uppercase tracking-widest text-sm italic">FIT HCMUS</h4>
             <h2 className="text-4xl font-black uppercase italic tracking-tighter">Tin tức & Sự kiện</h2>
          </div>
          <button className="flex items-center gap-2 font-black uppercase text-xs border-b-2 border-[#a88c34] pb-1 hover:text-[#a88c34]">Xem tất cả <Newspaper size={16} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[1, 2, 3].map(item => (
            <div key={item} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-3xl mb-6 h-60">
                <img src={`https://picsum.photos/600/400?random=${item}`} alt="news" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-[#a88c34] text-white px-4 py-1 rounded-lg text-xs font-bold">12/10/2023</div>
              </div>
              <h3 className="text-xl font-black leading-tight uppercase group-hover:text-[#a88c34] transition-colors">Thông báo Tuyển sinh Sau đại học năm 2023 đợt 2</h3>
              <p className="text-slate-500 text-sm mt-3 line-clamp-2">Nội dung chi tiết về chương trình đào tạo thạc sĩ và tiến sĩ năm 2023 tại Khoa CNTT...</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;