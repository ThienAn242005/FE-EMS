import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
    Calendar, BookOpen, Target, CreditCard, 
    Bell, User, ChevronRight, Lock, LogOut 
} from "lucide-react";

// Context
import { AuthContext } from "../../Context/AuthContext";

// Components
import Card from "../../components/Card";
import StudentNews from "./News";
import StudentKPIDashboard from "./KPI";
import AcademicAlert from "./AcademicAlert"; 
import { BannerSkeleton, MenuCardSkeleton } from "../../components/CommonSkeleton";

const API_BASE_URL = "http://localhost:8080/api";

const MENU_ITEMS = [
    { to: "/student/curriculum", title: "📘 Chương Trình Khung", icon: BookOpen, color: "text-blue-500", label: "Lộ trình 8 học kỳ" },
    { to: "/student/schedule", title: "📅 Thời Khóa Biểu", icon: Calendar, color: "text-indigo-500", label: "Lịch học tuần này" },
    { to: "/student/performance", title: "🎯 Kết Quả Học Tập", icon: Target, color: "text-emerald-500", label: "Bảng điểm tích lũy" },
    { to: "/student/tuition", title: "💰 Học Phí & Lệ Phí", icon: CreditCard, color: "text-amber-500", label: "Thanh toán trực tuyến" },
    { to: "/student/notifications", title: "🔔 Thông Báo", icon: Bell, color: "text-rose-500", label: "Tin tức & Nhắc nhở" },
    { to: "/student/profile", title: "👤 Hồ Sơ Cá Nhân", icon: User, color: "text-slate-500", label: "Thông tin sinh viên" },
];

export default function StudentHome() {
    // SỬA: Lấy user và authLoading từ Context
    const { user, loading: authLoading, logoutUser } = useContext(AuthContext);
    
    const [banners, setBanners] = useState(["https://images.unsplash.com/photo-1604079622133-ff5d8b17a378?w=1200"]);
    const [student, setStudent] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            // SỬA: Chỉ fetch khi đã xác thực xong và có studentCode
            if (authLoading || !user?.studentCode) return;

            try {
                setLoading(true);
                const token = user.token || localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                // Gọi API lấy thông tin dựa trên mã sinh viên của người đang đăng nhập
                const [bannerRes, studentRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/banners`).catch(() => ({ data: [] })),
                    axios.get(`${API_BASE_URL}/students/me`, { headers })
                ]);

                if (bannerRes.data && bannerRes.data.length > 0) {
                    setBanners(bannerRes.data.map(b => b.imageUrl));
                }
                setStudent(studentRes.data);
            } catch (err) {
                console.error("Lỗi fetch dữ liệu Dashboard:", err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, [user?.studentCode, authLoading]);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide(s => (s + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners]);

    const isDismissed = !loading && (student?.academicStatus === 'DISMISSAL' || student?.academic_status === 'DISMISSAL');

    if (authLoading) return <BannerSkeleton />;

    return (
        <div className={`p-6 min-h-screen font-sans w-full relative transition-all duration-700 ${isDismissed ? "bg-slate-200" : "bg-[#f8fafc]"}`}>
            
            {isDismissed && (
                <div 
                    className="fixed inset-0 z-[8888] bg-slate-900/10 backdrop-blur-[1px] cursor-not-allowed"
                    onClick={() => {
                        const alertBox = document.getElementById("dismissal-modal");
                        alertBox?.classList.add("animate-bounce");
                        setTimeout(() => alertBox?.classList.remove("animate-bounce"), 500);
                    }}
                />
            )}

            <section className={`mb-10 rounded-[32px] overflow-hidden shadow-sm relative border-4 border-white transition-all ${isDismissed ? "grayscale opacity-50" : ""}`}>
                {loading ? <BannerSkeleton /> : (
                    <img src={banners[currentSlide]} alt="Banner" className="w-full h-64 md:h-80 object-cover transition-opacity duration-1000" />
                )}
            </section>

            <header className={`mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 transition-all ${isDismissed ? "grayscale opacity-50" : ""}`}>
                {!loading && student && (
                    <>
                        <div>
                            <h1 className="text-3xl font-[1000] text-slate-800 uppercase tracking-tighter">Dashboard</h1>
                            <p className="text-slate-500 font-medium italic">Chào mừng trở lại, <span className="text-blue-600 font-black">{student?.fullName}</span>!</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-700 to-blue-600 px-6 py-3 rounded-[24px] shadow-xl text-white flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/50 bg-white/20">
                                <img src={student?.avatar || `https://ui-avatars.com/api/?name=${student?.fullName}&background=random`} className="w-full h-full object-cover" alt="Avatar" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">MSSV: {student?.studentCode}</p>
                                <h2 className="text-lg font-black uppercase tracking-tight italic">{student?.fullName}</h2>
                            </div>
                        </div>
                    </>
                )}
            </header>

            {isDismissed && (
                <div id="dismissal-modal" className="relative z-[9999] mb-12 animate-in slide-in-from-top-10 duration-500">
                    <div className="bg-white rounded-[40px] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] border-t-8 border-red-600 p-8 md:p-12 text-center">
                        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Lock size={40} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-3xl font-[1000] text-slate-800 uppercase tracking-tighter mb-2">Truy cập bị hạn chế</h2>
                        <div className="inline-block px-4 py-1 bg-red-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest mb-6">
                            Trạng thái: Buộc thôi học
                        </div>
                        <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 leading-relaxed font-medium">
                            Tài khoản của sinh viên <b>{student?.fullName}</b> đã bị khóa.<br/> 
                            Vui lòng liên hệ <span className="text-slate-900 font-bold underline">Phòng Đào tạo</span> để được hỗ trợ.
                        </p>
                        <button 
                            onClick={logoutUser}
                            className="px-12 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 mx-auto transition-all active:scale-95 shadow-2xl"
                        >
                            <LogOut size={18} /> Đăng xuất ngay
                        </button>
                    </div>
                </div>
            )}

            {!loading && student && (student?.academicStatus === "WARNING" || student?.academic_status === "WARNING") && (
                <AcademicAlert academicStatus={student.academicStatus || student.academic_status} gpa={student.gpa} />
            )}

            <nav className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${isDismissed ? "grayscale opacity-40 pointer-events-none" : ""}`}>
                {loading ? [...Array(6)].map((_, i) => <MenuCardSkeleton key={i} />) : 
                    MENU_ITEMS.map((item, idx) => (
                        <Link 
                            to={isDismissed ? "#" : item.to} 
                            key={idx} 
                            className="group transition-all block active:scale-95"
                            onClick={(e) => isDismissed && e.preventDefault()}
                        >
                            <Card title={item.title} blue isHover={!isDismissed}>
                                <div className="py-10 flex flex-col items-center border-2 border-dashed border-slate-100 rounded-[3rem] group-hover:border-blue-300 group-hover:bg-blue-50/30 transition-all duration-300">
                                    <div className="p-4 bg-slate-50 rounded-2xl mb-3 group-hover:bg-white transition-colors shadow-sm">
                                        <item.icon size={42} className={`${item.color}`} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                                    <div className="mt-4 flex items-center gap-1 text-slate-300 group-hover:text-blue-500 transition-colors">
                                        <span className="text-[9px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">Truy cập</span>
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))
                }
            </nav>

            <main className={`mt-20 space-y-16 transition-all duration-700 ${isDismissed ? "grayscale opacity-30 blur-[1px] pointer-events-none" : ""}`}>
                <section>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-8 text-center underline decoration-blue-500 decoration-4 underline-offset-8">Năng lực học tập</h3>
                    <StudentKPIDashboard earnedCredits={student?.credits || 0} totalCredits={150} gpa={student?.gpa || 0.0} />
                </section>
                <section>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-8 text-center underline decoration-indigo-500 decoration-4 underline-offset-8">Tin tức & Sự kiện</h3>
                    <StudentNews />
                </section>
            </main>

            <footer className="mt-20 text-center pb-10 opacity-20">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">VUST University • Portal v2.0</p>
            </footer>
        </div>
    );
}