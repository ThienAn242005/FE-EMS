import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, User, BookOpen, Calendar, 
  Wallet, FileText, Newspaper, Trophy, 
  BarChart3, GraduationCap 
} from 'lucide-react';

export default function StudentLayout() {
  const location = useLocation();

  const menuItems = [
    { to: '/student', label: 'Trang chủ', icon: <Home size={18} /> },
    { to: '/student/news/list', label: 'Tin tức', icon: <Newspaper size={18} /> },
    { to: '/student/register', label: 'Đăng ký môn', icon: <BookOpen size={18} /> },
    { to: '/student/schedule', label: 'Lịch học', icon: <Calendar size={18} /> },
    { to: '/student/performance', label: 'Xem điểm', icon: <BarChart3 size={18} /> },
    { to: '/student/curriculum', label: 'Khung chương trình', icon: <FileText size={18} /> },
    { to: '/student/tuition', label: 'Học phí', icon: <Wallet size={18} /> },
    { to: '/student/activities', label: 'Hoạt động', icon: <Trophy size={18} /> },
    { to: '/student/training-points', label: 'Điểm rèn luyện', icon: <GraduationCap size={18} /> },
    { to: '/student/profile', label: 'Hồ sơ', icon: <User size={18} /> },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50/50"> 
      {/* 1. Header cố định - Giữ Full để dải màu xanh tràn canh lề */}
      <Header />

      {/* 2. Sub-navigation (Top Menu) */}
      <div className="w-full bg-white border-b border-slate-200 sticky top-[64px] z-40 shadow-sm">
        {/* Giới hạn độ rộng menu ở mức 1440px (2xl) và căn giữa */}
        <div className="max-w-[1440px] mx-auto px-6"> 
          <nav className="flex items-center gap-1 py-2 overflow-x-auto no-scrollbar">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 3. Nội dung CHÍNH - Giới hạn max-width để không bị loãng dữ liệu */}
      <main className="flex-1 w-full py-6 animate-in fade-in duration-500">
        <div className="max-w-[1440px] mx-auto px-6 min-h-[calc(100vh-300px)]">
            {/* Thêm một lớp bọc trắng (Card) nếu chồng muốn phần nội dung nổi hẳn lên, 
               nếu không chỉ cần để Outlet như dưới là đẹp.
            */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <Outlet />
            </div>
        </div>
      </main>

      {/* 4. Footer */}
      <div className="mt-auto border-t border-slate-200 bg-white w-full">
        <div className="w-full mx-auto">
            <Footer />
        </div>
      </div>
    </div>
  );
}