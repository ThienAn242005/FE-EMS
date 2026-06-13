import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { User, Shield, Bell, Camera, Lock, Save, CheckCircle, AlertCircle } from "lucide-react";
import { AuthContext } from "../../Context/AuthContext";

export default function SettingsPage() {
  const { user, loading: authLoading, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", content: "" });

  // 1. Lấy dữ liệu profile từ Backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (authLoading || !user) return;
      try {
        const token = user.token;
        const res = await axios.get("http://localhost:8080/api/students/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudent(res.data);
      } catch (err) {
        console.error("Lỗi lấy thông tin cài đặt:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, authLoading]);

  // Hàm hiển thị thông báo tạm thời
  const showAlert = (type, content) => {
    setMessage({ type, content });
    setTimeout(() => setMessage({ type: "", content: "" }), 5000);
  };

  if (authLoading || loading) return <div className="p-20 text-center font-bold text-blue-600 animate-pulse uppercase tracking-widest">Đang tải cấu hình...</div>;
  if (!user) return <div className="p-20 text-center text-red-500 font-bold">Vui lòng đăng nhập để truy cập!</div>;

  return (
    <div className="p-4 md:p-8 w-full bg-[#f8fafc] min-h-screen">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* SIDEBAR BÊN TRÁI */}
        <div className="lg:w-72 flex flex-col gap-3">
          <div className="mb-6">
            <h1 className="text-3xl font-[1000] text-slate-800 uppercase tracking-tighter">Cài đặt</h1>
            <p className="text-slate-400 text-xs font-bold uppercase mt-1 tracking-wider">Tài khoản & Bảo mật</p>
          </div>
          <nav className="flex flex-col gap-2">
            <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={<User size={20} />} label="Hồ sơ cá nhân" />
            <TabButton active={activeTab === "security"} onClick={() => setActiveTab("security")} icon={<Shield size={20} />} label="Mật khẩu & Bảo mật" />
            <TabButton active={activeTab === "notification"} onClick={() => setActiveTab("notification")} icon={<Bell size={20} />} label="Thông báo" />
          </nav>
        </div>

        {/* NỘI DUNG CHÍNH */}
        <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
          
          <div className="p-8 md:p-12">
            {message.content && (
              <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${
                message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
              }`}>
                {message.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span className="text-sm font-bold">{message.content}</span>
              </div>
            )}

            {activeTab === "profile" && (
              <ProfileTab student={student} token={user.token} showAlert={showAlert} />
            )}

            {activeTab === "security" && (
              <SecurityTab token={user.token} showAlert={showAlert} logout={logout} />
            )}
            
            {activeTab === "notification" && (
                <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest italic">Tính năng đang phát triển...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENT TAB HỒ SƠ ---
function ProfileTab({ student, token, showAlert }) {
  const [formData, setFormData] = useState({
    phone: student?.phone || "",
    address: student?.address || ""
  });

  const handleUpdateProfile = async () => {
    try {
      await axios.put("http://localhost:8080/api/students/update-info", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showAlert("success", "Cập nhật thông tin thành công!");
    } catch (err) {
      showAlert("error", "Lỗi cập nhật thông tin!");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-800 uppercase">Thông tin cá nhân</h2>
        <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-black uppercase tracking-widest">MSSV: {student.studentCode}</span>
      </header>

      <div className="flex flex-col sm:flex-row items-center gap-8 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
        <div className="relative group">
          <div className="w-28 h-28 rounded-[32px] overflow-hidden border-4 border-white shadow-md bg-white">
            <img src={student.avatar || `https://ui-avatars.com/api/?name=${student.fullName}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <button className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all"><Camera size={16} /></button>
        </div>
        <div className="text-center sm:text-left">
          <h4 className="font-bold text-slate-800 uppercase text-sm tracking-tight">Ảnh đại diện sinh viên</h4>
          <p className="text-[11px] text-slate-400 mt-1 mb-4 font-medium uppercase tracking-tighter italic">Dung lượng tối đa 2MB (JPG, PNG)</p>
          <button className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:underline">Thay đổi ảnh</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputGroup label="Họ và tên" value={student.fullName} readOnly />
        <InputGroup label="Email sinh viên" value={student.email} readOnly />
        <InputGroup label="Số điện thoại" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="090..." />
        <InputGroup label="Địa chỉ thường trú" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Nhập địa chỉ..." />
      </div>

      <button onClick={handleUpdateProfile} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
        <Save size={16} /> Lưu thay đổi
      </button>
    </div>
  );
}

// --- COMPONENT TAB BẢO MẬT ---
function SecurityTab({ token, showAlert, logout }) {
  const [passData, setPassData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  const handlePasswordChange = async () => {
    if (passData.newPassword !== passData.confirmPassword) {
      showAlert("error", "Xác nhận mật khẩu mới không khớp!");
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/students/change-password", 
        { oldPassword: passData.oldPassword, newPassword: passData.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showAlert("success", "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      setTimeout(() => { logout(); window.location.href = "/login"; }, 2000);
    } catch (err) {
      showAlert("error", err.response?.data || "Mật khẩu cũ không chính xác!");
    }
  };

  return (
    <div className="max-w-md space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-black text-slate-800 uppercase flex items-center gap-3">
        <Lock size={20} className="text-blue-600" /> Thay đổi mật khẩu
      </h2>
      <div className="space-y-6">
        <InputGroup label="Mật khẩu hiện tại" type="password" value={passData.oldPassword} onChange={(e) => setPassData({...passData, oldPassword: e.target.value})} placeholder="••••••••" />
        <InputGroup label="Mật khẩu mới" type="password" value={passData.newPassword} onChange={(e) => setPassData({...passData, newPassword: e.target.value})} placeholder="Tối thiểu 8 ký tự" />
        <InputGroup label="Xác nhận mật khẩu mới" type="password" value={passData.confirmPassword} onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})} placeholder="Nhập lại mật khẩu" />
      </div>
      <button onClick={handlePasswordChange} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95">
        Cập nhật bảo mật
      </button>
    </div>
  );
}

// --- UI HELPERS ---
function TabButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 translate-x-2' : 'text-slate-500 hover:bg-white hover:text-blue-600'}`}>
      <span className={active ? "text-white" : "text-slate-300"}>{icon}</span> {label}
    </button>
  );
}

function InputGroup({ label, value, onChange, readOnly, type = "text", placeholder }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
      <input 
        type={type} value={value} onChange={onChange} readOnly={readOnly} placeholder={placeholder}
        className={`w-full p-4 rounded-2xl text-sm font-bold border transition-all outline-none ${readOnly ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5'}`}
      />
      {readOnly && <p className="text-[9px] text-slate-400 italic ml-1 uppercase tracking-tighter">* Thông tin hệ thống</p>}
    </div>
  );
}