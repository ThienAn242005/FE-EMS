import React, { useState, useEffect, useContext } from 'react';
import { Mail, Phone, MapPin, Camera, Loader2, Bookmark, Calendar, Award, GraduationCap } from 'lucide-react';
import api from '../../Service/api';
import { AuthContext } from "../../Context/AuthContext"; // Import AuthContext

export default function TeacherProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Lấy thông tin user từ AuthContext
  const { user, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      // Chỉ gọi API khi AuthContext đã load xong và có thông tin user
      if (!authLoading && user?.teacherCode) {
        try {
          setLoading(true);
          // API gọi lấy dữ liệu giảng viên dựa trên teacherCode từ Context
          const res = await api.get(`/teachers/${user.teacherCode}`);
          setProfile(res.data);
        } catch (err) {
          console.error("Lỗi fetch profile:", err);
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !user) {
          setLoading(false);
      }
    };
    fetchProfile();
  }, [user, authLoading]);

  // Hiển thị loading nếu AuthContext đang load hoặc API đang gọi
  if (authLoading || loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-indigo-500" size={32} />
    </div>
  );

  // Nếu không có profile sau khi load xong
  if (!profile) return (
    <div className="flex h-screen items-center justify-center bg-white text-slate-500 font-bold uppercase tracking-widest">
      Không tìm thấy thông tin hồ sơ
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white min-h-screen animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-slate-100 pb-12">
        <div className="relative">
          <img 
            // Lấy ảnh từ user liên kết với teacher, nếu không có dùng UI-Avatars làm fallback
            src={profile?.user?.avatar || `https://ui-avatars.com/api/?name=${profile?.fullName}&background=f1f5f9&color=6366f1&size=150`} 
            className="w-32 h-32 rounded-2xl object-cover ring-4 ring-slate-50 shadow-sm" 
            alt="avatar" 
          />
          <button className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all">
            <Camera size={16} />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="space-y-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{profile?.fullName}</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-bold uppercase tracking-wider w-fit mx-auto md:mx-0">
                <Award size={12} />
                <span>{profile?.department?.name || "Giảng viên cơ hữu"}</span>
              </div>
            </div>
            {/* Hiển thị Khoa ngay dưới tên để nhấn mạnh */}
            <p className="text-indigo-500 font-semibold text-sm flex items-center justify-center md:justify-start gap-1.5">
              <span className="flex items-center gap-1.5">
                <GraduationCap size={16} />
                {profile?.department?.name ? `Khoa ${profile.department.name}` : "Đang cập nhật khoa"}
              </span>
            </p>
          </div>

          <p className="text-slate-500 font-medium">Mã nhân sự: <span className="text-slate-900 font-bold">{profile?.teacherCode}</span></p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
              <Mail size={14} /> <span>{profile?.email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
              <MapPin size={14} /> <span>{profile?.address || "TP. Hồ Chí Minh"}</span>
            </div>
          </div>
        </div>

        <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-all shadow-sm">
          Chỉnh sửa hồ sơ
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
        
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Thông tin chi tiết</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <DetailBox label="Đơn vị công tác" value={profile?.department?.name ? `Khoa ${profile.department.name}` : "N/A"} isHighlight />
              <DetailBox label="Số điện thoại" value={profile?.phone || "Chưa cập nhật"} />
              <DetailBox label="Ngày sinh" value={profile?.birthday || "Chưa có dữ liệu"} />
              <DetailBox label="Chuyên ngành" value={profile?.department?.description || "Công nghệ phần mềm"} />
              <DetailBox label="Tuổi" value={profile?.age ? `${profile.age} tuổi` : '-- tuổi'} />
              <DetailBox label="Trạng thái" value="Đang trực tiếp giảng dạy" />
            </div>
          </section>

          <section className="p-6 bg-slate-50 rounded-2xl border border-slate-100/50">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Bookmark size={16} className="text-indigo-500" /> Ghi chú công việc
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Phụ trách giảng dạy và nghiên cứu tại <strong>Khoa {profile?.department?.name}</strong>. Tham gia quản lý các học phần chuyên ngành và hướng dẫn đồ án sinh viên.
            </p>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
            <Calendar className="mb-4 opacity-80" size={24} />
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Học kỳ hiện tại</p>
            <p className="text-lg font-bold">Học kỳ 2 (2025 - 2026)</p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
             <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tight">Tài khoản & Bảo mật</h4>
             <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Mật khẩu</span>
                  <span className="text-indigo-600 font-bold cursor-pointer hover:underline">Thay đổi</span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-slate-50 pt-3">
                  <span className="text-slate-500">Tên đăng nhập</span>
                  <span className="text-slate-900 font-mono font-bold">{profile?.user?.username}</span>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function DetailBox({ label, value, isHighlight = false }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className={`font-semibold ${isHighlight ? 'text-indigo-600' : 'text-slate-800'}`}>
        {value}
      </p>
    </div>
  );
}