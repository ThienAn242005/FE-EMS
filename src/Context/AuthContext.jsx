import { createContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useWebSocket } from "../hooks/WebSocket"; 
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const isFetching = useRef(false);

  const { subscribe } = useWebSocket(user?.role === "TEACHER" ? user?.teacherCode : user?.studentCode);

  const syncAuthHeader = useCallback((token) => {
    if (token && token.includes(".")) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, []);

  // --- HÀM FETCH PROFILE CHUNG ---
  const fetchProfile = useCallback(async (token, role, code) => {
    // ⚡ CHẶN ADMIN: Admin không có profile trong bảng SV/GV nên không fetch
    if (!token || role === "ADMIN" || isFetching.current) {
        if (role === "ADMIN") console.log(">>> Role ADMIN: Bỏ qua fetch profile chi tiết.");
        return;
    }

    try {
      isFetching.current = true;
      const endpoint = role === "TEACHER" 
        ? `http://localhost:8080/api/teachers/${code}` 
        : `http://localhost:8080/api/students/me`;

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (role === "STUDENT") {
        setStudentData({ ...res.data });
      }

      // Cập nhật fullName "xịn" từ DB
      setUser(prev => ({
        ...prev,
        fullName: res.data.fullName || prev.fullName,
        studentCode: role === "STUDENT" ? res.data.studentCode : null,
        teacherCode: role === "TEACHER" ? res.data.teacherCode : null
      }));
      
      console.log(`>>> Fetch Profile thành công cho ${role}:`, res.data.fullName);

    } catch (err) {
      console.error(">>> Fetch Profile thất bại:", err.response?.status);
      // Chỉ logout nếu thực sự bị 401 (Token hỏng), các lỗi khác (500, 404) thì không văng
      if (err.response?.status === 401) {
          logoutUser();
      }
    } finally {
      isFetching.current = false;
    }
  }, []);

  // --- LOGIC WEBSOCKET ---
  useEffect(() => {
    const identifier = user?.role === "TEACHER" ? user?.teacherCode : user?.studentCode;
    
    if (identifier && subscribe) {
      const subscription = subscribe(`/user/${identifier}/queue/status`, (status) => {
        if (status === "UNLOCKED") {
          toast.success("Hệ thống đã mở khóa tài khoản!", { icon: '🚀' });
          fetchProfile(user.token, user.role, identifier);
          if (window.location.pathname.includes("payment-lock") || window.location.pathname.includes("payment-result")) {
            setTimeout(() => { window.location.href = "/student"; }, 1500);
          }
        }
        
        if (status === "LOCKED") {
          toast.error("Tài khoản của bạn đã bị khóa!");
          fetchProfile(user.token, user.role, identifier);
        }
      });
      return () => subscription?.unsubscribe();
    }
  }, [user?.studentCode, user?.teacherCode, user?.role, subscribe, fetchProfile]);

  // --- KHỞI TẠO (KHI F5 TRANG) ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        const saved = localStorage.getItem("user");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.token) {
            syncAuthHeader(parsed.token);
            setUser(parsed);
            // Chỉ fetch nếu không phải ADMIN
            if (parsed.role !== "ADMIN") {
                const code = parsed.role === "TEACHER" ? parsed.teacherCode : parsed.username;
                await fetchProfile(parsed.token, parsed.role, code);
            }
          }
        }
      } catch (err) {
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [syncAuthHeader, fetchProfile]);

  const loginUser = async (token, username, fullName, role) => {
    const userdata = { 
      token, 
      username, 
      role, 
      fullName,
      studentCode: role === "STUDENT" ? username : null,
      teacherCode: role === "TEACHER" ? username : null 
    };

    // 1. Đồng bộ Header ngay lập tức
    syncAuthHeader(token);
    
    // 2. Lưu vào Storage và State
    localStorage.setItem("user", JSON.stringify(userdata));
    localStorage.setItem("token", token);
    setUser(userdata);

    // 3. Chỉ fetch profile cho SV/GV. Admin bỏ qua để không bị 401/404 rồi văng.
    if (role !== "ADMIN") {
        await fetchProfile(token, role, username);
    }
    
    console.log(`>>> Đăng nhập thành công với vai trò: ${role}`);
  };

  const logoutUser = () => {
    localStorage.clear();
    setUser(null);
    setStudentData(null);
    syncAuthHeader(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        studentData, 
        loginUser, 
        logoutUser, 
        loading,
        refreshStudentData: () => {
            if (user?.role !== "ADMIN") {
                fetchProfile(user?.token, user?.role, user?.role === "TEACHER" ? user?.teacherCode : user?.studentCode)
            }
        }
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};