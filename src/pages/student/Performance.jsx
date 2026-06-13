import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { 
    Trophy, BookOpen, Target, Clock, 
    AlertCircle, ChevronRight, BarChart3 
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080/api";

export default function StudentPerformance() {
    // SỬA: Dùng studentCode từ AuthContext
    const { user, loading: authLoading } = useContext(AuthContext);
    const [grades, setGrades] = useState([]);
    const [summary, setSummary] = useState({
        requiredCredits: 0,
        accumulatedCredits: 0,
        remainingCredits: 0,
        gpaCumulative: "0.00"
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPerformanceData = async () => {
            // SỬA: Kiểm tra studentCode thay vì id
            if (authLoading || !user?.studentCode) return;

            try {
                setLoading(true);
                const token = user.token || localStorage.getItem("token");
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                // SỬA: Đổi Endpoint sang "/student/code/{studentCode}" như Backend đã sửa
                const [summaryRes, gradesRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/grades/student/code/${user.studentCode}/summary`, config),
                    axios.get(`${API_BASE_URL}/grades/student/code/${user.studentCode}`, config)
                ]);

                // Map dữ liệu (vì cấu trúc SemesterGradeDTO của bạn là mảng các kỳ, 
                // ta cần làm phẳng nó ra để hiện trong bảng chi tiết học phần)
                const allGradesFlat = gradesRes.data.flatMap(semester => 
                    semester.subjects.map(subject => ({
                        ...subject,
                        semesterName: semester.semesterName,
                        id: Math.random() // Tạo key tạm nếu subject không có ID
                    }))
                );

                setSummary(summaryRes.data);
                setGrades(allGradesFlat);
                setError(null);
            } catch (err) {
                console.error("Performance API Error:", err);
                setError(err.response?.status === 404 
                    ? "Không tìm thấy dữ liệu học tập cho mã sinh viên này." 
                    : "Lỗi kết nối hệ thống. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchPerformanceData();
    }, [user?.studentCode, authLoading]); // SỬA: Lắng nghe studentCode

    const progress = useMemo(() => {
        if (!summary.requiredCredits) return 0;
        return (summary.accumulatedCredits / summary.requiredCredits) * 100;
    }, [summary]);

    if (authLoading || loading) return <LoadingSpinner />;
    if (error) return <ErrorView message={error} />;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 bg-[#f8fafc] min-h-screen">
            {/* --- Tiêu đề --- */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 text-white">
                    <Trophy size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Kết Quả Học Tập</h1>
                    <p className="text-slate-400 text-sm font-medium">Theo dõi tiến độ tích lũy và điểm số</p>
                </div>
            </div>

            {/* --- Thống kê tổng quát --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Tiến độ tín chỉ</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-black text-indigo-600">{summary.accumulatedCredits}</span>
                                <span className="text-slate-300 text-xl font-bold">/ {summary.requiredCredits} TC</span>
                            </div>
                            <div className="mt-6 w-full md:w-64">
                                <div className="flex justify-between text-[10px] font-black mb-2 uppercase">
                                    <span className="text-slate-400">Hoàn thành</span>
                                    <span className="text-indigo-600">{progress.toFixed(1)}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-indigo-600 transition-all duration-1000" 
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center md:items-end md:border-l border-slate-50 md:pl-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">GPA Tích lũy</p>
                            <div className="text-6xl font-black text-emerald-500">
                                {typeof summary.gpaCumulative === 'number' ? summary.gpaCumulative.toFixed(2) : summary.gpaCumulative}
                            </div>
                            <p className="text-[10px] font-black text-emerald-500/50 uppercase mt-2">Thang điểm 4.0</p>
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                    <Target size={120} className="absolute -bottom-10 -right-10 text-white/10" />
                    <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-6">Mục tiêu còn lại</h3>
                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium opacity-80">Cần tích lũy thêm</span>
                            <span className="text-2xl font-black">{summary.remainingCredits} TC</span>
                        </div>
                        <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                            <p className="text-[10px] leading-relaxed opacity-80 italic">
                                * Hệ thống tự động tính toán dựa trên chương trình khung của sinh viên {user?.studentCode}.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Bảng điểm chi tiết --- */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-2">
                        <BarChart3 size={18} className="text-indigo-600" />
                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Chi tiết học phần</h2>
                    </div>
                    <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-400">
                        {grades.length} MÔN ĐÃ CÓ ĐIỂM
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-8 py-4 text-left">Học kỳ</th>
                                <th className="px-8 py-4 text-left">Môn học</th>
                                <th className="px-4 py-4 text-center">Tín chỉ</th>
                                <th className="px-4 py-4 text-center">Tổng kết (Hệ 10)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {grades.map((grade, index) => (
                                <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-8 py-5 text-[10px] font-bold text-indigo-600 uppercase">
                                        {grade.semesterName}
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                                            {grade.name}
                                        </p>
                                    </td>
                                    <td className="px-4 py-5 text-center font-bold text-slate-600">{grade.credit}</td>
                                    <td className="px-4 py-5 text-center">
                                        <span className={`inline-block px-3 py-1 rounded-lg font-black text-sm ${
                                            grade.grade >= 4 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                                        }`}>
                                            {grade.grade?.toFixed(1) || "0.0"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 mb-4" />
        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Đang đồng bộ dữ liệu...</p>
    </div>
);

const ErrorView = ({ message }) => (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] p-6">
        <div className="bg-white p-10 rounded-[2.5rem] border border-red-100 shadow-xl shadow-red-50 text-center max-w-md">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h2 className="text-lg font-black text-slate-800 uppercase mb-2">Lỗi truy xuất</h2>
            <p className="text-sm text-slate-500 font-medium mb-6">{message}</p>
            <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs hover:bg-slate-800 transition-all"
            >
                Thử lại ngay
            </button>
        </div>
    </div>
);