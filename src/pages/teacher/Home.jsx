import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { 
  Users, BookOpen, Calendar, GraduationCap, 
  ArrowUpRight, MoreVertical, Clock, AlertCircle 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AuthContext } from "../../Context/AuthContext"; // Import AuthContext

const TeacherHome = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Lấy teacherCode từ AuthContext
  const { user, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Chỉ chạy khi Auth đã load xong và có mã giảng viên
      if (!authLoading && user?.teacherCode) {
        try {
          setLoading(true);
          // Gọi API tổng hợp dữ liệu cho Dashboard bằng teacherCode
          // Endpoint: /api/teachers/{teacherCode}/dashboard-stats
          const response = await axios.get(`http://localhost:8080/api/teachers/${user.teacherCode}/dashboard-stats`, {
            headers: { Authorization: `Bearer ${user.token}` } // Đính kèm token để an toàn
          });
          setData(response.data);
        } catch (err) {
          console.error("Error fetching teacher dashboard:", err);
          setError("Không thể tải dữ liệu dashboard. Vui lòng kiểm tra API hoặc quyền truy cập.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [user, authLoading]);

  // Hiển thị trạng thái Loading
  if (authLoading || loading) return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mb-4"></div>
      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Đang đồng bộ dữ liệu giảng dạy...</p>
    </div>
  );

  // Hiển thị trạng thái lỗi
  if (error) return (
    <div className="p-8 bg-red-50 border border-red-100 rounded-[2rem] text-center animate-in zoom-in duration-300">
      <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
      <p className="text-red-700 font-bold">{error}</p>
      <p className="text-red-400 text-xs mt-2 uppercase font-black">Mã lỗi: TEACHER_CODE_{user?.teacherCode || 'UNDEFINED'}</p>
    </div>
  );

  // Mảng màu cho biểu đồ (Giữ nguyên)
  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#f43f5e'];

  const stats = [
    { label: 'Tổng số lớp dạy', value: data?.totalClasses || 0, icon: <BookOpen className="text-blue-600" />, change: 'Học kỳ hiện tại' },
    { label: 'Tổng sinh viên', value: data?.totalStudents || 0, icon: <Users className="text-purple-600" />, change: `Trung bình: ${data?.totalClasses > 0 ? Math.round(data.totalStudents / data.totalClasses) : 0} SV/lớp` },
    { label: 'Giờ giảng dạy', value: '120h', icon: <Clock className="text-amber-600" />, change: 'Dự kiến học kỳ' },
    { label: 'Tỉ lệ đạt môn', value: '88%', icon: <GraduationCap className="text-emerald-600" />, change: 'Kỳ trước: 85.5%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. WELCOME SECTION - Hiển thị mã thực tế từ Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic">VUST Teacher Dashboard</h1>
          <p className="text-slate-500 font-medium">Chào mừng giảng viên: <span className="text-blue-600 font-black">{user?.fullName}</span> (Mã: {user?.teacherCode})</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <Calendar size={20} className="text-blue-600 ml-2" />
          <span className="text-sm font-bold text-slate-700 pr-4">Học kỳ 2 - 2026</span>
        </div>
      </div>

      {/* 2. STATS CARDS - Giữ nguyên */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={18} /></button>
            </div>
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</h3>
            <p className="text-3xl font-black text-slate-800 my-1">{stat.value}</p>
            <p className="text-[10px] text-slate-400 font-bold">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. CHART - Dữ liệu thực từ API */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="font-black text-slate-800 uppercase tracking-tight mb-8">Thống kê sĩ số lớp học phần</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="courseCode" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="enrolled" radius={[10, 10, 10, 10]} barSize={40}>
                  {(data?.chartData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. UPCOMING CLASSES - Dữ liệu từ API */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="font-black text-slate-800 uppercase tracking-tight mb-6 text-sm">Lớp dạy đang quản lý</h3>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {data?.upcomingClasses && data.upcomingClasses.length > 0 ? (
              data.upcomingClasses.map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                  <div className="flex flex-col items-center justify-center min-w-[50px] h-12 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] uppercase">
                    <span>Lớp</span>
                    <span>{i + 1}</span>
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate uppercase tracking-tighter">{item.sectionCode}</h4>
                    <p className="text-[9px] text-slate-400 font-black uppercase truncate mt-0.5">{item.subject?.subjectName}</p>
                    <div className="flex items-center gap-3 text-[9px] text-slate-400 font-bold mt-1 uppercase">
                      <span className="flex items-center gap-1"><Users size={10} /> {item.currentEnrolled}/{item.maxCapacity}</span>
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="ml-auto text-slate-300 group-hover:text-blue-600" />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-30">
                 <AlertCircle size={40} className="mb-2" />
                 <p className="text-slate-400 text-xs font-bold uppercase">Chưa có lớp học phần</p>
              </div>
            )}
          </div>
          <button className="w-full mt-6 py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-[10px] font-black uppercase hover:border-blue-400 hover:text-blue-500 transition-all">
            Quản lý tất cả lớp
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;