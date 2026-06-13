import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Home,
  Wallet,
  FileText,
  Users,
  BarChart3,
  ClipboardList,
  CreditCard,
  Receipt,
  Settings,
} from 'lucide-react';

export default function AccountantLayout() {
  const location = useLocation();

  const menuItems = [
    { to: '/accountant', label: 'Trang chủ', icon: <Home size={18} /> },
    { to: '/accountant/invoices', label: 'Hóa đơn', icon: <Receipt size={18} /> },
    { to: '/accountant/payments', label: 'Thanh toán', icon: <CreditCard size={18} /> },
    { to: '/accountant/tuition', label: 'Quản lý học phí', icon: <Wallet size={18} /> },
    { to: '/accountant/students', label: 'Sinh viên', icon: <Users size={18} /> },
    { to: '/accountant/reports', label: 'Báo cáo', icon: <FileText size={18} /> },
    { to: '/accountant/statistics', label: 'Thống kê', icon: <BarChart3 size={18} /> },
    { to: '/accountant/requests', label: 'Yêu cầu duyệt', icon: <ClipboardList size={18} /> },
    { to: '/accountant/settings', label: 'Cài đặt', icon: <Settings size={18} /> },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50/50">
      {/* 1. Header */}
      <Header />

      {/* 2. Sub-navigation */}
      <div className="w-full bg-white border-b border-slate-200 sticky top-[64px] z-40 shadow-sm">
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
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
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

      {/* 3. Main content */}
      <main className="flex-1 w-full py-6 animate-in fade-in duration-500">
        <div className="max-w-[1440px] mx-auto px-6 min-h-[calc(100vh-300px)]">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <Outlet />
          </div>
        </div>
      </main>

      {/* 4. Footer */}
      <div className="mt-auto border-t border-slate-200 bg-white w-full">
        <Footer />
      </div>
    </div>
  );
}
