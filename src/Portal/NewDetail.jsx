import React from 'react';
import { Calendar, User, Share2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewsDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20 max-w-4xl mx-auto px-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#a88c34] font-black uppercase text-xs mb-8 hover:translate-x-[-8px] transition-transform">
        <ArrowLeft size={16} /> Quay lại tin tức
      </button>

      <div className="space-y-6 mb-10">
        <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-1"><Calendar size={14}/> 12/10/2023</span>
          <span className="flex items-center gap-1"><User size={14}/> Ban Truyền thông FIT</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-tight">
          Thông báo Tuyển sinh Sau đại học năm 2026 đợt 2 tại Khoa CNTT
        </h1>
      </div>

      <img src="https://picsum.photos/1200/600" alt="News" className="w-full rounded-[3rem] mb-12 shadow-xl" />

      <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed space-y-6">
        <p className="text-xl text-slate-900 font-bold italic">Khoa Công nghệ Thông tin - Trường ĐH Khoa học Tự nhiên thông báo kế hoạch tuyển sinh trình độ Thạc sĩ và Tiến sĩ đợt 2 năm 2026.</p>
        <p>Hồ sơ bao gồm các văn bằng tốt nghiệp Đại học đúng ngành hoặc ngành gần, chứng chỉ ngoại ngữ đạt chuẩn theo quy định của ĐHQG-HCM. Thí sinh đăng ký trực tuyến tại cổng thông tin của Nhà trường trước ngày 30/11/2026.</p>
        <h3 className="text-2xl font-black uppercase italic text-slate-900 mt-8">Các chuyên ngành đào tạo:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Khoa học máy tính</li>
          <li>Hệ thống thông tin</li>
          <li>Kỹ thuật phần mềm</li>
          <li>Quản lý Công nghệ Thông tin</li>
        </ul>
      </div>

      <div className="mt-16 pt-8 border-t flex justify-between items-center">
        <div className="flex gap-2">
          <span className="bg-slate-100 px-4 py-2 rounded-full text-[10px] font-black uppercase text-slate-500">Tuyển sinh</span>
          <span className="bg-slate-100 px-4 py-2 rounded-full text-[10px] font-black uppercase text-slate-500">Sau đại học</span>
        </div>
        <button className="p-4 bg-slate-50 rounded-full hover:bg-[#a88c34] hover:text-white transition-all"><Share2 size={20}/></button>
      </div>
    </div>
  );
};

export default NewsDetail;