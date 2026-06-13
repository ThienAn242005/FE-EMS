import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../../Service/AuthService";
import { AuthContext } from "../../Context/AuthContext";
import { LogIn, ShieldAlert, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser, user, studentData } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isRedirecting = useRef(false); // Tránh loop redirect

  // 1. LOG THEO DÕI BIẾN ĐỘNG AUTH STATE
  useEffect(() => {
    console.group("🔍 [AUTH CHECK] Kiểm tra trạng thái người dùng");
    console.log("User hiện tại:", user);
    console.log("Dữ liệu Student:", studentData);
    console.log("Path hiện tại:", location.pathname);
    
    if (user && user.role && !isRedirecting.current) {
      console.log("%c>>> PHÁT HIỆN SESSION HỢP LỆ - ĐANG ĐIỀU HƯỚNG...", "color: #3b82f6; font-weight: bold;");
      isRedirecting.current = true;
      handleNavigation(user.role);
    }
    console.groupEnd();
  }, [user, studentData]);

  const handleNavigation = (role) => {
    console.log(`🚀 [NAVIGATE] Chuyển hướng tới phân hệ: ${role}`);
    switch (role) {
      case "ADMIN": navigate("/admin"); break;
      case "TEACHER": navigate("/teacher"); break;
      case "ACCOUNTANT": navigate("/accountant"); break;
      case "STUDENT": navigate("/student"); break;
      default: navigate("/student");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("📡 [API CALL] Gửi yêu cầu đăng nhập...");
      const data = await login(username, password);

      if (data && data.token) {
        const { role, fullName, token } = data;
        
        console.log("%c✅ ĐĂNG NHẬP THÀNH CÔNG", "background: #10b981; color: white; padding: 2px 5px; border-radius: 4px;");
        console.log("Token nhận được:", token.substring(0, 15) + "...");
        console.log("Quyền hạn:", role);

        // Lưu vào Context và LocalStorage
        await loginUser(token, username, fullName, role);
        
        // Quan trọng: Không cần navigate ở đây nếu useEffect ở trên đã làm việc đó
        // Nhưng để chắc chắn, ta gọi luôn
        isRedirecting.current = true;
        handleNavigation(role);
        
      } else {
        throw new Error("Phản hồi Server thiếu dữ liệu Token/Role");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || "Sai tài khoản hoặc mật khẩu!";
      console.error("%c❌ LỖI ĐĂNG NHẬP", "background: #ef4444; color: white; padding: 2px 5px; border-radius: 4px;");
      console.log("Chi tiết lỗi:", err);
      setError(errorMsg);
      isRedirecting.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] p-4">
      <div className="w-full max-w-md p-10 bg-white rounded-[32px] shadow-2xl shadow-blue-900/5 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-200">
            {loading ? <Loader2 size={32} className="animate-spin" /> : <LogIn size={32} />}
          </div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight italic">VUST LOGIN</h2>
          <p className="text-slate-400 font-bold mt-1 text-[10px] uppercase tracking-widest">Dùng Mã Định Danh để đăng nhập</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 text-red-600 font-bold bg-red-50 p-4 rounded-2xl border border-red-100">
            <ShieldAlert size={20} className="flex-shrink-0" />
            <span className="text-xs uppercase">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Mã đăng nhập</label>
            <input
              type="text"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700"
              placeholder="Nhập mã sinh viên hoặc giảng viên"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Mật khẩu</label>
            <input
              type="password"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-[20px] font-black uppercase text-xs tracking-widest hover:bg-slate-900 hover:shadow-2xl transition-all disabled:bg-slate-300 mt-4 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Xác nhận đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}