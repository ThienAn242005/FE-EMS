import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, GraduationCap, Building2, 
  ArrowUpRight, TrendingUp, Calendar 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid 
} from 'recharts';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalExams: 0,
    totalDepartments: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        const response = await axios.get("http://localhost:8080/api/admin/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStats({
          totalStudents: response.data.totalStudents || 0,
          totalTeachers: response.data.totalTeachers || 0,
          totalExams: response.data.totalExams || 0,
          totalDepartments: response.data.totalDepartments || 0
        });

        if (response.data.chartData) {
          setChartData(response.data.chartData);
        }
      } catch (error) {
        console.error("Lỗi kết nối API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: "Tổng Sinh viên", value: stats.totalStudents, icon: <GraduationCap size={24} />, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Giảng viên", value: stats.totalTeachers, icon: <Users size={24} />, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Kỳ thi (Exams)", value: stats.totalExams, icon: <Calendar size={24} />, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Khoa đào tạo", value: stats.totalDepartments, icon: <Building2 size={24} />, color: "text-green-600", bg: "bg-green-100" },
  ];

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <span className="font-black text-slate-400 uppercase tracking-widest text-xs">Đang truy vấn Database...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Tiêu đề trang */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Hệ thống quản trị</h1>
        <p className="text-slate-500 font-medium">Dữ liệu tổng hợp thực tế từ cơ sở dữ liệu.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="mb-4 flex justify-between items-start">
              <div className={`${item.bg} ${item.color} p-4 rounded-2xl shadow-sm`}>
                {item.icon}
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-wider">{item.label}</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{item.value.toLocaleString()}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Biểu đồ phân bổ sinh viên */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">Phân bổ sinh viên theo khoa</h3>
            <div className="flex items-center gap-1 text-blue-600 text-xs font-bold">
              Live Data <TrendingUp size={14} />
            </div>
          </div>
          
         <div className="h-[350px] w-full min-h-[350px]">
            {chartData.length > 0 ? (
              /* debounce={50} giúp sửa lỗi width/height (-1) ở frontend */
              <ResponsiveContainer width="100%" height="100%" debounce={50}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                    dy={10} 
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Bar dataKey="count" fill="#2563eb" radius={[10, 10, 0, 0]} barSize={45} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-300 font-bold border-2 border-dashed border-slate-100 rounded-[32px]">
                Không có dữ liệu biểu đồ để hiển thị
              </div>
            )}
          </div>
        </div>

        {/* Cột thông báo */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest mb-6">Thông báo mới</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 px-4">
            <div className="bg-slate-50 p-6 rounded-full">
              <TrendingUp className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-400 text-xs italic">
              Dữ liệu thông báo đang được đồng bộ từ module News...
            </p>
          </div>
          <button className="mt-6 w-full py-4 bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
            Xem tất cả
          </button>
        </div>
      </div>
    </div>
  );
}