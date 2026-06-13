import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { 
  Home, LayoutDashboard, Presentation, PenTool, 
  Map, FileText, UserCircle, Calendar // Thêm icon Lịch
} from 'lucide-react';

export default function TeacherLayout() {
  const items = [
    { to: '/teacher', label: 'Trang chủ', icon: <Home size={18} /> },
    { to: '/teacher/schedule', label: 'Lịch dạy', icon: <Calendar size={18} /> }, // Cập nhật link lịch dạy
    { to: '/teacher/manage-class', label: 'Lớp học phần', icon: <Presentation size={18} /> },
    { to: '/teacher/advisor', label: 'Quản lý lớp cố vấn', icon: <UserCircle size={18} /> },
    { to: '/teacher/grading', label: 'Nhập điểm', icon: <PenTool size={18} /> },
    { to: '/teacher/assignments', label: 'Quản lý bài tập', icon: <FileText size={18} /> },
    { to: '/teacher/profile', label: 'Hồ sơ cá nhân', icon: <UserCircle size={18} /> }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 shadow-sm border-b border-slate-200 bg-white">
        <Header />
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 hidden md:block border-r border-slate-200 bg-white sticky top-16 h-[calc(100vh-64px)]">
          <Sidebar items={items} />
        </aside>

        {/* NỘI DUNG CHÍNH: Loại bỏ max-w-7xl và p-8 để tràn màn hình */}
        <main className="flex-1 overflow-x-hidden">
          <div className="w-full h-full">
            {/* Loại bỏ rounded-3xl và p-6 nếu muốn lịch bám sát lề y hệt ảnh mẫu */}
            <div className="min-h-[calc(100vh-64px)]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}