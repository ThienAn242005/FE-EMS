import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, Loader2, Search, UserCheck, Users, BookOpen } from "lucide-react";

export default function AdminEnrollmentManager() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/enrollments");
            setEnrollments(res.data);
        } catch (err) {
            console.error("Lỗi tải danh sách:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            // API này sẽ kích hoạt syncPaymentData ở Backend
            await axios.patch(`http://localhost:8080/api/enrollments/${id}/approve`);
            alert("Phê duyệt thành công! Học phí đã được cập nhật.");
            fetchEnrollments(); 
        } catch (err) {
            alert(err.response?.data || "Lỗi khi duyệt môn học.");
        }
    };

    const filtered = enrollments.filter(e => 
        e.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.student?.studentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.course?.subject?.subjectName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
            <p className="text-slate-500 font-bold">Đang tải danh sách chờ duyệt...</p>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen font-sans">
            {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 uppercase flex items-center gap-3">
                        <UserCheck className="text-blue-600" size={36} /> Quản lý đăng ký môn học
                    </h1>
                    <p className="text-slate-500 font-medium">Hệ thống phê duyệt đăng ký & Tự động quyết toán học phí</p>
                </div>
                
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Tìm tên SV, mã SV hoặc môn học..."
                        className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-none shadow-sm focus:ring-2 ring-blue-500 font-medium transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b">
                            <th className="p-6">Thông tin sinh viên</th>
                            <th className="p-6">Chi tiết môn học</th>
                            <th className="p-6 text-center">Tín chỉ</th>
                            <th className="p-6">Tình trạng lớp</th>
                            <th className="p-6">Trạng thái</th>
                            <th className="p-6 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.length > 0 ? filtered.map(e => (
                            <tr key={e.id} className="hover:bg-blue-50/20 transition-all group">
                                <td className="p-6">
                                    <p className="font-black text-slate-700 group-hover:text-blue-700 transition-colors">{e.student?.fullName}</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-tighter">{e.student?.studentCode}</p>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={14} className="text-slate-300" />
                                        <p className="font-bold text-slate-600 text-sm">{e.course?.subject?.subjectName}</p>
                                    </div>
                                    <p className="text-[10px] bg-slate-100 w-fit px-2 py-0.5 rounded-md text-slate-500 mt-1.5 font-bold">
                                        Lớp: {e.course?.sectionCode}
                                    </p>
                                </td>
                                <td className="p-6 text-center">
                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-black text-xs">
                                        {e.course?.subject?.credit} TC
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                        <Users size={14} />
                                        <span>{e.course?.currentEnrolled} / {e.course?.maxCapacity}</span>
                                    </div>
                                    <div className="w-20 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500" 
                                            style={{ width: `${(e.course?.currentEnrolled / e.course?.maxCapacity) * 100}%` }}
                                        />
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider ${
                                        e.approved 
                                        ? 'bg-emerald-100 text-emerald-600' 
                                        : 'bg-orange-100 text-orange-600 shadow-sm shadow-orange-100'
                                    }`}>
                                        {e.approved ? "Hoàn tất" : "Chờ xử lý"}
                                    </span>
                                </td>
                                <td className="p-6 text-center">
                                    {!e.approved ? (
                                        <button 
                                            onClick={() => handleApprove(e.id)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2 mx-auto"
                                        >
                                            Phê duyệt
                                        </button>
                                    ) : (
                                        <div className="flex items-center justify-center text-emerald-500 gap-1 font-bold text-xs">
                                            <CheckCircle size={18} />
                                            <span>Xong</span>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="p-20 text-center text-slate-400 italic">
                                    Không tìm thấy dữ liệu đăng ký nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}