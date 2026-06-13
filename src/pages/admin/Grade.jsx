import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    Search, Plus, Edit2, Trash2, X, 
    Calculator, User, Loader2 
} from 'lucide-react';
import { alertService } from "../../utils/swalUtils";

const API_BASE = "http://localhost:8080/api";

export default function AdminGradeManager() {
    const [studentCode, setStudentCode] = useState("");
    const [studentInfo, setStudentInfo] = useState(null);
    const [grades, setGrades] = useState([]); 
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGrade, setEditingGrade] = useState(null);
    const [courses, setCourses] = useState([]);

    const fetchCourses = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE}/courses`);
            if (Array.isArray(res.data)) setCourses(res.data);
        } catch (err) { console.error("Lỗi tải lớp học"); }
    }, []);

    useEffect(() => { fetchCourses(); }, [fetchCourses]);

    const fetchStudentGrades = async () => {
        if (!studentCode.trim()) return alertService.error("Vui lòng nhập mã sinh viên");
        setLoading(true);
        try {
            const [profileRes, gradesRes, summaryRes] = await Promise.all([
                axios.get(`${API_BASE}/students/code/${studentCode}`),
                axios.get(`${API_BASE}/grades/student/code/${studentCode}`),
                axios.get(`${API_BASE}/grades/student/code/${studentCode}/summary`)
            ]);
            
            setStudentInfo(profileRes.data);
            setSummary(summaryRes.data);

            // ĐỒNG BỘ LOGIC: Backend trả về SemesterGradeDTO chứa subjects
            // Chúng ta giữ nguyên cấu trúc phân theo kỳ để Admin dễ quản lý
            setGrades(Array.isArray(gradesRes.data) ? gradesRes.data : []);
            
        } catch (err) {
            alertService.error("Không tìm thấy dữ liệu sinh viên");
            setStudentInfo(null);
            setGrades([]);
        } finally { setLoading(false); }
    };

    // Chặn môn đã có điểm (Logic an toàn)
    const availableCourses = (courses || []).filter(course => {
        if (editingGrade) return true; 
        return !grades.some(semester => 
            (semester.subjects || []).some(s => s.name === course.subject?.subjectName)
        );
    });

    const handleSaveGrade = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const gradeData = {
            student: { studentCode: studentCode },
            course: { id: parseInt(formData.get("courseId")) },
            assignment: parseFloat(formData.get("assignment")), 
            midTerm: parseFloat(formData.get("midTerm")),       
            finalTerm: parseFloat(formData.get("finalTerm")),   
        };

        try {
            if (editingGrade) {
                await axios.put(`${API_BASE}/grades/${editingGrade.id}`, gradeData);
            } else {
                await axios.post(`${API_BASE}/grades`, gradeData);
            }
            alertService.success("Lưu điểm thành công!");
            setIsModalOpen(false);
            setEditingGrade(null);
            fetchStudentGrades();
        } catch (err) {
            alertService.error(err.response?.data || "Lớp học này đã có điểm!");
        }
    };

    const handleDelete = async (id) => {
        if (await alertService.confirm("Xóa điểm?", "GPA sẽ tính lại ngay.")) {
            try {
                await axios.delete(`${API_BASE}/grades/${id}`);
                fetchStudentGrades();
            } catch (err) { alertService.error("Lỗi xóa"); }
        }
    };

    return (
        <div className="p-6 bg-[#f8fafc] min-h-screen font-sans">
            {/* THANH TÌM KIẾM */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 mb-8 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text"
                        placeholder="Nhập mã sinh viên..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-indigo-500 font-bold text-slate-700"
                        value={studentCode}
                        onChange={(e) => setStudentCode(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchStudentGrades()}
                    />
                </div>
                <button onClick={fetchStudentGrades} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                    {loading ? <Loader2 className="animate-spin" /> : "Truy xuất"}
                </button>
            </div>

            {studentInfo && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* THÔNG TIN TÓM TẮT */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
                            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-indigo-600"><User size={40}/></div>
                            <h2 className="font-black text-slate-800 uppercase italic leading-tight">{studentInfo.fullName}</h2>
                            <p className="text-slate-400 text-[10px] font-black uppercase mt-1 tracking-widest">{studentInfo.studentCode}</p>
                            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                                <div><p className="text-[9px] font-black text-slate-400 uppercase">Hệ 4</p><p className="text-2xl font-black text-indigo-600">{summary?.gpaCumulative || "0.00"}</p></div>
                                <div><p className="text-[9px] font-black text-slate-400 uppercase">Tích lũy</p><p className="text-2xl font-black text-slate-700">{summary?.accumulatedCredits || 0}</p></div>
                            </div>
                        </div>
                        <button onClick={() => { setEditingGrade(null); setIsModalOpen(true); }} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
                            <Plus size={18} /> Nhập điểm mới
                        </button>
                    </div>

                    {/* BẢNG ĐIỂM CHI TIẾT THEO KỲ */}
                    <div className="lg:col-span-3 space-y-6">
                        {grades.length === 0 && <div className="p-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold uppercase text-xs tracking-widest">Chưa có dữ liệu điểm</div>}
                        {grades.map((semester) => (
                            <div key={semester.semesterName} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                                <div className="p-6 bg-slate-900 text-white flex justify-between items-center font-black uppercase italic tracking-tight">
                                    <span>{semester.semesterName}</span>
                                    {/* Giả định DTO có trường tính sẵn GPA kỳ */}
                                    <span className="text-[10px] bg-indigo-600 px-4 py-1 rounded-full not-italic">Kỳ học này</span>
                                </div>
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase border-b text-center">
                                            <th className="px-8 py-4 text-left">Môn học</th>
                                            <th>Tín chỉ</th><th>Tổng kết</th><th className="px-8 text-right">Lệnh</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {/* ĐỒNG BỘ: Dùng .subjects như StudentPerformance.jsx */}
                                        {(semester.subjects || []).map((s, idx) => (
                                            <tr key={idx} className="group hover:bg-slate-50/50 transition-all text-center">
                                                <td className="px-8 py-5 text-left font-bold text-slate-700 text-sm">{s.name}</td>
                                                <td className="font-bold text-slate-600">{s.credit}</td>
                                                <td>
                                                    <span className={`px-3 py-1 rounded-lg font-black text-xs ${s.grade >= 4 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                        {s.grade?.toFixed(1)}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                        {/* Lưu ý: edit/delete ở đây cần ID gốc, nếu DTO rút gọn không có ID thì cần bổ sung vào Backend */}
                                                        <button onClick={() => {setEditingGrade(s); setIsModalOpen(true);}} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl"><Edit2 size={16}/></button>
                                                        <button onClick={() => handleDelete(s.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl"><Trash2 size={16}/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MODAL NHẬP ĐIỂM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl animate-in zoom-in-95">
                        <div className="p-8 bg-slate-900 text-white flex justify-between items-center rounded-t-[3rem]">
                            <h2 className="text-xl font-black uppercase italic tracking-tight">{editingGrade ? "Sửa điểm" : "Nhập điểm mới"}</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={24}/></button>
                        </div>
                        <form onSubmit={handleSaveGrade} className="p-8 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Lớp học phần</label>
                                <select name="courseId" required disabled={!!editingGrade} defaultValue={editingGrade?.courseId || ""} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold text-slate-700 outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-500">
                                    <option value="">-- Chọn lớp học --</option>
                                    {availableCourses.map(c => <option key={c.id} value={c.id}>{c.subject?.subjectName} ({c.sectionCode})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div><label className="block text-[10px] text-center font-black text-slate-400 uppercase mb-2">CC</label>
                                <input type="number" step="0.1" name="assignment" defaultValue={editingGrade?.assignment || 0} required className="w-full p-4 bg-slate-50 rounded-2xl text-center font-bold focus:ring-2 ring-indigo-500" /></div>
                                <div><label className="block text-[10px] text-center font-black text-slate-400 uppercase mb-2">GK</label>
                                <input type="number" step="0.1" name="midTerm" defaultValue={editingGrade?.midTerm || 0} required className="w-full p-4 bg-slate-50 rounded-2xl text-center font-bold focus:ring-2 ring-indigo-500" /></div>
                                <div><label className="block text-[10px] text-center font-black text-slate-400 uppercase mb-2">CK</label>
                                <input type="number" step="0.1" name="finalTerm" defaultValue={editingGrade?.finalTerm || 0} required className="w-full p-4 bg-slate-50 rounded-2xl text-center font-bold focus:ring-2 ring-indigo-500" /></div>
                            </div>
                            <button type="submit" disabled={!editingGrade && availableCourses.length === 0} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-slate-900 transition-all disabled:bg-slate-300">Xác nhận lưu</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}