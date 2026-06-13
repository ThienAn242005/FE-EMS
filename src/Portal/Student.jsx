import React from 'react';
import { Users, Star, Calendar, Zap } from 'lucide-react';

const StudentPortal = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-tight">
            Hoạt động <br /><span className="text-[#a88c34]">Sinh viên & Đoàn hội</span>
          </h2>
          <div className="grid gap-6">
            {[
              { icon: <Zap />, label: "Câu lạc bộ học thuật", desc: "Nơi tụ hội các chuyên gia lập trình trẻ" },
              { icon: <Star />, label: "Chiến dịch Mùa hè xanh", desc: "Hoạt động tình nguyện hè sôi nổi" },
              { icon: <Calendar />, label: "Ngày hội việc làm (Job Fair)", desc: "Cơ hội kết nối doanh nghiệp hàng năm" }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start p-6 bg-slate-50 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                <div className="p-4 bg-white text-[#a88c34] rounded-2xl shadow-sm">{item.icon}</div>
                <div>
                  <h4 className="font-black text-lg uppercase italic">{item.label}</h4>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-[#a88c34]/10 rounded-[4rem] -rotate-3 scale-105"></div>
          <img src="https://picsum.photos/800/600?student" alt="Students" className="relative rounded-[3.5rem] shadow-2xl z-10" />
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;