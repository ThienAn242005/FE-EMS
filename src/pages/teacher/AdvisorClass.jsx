import React, { useState, useEffect, useContext } from 'react';
import api from "../../Service/api";
import { alertService } from "../../utils/swalUtils";
import { AuthContext } from "../../Context/AuthContext";
import { 
  Users, UserCheck, UserX, AlertTriangle, 
  Search, Eye, FileText, Filter, Download, Loader2 
} from 'lucide-react';

export default function AdvisorClassPage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [students, setStudents] = useState([]);
    const [classInfo, setClassInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");

    useEffect(() => {
        if (!authLoading && user?.teacherCode) {
            initAdvisorData();
        }
    }, [user, authLoading]);

    const initAdvisorData = async () => {
        try {
            setLoading(true);
            const classRes = await api.get(`/teachers/${user.teacherCode}/advisor-class`);
            const currentClass = classRes.data;
            setClassInfo(currentClass);

            const studentRes = await api.get(`/teachers/advisor/class/${currentClass.id}`);
            setStudents(studentRes.data);
            
            // Debug dữ liệu để kiểm tra tên trường chính xác từ Backend
            if (studentRes.data.length > 0) {
                console.log("🔥 Check isDebt field:", {
                    isDebt: studentRes.data[0].isDebt,
                    debt: studentRes.data[0].debt
                });
            }

        } catch (err) {
            console.error(err);
            alertService.error("Bạn không có quyền truy cập hoặc không chủ nhiệm lớp nào.");
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(s => {
        const name = s.fullName || "";
        const code = s.studentCode || "";
        const matchSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           code.includes(searchTerm);
        const matchStatus = filterStatus === "ALL" || s.academicStatus === filterStatus;
        return matchSearch && matchStatus;
    });

    // XỬ LÝ ISDEBT: Kiểm tra cả s.isDebt và s.debt (phòng trường hợp Jackson đổi tên)
    const stats = {
        total: students.length,
        warning: students.filter(s => s.gpa < 2.0).length,
        excellent: students.filter(s => s.gpa >= 3.2).length,
        debt: students.filter(s => s.isDebt === true || s.debt === true || s.isDebt === 1).length
    };

    if (authLoading || loading) return (
        <div className="flex flex-col h-screen items-center justify-center bg-white">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Đang xác thực quyền chủ nhiệm...</p>
        </div>
    );

    return (
        <div className="p-6 bg-slate-50 min-h-screen animate-in fade-in duration-500">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic">Lớp chủ nhiệm</h1>
                    <p className="text-slate-500 text-sm font-bold uppercase">
                        Lớp: <span className="text-blue-600">{classInfo?.className || "N/A"}</span> | Sĩ số: {stats.total}
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase shadow-sm hover:bg-slate-50 transition-all">
                    <Download size={16} /> Xuất báo cáo {classInfo?.className}
                </button>
            </div>

            {/* BẢNG THỐNG KÊ NHANH */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard icon={<Users className="text-blue-600" />} label="Tổng số SV" value={stats.total} color="bg-blue-50" />
                <StatCard icon={<UserCheck className="text-emerald-600" />} label="Học lực Giỏi" value={stats.excellent} color="bg-emerald-50" />
                <StatCard icon={<AlertTriangle className="text-orange-600" />} label="Cảnh báo GPA" value={stats.warning} color="bg-orange-50" />
                <StatCard icon={<UserX className="text-red-600" />} label="Nợ học phí" value={stats.debt} color="bg-red-50" />
            </div>

            {/* BỘ LỌC */}
            <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm tên hoặc MSSV..." 
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-slate-500" />
                    <select 
                        className="bg-slate-50 px-4 py-3 rounded-2xl text-[11px] font-black uppercase outline-none border-none cursor-pointer"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">Tất cả tình trạng</option>
                        <option value="NORMAL">Đang học</option>
                        <option value="WARNING">Cảnh báo</option>
                        <option value="DISMISSAL">Buộc thôi học</option>
                    </select>
                </div>
            </div>

            {/* DANH SÁCH SINH VIÊN */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <tr>
                            <th className="p-6">Sinh viên</th>
                            <th className="p-6">Liên lạc</th>
                            <th className="p-6 text-center">GPA</th>
                            <th className="p-6 text-center">Tình trạng</th>
                            <th className="p-6 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredStudents.length > 0 ? filteredStudents.map(student => (
                            <tr key={student.id} className="hover:bg-blue-50/30 transition-all group">
                                <td className="p-6">
                                    <div className="flex flex-col">
                                        <span className="font-black text-slate-800 uppercase text-sm tracking-tight group-hover:text-blue-600 transition-colors">{student.fullName}</span>
                                        <span className="text-[10px] text-slate-400 font-bold tracking-widest">{student.studentCode}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="text-[11px] text-slate-500 space-y-0.5">
                                        <p className="font-medium">{student.email}</p>
                                        <p className="font-black text-slate-400 italic">{student.phone}</p>
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <span className={`px-3 py-1.5 rounded-xl font-black text-xs ${student.gpa < 2.0 ? 'text-red-600 bg-red-50' : 'text-blue-700 bg-blue-50'}`}>
                                        {student.gpa?.toFixed(2) || "0.00"}
                                    </span>
                                </td>
                                <td className="p-6 text-center">
                                    {/* XỬ LÝ TẠI BADGE: Fallback giữa isDebt và debt */}
                                    <StatusBadge 
                                        status={student.academicStatus} 
                                        isDebt={student.isDebt === true || student.debt === true || student.isDebt === 1} 
                                    />
                                </td>
                                <td className="p-6 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-2.5 text-slate-400 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl transition-all shadow-sm">
                                            <FileText size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-20 text-center text-slate-300 font-bold uppercase italic tracking-widest">Không tìm thấy sinh viên phù hợp</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const StatCard = ({ icon, label, value, color }) => (
    <div className={`${color} p-6 rounded-[2.5rem] border-2 border-white shadow-sm flex items-center gap-5 transition-transform hover:scale-105`}>
        <div className="bg-white p-4 rounded-2xl shadow-sm">{icon}</div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{label}</p>
            <p className="text-3xl font-black text-slate-800 leading-none">{value}</p>
        </div>
    </div>
);

const StatusBadge = ({ status, isDebt }) => {
    if (isDebt) return <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1.5 rounded-lg shadow-sm shadow-red-100 uppercase tracking-tighter italic">Nợ học phí</span>;
    const colors = {
        NORMAL: "bg-emerald-100 text-emerald-700",
        WARNING: "bg-orange-100 text-orange-700",
        DISMISSAL: "bg-slate-900 text-white"
    };
    const labels = {
        NORMAL: "Đang học",
        WARNING: "Cảnh báo",
        DISMISSAL: "Thôi học"
    };
    return <span className={`${colors[status]} text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-tight`}>{labels[status] || status}</span>;
};