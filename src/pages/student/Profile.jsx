import { useEffect, useState, useContext } from "react"; // Thêm useContext
import axios from "axios";
import StudentCard from "./StudentCard";
import { User, Mail, Phone, Calendar, School, MapPin } from "lucide-react";
import { AuthContext } from "../../Context/AuthContext"; // Import AuthContext

export default function StudentProfile() {
  const { user, loading: authLoading } = useContext(AuthContext); // Lấy loading từ Context
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchStudent = async () => {
    if (authLoading) return;
    if (!user) return;

    try {
      // Lấy token từ object user (hoặc localStorage.getItem("token"))
      const token = user.token; 

      const res = await axios.get("http://localhost:8080/api/students/me", {
        headers: {
          // 'Bearer ' là quy chuẩn chung của JWT
          Authorization: `Bearer ${token}` 
        }
      });
      
      setStudent(res.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  fetchStudent();
}, [user, authLoading]);
  if (authLoading || loading) return <div className="p-10 text-center">Đang tải...</div>;
  if (!user) return <div className="p-10 text-center text-red-500">Vui lòng đăng nhập!</div>;
console.log(student);
  return (
    <div className="p-4 md:p-8 w-full bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 text-white">
          <User size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Hồ sơ cá nhân</h1>
          <p className="text-slate-400 font-medium text-sm">Quản lý thông tin và thẻ sinh viên trực tuyến</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* TRÁI: THÔNG TIN CHI TIẾT (8 Cột) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>

          <h2 className="text-lg font-black text-slate-800 uppercase mb-8 flex items-center gap-2">
            <User size={20} className="text-blue-600" /> Thông tin cơ bản
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10">
            <InfoItem label="Họ và tên" value={student.fullName} icon={<User size={16} />} />
            <InfoItem label="Mã số sinh viên" value={student.studentCode} icon={<School size={16} />} />
            <InfoItem label="Email liên hệ" value={student.email} icon={<Mail size={16} />} />
            <InfoItem label="Số điện thoại" value={student.phone || "Chưa cập nhật"} icon={<Phone size={16} />} />
            <InfoItem label="Ngày sinh" value={student.birthday || "N/A"} icon={<Calendar size={16} />} />
            <InfoItem label="Khoa đào tạo" value={student?.department || "N/A"} icon={<MapPin size={16} />} />
          </div>

          <div className="mt-10 pt-8 border-t border-slate-50">
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
              <p className="text-blue-800 text-xs font-bold italic">
                * Lưu ý: Nếu thông tin cá nhân có sai sót, vui lòng liên hệ phòng Đào tạo để cập nhật.
              </p>
            </div>
          </div>
        </div>

        {/* PHẢI: THẺ SINH VIÊN (5 Cột) */}
        <div className="lg:col-span-5 sticky top-8 flex flex-col items-center">
          <div className="w-full">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Student ID Card</h2>
            {/* Truyền dữ liệu student vào StudentCard để thẻ đồng bộ thông tin */}
            <StudentCard studentInfo={student} />
          </div>

          <div className="mt-6 w-full max-w-md">
            <button
              onClick={() => window.print()}
              className="w-full py-4 bg-white border-2 border-slate-200 text-slate-600 font-black uppercase text-xs rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              Tải xuống bản mềm (PDF)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Component nhỏ hỗ trợ hiển thị từng dòng thông tin
function InfoItem({ label, value, icon }) {
  return (
    <div className="space-y-1.5 group">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
        <span className="text-slate-300 group-hover:text-blue-500 transition-colors">{icon}</span>
        {label}
      </label>
      <p className="text-slate-700 font-bold text-base bg-slate-50/50 p-3 rounded-xl border border-transparent group-hover:border-blue-50 group-hover:bg-white transition-all">
        {value}
      </p>
    </div>
  );
}