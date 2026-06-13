import React, { useState } from 'react'
import Header from '../components/Header'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, Users, GraduationCap, BookOpen, 
  CalendarDays, ClipboardCheck, Wallet, Map, 
  Bell, Presentation, Building2, Image as ImageIcon,
  ChevronRight, Newspaper, FileSpreadsheet, CreditCard,
  History, Settings,
  TrendingUp
} from 'lucide-react'

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuGroups = [
    {
      group: "Tổng quan & Truyền thông",
      items: [
        { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { to: '/admin/banners', label: 'Quản lý Banner', icon: <ImageIcon size={20} /> },
        { to: '/admin/news', label: 'Tin tức', icon: <Newspaper size={20} /> },
        { to: '/admin/notifications', label: 'Thông báo hệ thống', icon: <Bell size={20} /> },
      ]
    },
    {
      group: "Quản lý Đào tạo",
      items: [
        { to: '/admin/departments', label: 'Khoa đào tạo', icon: <Building2 size={20} /> },
        { to: '/admin/courses', label: 'Môn học', icon: <BookOpen size={20} /> },
        { to: '/admin/classes', label: 'Lớp học', icon: <Presentation size={20} /> },
        { to: '/admin/semesters', label: 'Học kỳ', icon: <CalendarDays size={20} /> },
        { to: '/admin/curriculums', label: 'Khung chương trình', icon: <Map size={20} /> },
      ]
    },
    {
      group: "Nhân sự & Sinh viên",
      items: [
        { to: '/admin/students', label: 'Sinh viên', icon: <GraduationCap size={20} /> },
        { to: '/admin/teachers', label: 'Giảng viên', icon: <Users size={20} /> },
        { to: '/admin/users', label: 'Tài khoản hệ thống', icon: <Settings size={20} /> },
      ]
    },
    {
      group: "Nghiệp vụ Học tập",
      items: [
        { to: '/admin/enrollments', label: 'Đăng ký học', icon: <ClipboardCheck size={20} /> },
        { to: '/admin/schedules', label: 'Thời khóa biểu', icon: <History size={20} /> },
        { to: '/admin/exams', label: 'Kỳ thi', icon: <FileSpreadsheet size={20} /> },
        { to: '/admin/grades', label: 'Quản lý Điểm', icon: <TrendingUp size={14} className="invisible" /> /* Thay bằng icon phù hợp */ },
      ]
    },
    {
      group: "Tài chính",
      items: [
        { to: '/admin/payments', label: 'Học phí & Thanh toán', icon: <CreditCard size={20} /> },
      ]
    }
  ];

  return (
    <div className="h-screen bg-[#f8fafc] flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className={`bg-white border-r border-slate-200 transition-all duration-300 shadow-sm flex flex-col ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {menuGroups.map((group, idx) => (
              <div key={idx} className="mb-6">
                {isSidebarOpen && (
                  <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                    {group.group}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.to || (item.to !== '/admin' && location.pathname.startsWith(item.to));
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${
                          isActive 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                          : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`}>
                          {item.icon}
                        </span>
                        {isSidebarOpen && (
                          <span className="font-bold text-sm flex-1">{item.label}</span>
                        )}
                        {isSidebarOpen && isActive && <ChevronRight size={14} />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-slate-50/50 custom-scrollbar min-w-0">
          <div className="p-8 max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}