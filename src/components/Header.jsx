import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, Info, Book, CreditCard, Settings, User as UserIcon, Briefcase, GraduationCap } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

export default function Header() {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // Xác định Role
    const isTeacher = user?.role?.toUpperCase() === "TEACHER";
    const isAdmin = user?.role?.toUpperCase() === "ADMIN";

    const [profile, setProfile] = useState(null);
    const [showNoti, setShowNoti] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const notiRef = useRef(null);
    const profileRef = useRef(null);

    // Lấy mã định danh phù hợp theo Role
    const getIdentifier = () => {
        if (isTeacher) return user?.teacherCode;
        return user?.studentCode;
    };

    // 1. Lấy thông tin Profile (Tự động nhận diện Student/Teacher)
    useEffect(() => {
        const fetchProfileHeader = async () => {
            if (!user?.token) return;
            try {
                // ĐỔI ENDPOINT TÙY THEO ROLE
                const endpoint = isTeacher
                    ? `http://localhost:8080/api/teachers/${user.teacherCode}`
                    : "http://localhost:8080/api/students/me";

                const res = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setProfile(res.data);
            } catch (err) {
                console.error("Lỗi lấy profile header:", err);
            }
        };
        fetchProfileHeader();
    }, [user, isTeacher]);

    // 2. Lấy thông báo theo mã Code (studentCode hoặc teacherCode)
    useEffect(() => {
        const fetchNotifications = async () => {
            const identifier = getIdentifier();
            if (!identifier) return;

            try {
                // Sửa Endpoint: Gọi theo mã định danh thay vì ID số
                const res = await axios.get(`http://localhost:8080/notifications/student/${identifier}`);
                const sortedData = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setNotifications(sortedData);
                setUnreadCount(sortedData.filter(n => !n.isRead).length);
            } catch (err) {
                console.error("Lỗi lấy thông báo:", err);
            }
        };
        fetchNotifications();
    }, [user, isTeacher]);

    const handleBellClick = async () => {
        setShowNoti(!showNoti);
        setShowProfile(false);
        const identifier = getIdentifier();

        if (!showNoti && unreadCount > 0 && identifier) {
            try {
                // Sửa Endpoint: Đánh dấu đã đọc theo mã định danh
                await axios.put(`http://localhost:8080/notifications/mark-read-all/${identifier}`);
                setUnreadCount(0);
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            } catch (err) {
                console.error("Lỗi cập nhật trạng thái đọc:", err);
            }
        }
    };

    const handleLogout = () => { logoutUser(); navigate("/login"); };

    const getRedirectPath = (subPath) => {
        if (isAdmin) return `/admin${subPath}`;
        if (isTeacher) return `/teacher${subPath}`;
        return `/student${subPath}`;
    };

    // Đóng dropdown khi click ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notiRef.current && !notiRef.current.contains(event.target)) setShowNoti(false);
            if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfile(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="w-full bg-blue-700 shadow-lg px-5 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-blue-700/95">
            {/* LEFT: LOGO */}
            <div className="flex items-center gap-4">
                <img src="/uni.jpg" alt="logo" className="h-10 w-10 rounded-full border-2 border-white/50 shadow" />
                <div className="flex flex-col">
                    <Link className="text-white font-black text-lg tracking-tight uppercase" to={getRedirectPath("")}>
                        VUST – {isTeacher ? "Teacher" : "Portal"}
                    </Link>
                    <span className="text-blue-200 text-[9px] uppercase font-black tracking-[0.2em] -mt-1">
                        {isTeacher ? "Hệ thống giảng viên" : "Hệ thống quản lý"}
                    </span>
                </div>
            </div>

            {/* CENTER: SEARCH */}
            <div className="hidden md:flex items-center w-1/3 bg-white rounded-full px-4 py-2 shadow-inner">
                <Search size={18} className="text-gray-400" />
                <input type="text" placeholder={isTeacher ? "Tìm tên sinh viên, lớp học..." : "Tìm tài liệu, lịch thi..."} className="w-full px-3 outline-none text-sm text-slate-600" />
            </div>

            {/* RIGHT: NOTI + PROFILE */}
            <div className="flex items-center gap-6">
                <div className="relative" ref={notiRef}>
                    <button onClick={handleBellClick} className="relative p-1 transition-transform active:scale-90">
                        <Bell className={showNoti ? 'text-yellow-300' : 'text-white'} size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-blue-700">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    {showNoti && (
                        <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-4 bg-slate-50 border-b flex justify-between items-center text-xs font-black uppercase text-slate-800">
                                Thông báo mới
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((noti) => (
                                        <Link key={noti.id} to={getRedirectPath("/notifications")} onClick={() => setShowNoti(false)}
                                            className={`block p-4 border-b last:border-0 hover:bg-slate-50 transition cursor-pointer flex gap-3 ${!noti.isRead ? 'bg-blue-50/50 border-l-4 border-blue-600' : ''}`}>
                                            <div className="flex-1 text-xs">
                                                <p className={!noti.isRead ? 'font-bold text-slate-900' : 'text-slate-600'}>{noti.title}</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{noti.description}</p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-400 text-xs italic">Không có thông báo</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Avatar */}
                <div className="relative" ref={profileRef}>
                    <button onClick={() => { setShowProfile(!showProfile); setShowNoti(false); }} className="block focus:outline-none transition-transform active:scale-95">
                        <img
                            src={
                                profile?.user?.avatar ||   // Trường hợp lồng trong object user (thường là student /me)
                                profile?.avatar ||         // Trường hợp nằm trực tiếp ở object ngoài (thường là teacher)
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || 'User')}&background=6366f1&color=fff`
                            }
                            alt="profile"
                            className={`h-9 w-9 rounded-full border-2 shadow-sm transition-all object-cover ${showProfile ? 'border-yellow-400 scale-110' : 'border-white'}`}
                        />
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl p-2 border border-gray-100 animate-in fade-in zoom-in duration-200">
                            <div className="px-4 py-3 border-b mb-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {isTeacher ? "Tài khoản giảng viên" : "Tài khoản sinh viên"}
                                </p>
                                <p className="text-sm font-black text-slate-800 truncate uppercase tracking-tight">{profile?.fullName || "Portal User"}</p>
                                <p className="text-[10px] font-bold text-blue-600">
                                    {isTeacher ? `MSGV: ${profile?.teacherCode}` : `MSSV: ${profile?.studentCode}`}
                                </p>
                            </div>
                            <Link to={getRedirectPath("/profile")} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition" onClick={() => setShowProfile(false)}>
                                {isTeacher ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                                Hồ sơ {isTeacher ? "giảng viên" : "cá nhân"}
                            </Link>
                            <div className="border-t my-1"></div>
                            <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl font-black transition">
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}