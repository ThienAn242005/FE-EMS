import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Bell, BookOpen, CreditCard, AlertCircle, Info, ChevronRight, Globe, Briefcase } from "lucide-react";
import { AuthContext } from "../../Context/AuthContext";

export function Notifications() {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Tự động xác định mã định danh dựa trên Role để gọi API
    const isTeacher = user?.role === "TEACHER";
    const identifier = isTeacher ? user?.teacherCode : (user?.studentCode || user?.username);
    
    // LẤY TÊN ĐẦY ĐỦ TỪ CONTEXT
    const fullName = user?.fullName || "Người dùng";

    // 1. Hàm lấy thông báo
    const fetchNotifications = async () => {
        if (!identifier) return;
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/notifications/student/${identifier}`);
            const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setNotifications(sortedData);
        } catch (error) {
            console.error("Lỗi khi tải thông báo:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [identifier]);

    const getIconConfig = (type) => {
        switch (type) {
            case 'ACADEMIC': return { icon: <BookOpen size={20} />, color: "text-blue-600 bg-blue-50" };
            case 'TUITION': return { icon: <CreditCard size={20} />, color: "text-amber-600 bg-amber-50" };
            case 'SYSTEM': return { icon: <AlertCircle size={20} />, color: "text-rose-600 bg-rose-50" };
            case 'TEACHING': return { icon: <Briefcase size={20} />, color: "text-indigo-600 bg-indigo-50" };
            default: return { icon: <Info size={20} />, color: "text-slate-600 bg-slate-50" };
        }
    };

    const handleItemClick = async (notif) => {
        if (!notif.isRead && identifier) {
            try {
                await axios.put(`http://localhost:8080/notifications/mark-read-all/${identifier}`);
                setNotifications(prev => prev.map(n => ({...n, isRead: true})));
            } catch (err) {
                console.error("Không thể cập nhật trạng thái đọc", err);
            }
        }
    };

    if (loading) return (
        <div className="p-6 flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            <span className="ml-3 text-slate-500 font-bold">Đang tải thông báo...</span>
        </div>
    );

    return (
        <div className="p-6 w-full bg-[#f8fafc] min-h-screen font-sans">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
                    <Bell className="text-blue-700" size={32} /> Thông Báo
                </h1>
                
                {/* ĐÃ SỬA: Hiển thị fullName thay vì identifier */}
                <p className="text-slate-500 font-medium italic mt-2">
                    Chào {isTeacher ? "Giảng viên" : "Sinh viên"}: <span className="text-blue-600 font-[1000] uppercase">{fullName}</span> 
                    <span className="mx-2 text-slate-300">|</span>
                    Mã: <span className="text-slate-700 font-bold">{identifier}</span>
                    <span className="mx-2 text-slate-300">•</span>
                    Bạn có <span className="text-blue-600 font-bold">{notifications.filter(n => !n.isRead).length}</span> tin mới
                </p>
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notif) => {
                        const config = getIconConfig(notif.type);
                        return (
                            <div 
                                key={notif.id} 
                                onClick={() => handleItemClick(notif)}
                                className={`group relative bg-white p-5 rounded-2xl shadow-sm border transition-all flex gap-5 items-start cursor-pointer
                                    ${notif.isGlobal ? 'border-purple-100 bg-purple-50/20' : 'border-slate-100'} 
                                    ${notif.isRead ? 'opacity-60 grayscale-[0.2]' : 'hover:border-blue-200 hover:shadow-md border-l-4 border-l-blue-600'} 
                                `}
                            >
                                {!notif.isRead && (
                                    <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
                                )}

                                <div className={`p-3 rounded-xl ${config.color} shrink-0 shadow-sm transition-transform group-hover:scale-110`}>
                                    {config.icon}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1 gap-4">
                                        <div className="flex flex-col gap-1">
                                            {notif.isGlobal && (
                                                <span className="flex items-center gap-1 w-fit bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider mb-1">
                                                    <Globe size={10} /> Toàn trường
                                                </span>
                                            )}
                                            <h3 className={`font-bold text-lg group-hover:text-blue-700 transition-colors leading-tight ${notif.isRead ? 'text-slate-500' : 'text-slate-800'}`}>
                                                {notif.title}
                                            </h3>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1 whitespace-nowrap">
                                            {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString('vi-VN') : "---"}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed mt-1 line-clamp-2 group-hover:line-clamp-none transition-all">
                                        {notif.description}
                                    </p>
                                </div>
                                
                                <div className="self-center text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 shadow-inner">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="text-slate-300" size={32} />
                        </div>
                        <p className="text-slate-400 font-medium text-lg">Hộp thư đang trống</p>
                    </div>
                )}
            </div>
        </div>
    );
}