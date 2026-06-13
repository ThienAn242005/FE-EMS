import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../Service/api";
import { alertService } from "../../utils/swalUtils";
import { CheckCircle, XCircle, Clock, Save, ArrowLeft, Loader2, Users } from 'lucide-react';

export default function AttendancePage() {
    const { scheduleId } = useParams(); 
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            if (!scheduleId || scheduleId === "undefined") return;
            try {
                setLoading(true);
                const { data } = await api.get(`/teacher/attendance/schedule/${scheduleId}`);
                const enrichedData = data.map(s => ({
                    studentId: s.id,
                    studentCode: s.studentCode,
                    fullName: s.fullName,
                    status: s.attendanceStatus || 'PRESENT', 
                    note: s.attendanceNote || ''
                }));
                setStudents(enrichedData);
            } catch (err) {
                alertService.error("Không thể tải danh sách sinh viên.");
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [scheduleId]);

    // CHỨC NĂNG ĐIỂM DANH NHANH
    const quickAttendance = (status) => {
        setStudents(prev => prev.map(s => ({ ...s, status: status })));
        alertService.success(`Đã chuyển tất cả thành: ${status === 'PRESENT' ? 'Có mặt' : status === 'ABSENT' ? 'Vắng' : 'Trễ'}`);
    };

    const updateStatus = (studentId, newStatus) => {
        setStudents(prev => prev.map(s => 
            s.studentId === studentId ? { ...s, status: newStatus } : s
        ));
    };

    const handleSave = async () => {
        const result = await alertService.confirmDelete(
            "Xác nhận lưu điểm danh?", 
            `Dữ liệu chuyên cần của ${students.length} sinh viên sẽ được cập nhật.`
        );

        if (result.isConfirmed) {
            try {
                alertService.success("Đang xử lý...");
                const attendanceRequests = students.map(s => ({
                    scheduleId: parseInt(scheduleId),
                    studentId: s.studentId,
                    status: s.status,
                    note: s.note
                }));
                await api.post('/teacher/attendance/save', attendanceRequests);
                alertService.successModal("HOÀN TẤT!", "Dữ liệu đã được lưu thành công.");
                navigate('/teacher/schedule');
            } catch (err) {
                alertService.error("Lỗi hệ thống! Không thể lưu.");
            }
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center flex-col gap-3">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-slate-500 font-medium italic italic">Đang tải danh sách...</p>
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-white p-6">
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors">
                    <ArrowLeft size={20} /> Quay lại lịch dạy
                </button>
                
                <div className="flex items-center gap-4">
                    <button onClick={handleSave} className="bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-800 font-bold shadow-lg shadow-blue-100 transition-all active:scale-95">
                        <Save size={20} /> Lưu điểm danh
                    </button>
                </div>
            </div>

            {/* THANH ĐIỂM DANH NHANH */}
            <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-sm uppercase">
                    <Users size={20} className="text-blue-600" />
                    Thao tác nhanh cho cả lớp:
                </div>
                <div className="flex gap-3">
                    <button onClick={() => quickAttendance('PRESENT')} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black hover:bg-emerald-200 transition-all border border-emerald-200">
                        TẤT CẢ CÓ MẶT
                    </button>
                    <button onClick={() => quickAttendance('ABSENT')} className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-xs font-black hover:bg-red-200 transition-all border border-red-200">
                        TẤT CẢ VẮNG
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 font-bold text-slate-600 text-sm uppercase w-32 uppercase w-32">MSSV</th>
                            <th className="p-4 font-bold text-slate-600 text-sm uppercase uppercase">Họ và Tên</th>
                            <th className="p-4 font-bold text-slate-600 text-sm uppercase text-center w-80 uppercase text-center w-80">Trạng thái</th>
                            <th className="p-4 font-bold text-slate-600 text-sm uppercase uppercase">Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.studentId} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors transition-colors">
                                <td className="p-4 font-bold text-blue-700">{student.studentCode}</td>
                                <td className="p-4 font-black text-slate-800 uppercase text-xs uppercase text-xs">{student.fullName}</td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-2">
                                        <StatusButton active={student.status === 'PRESENT'} onClick={() => updateStatus(student.studentId, 'PRESENT')} color="bg-slate-100 text-slate-400 border-slate-200" activeColor="bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-100" icon={<CheckCircle size={14} />} label="Có mặt" />
                                        <StatusButton active={student.status === 'ABSENT'} onClick={() => updateStatus(student.studentId, 'ABSENT')} color="bg-slate-100 text-slate-400 border-slate-200" activeColor="bg-red-500 text-white border-red-500 shadow-md shadow-red-100" icon={<XCircle size={14} />} label="Vắng mặt" />
                                        <StatusButton active={student.status === 'LATE'} onClick={() => updateStatus(student.studentId, 'LATE')} color="bg-slate-100 text-slate-400 border-slate-200" activeColor="bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-100" icon={<Clock size={14} />} label="Đi trễ" />
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <input type="text" placeholder="Ghi chú..." className="border border-slate-200 rounded-lg px-3 py-2 text-[12px] w-full outline-none focus:ring-2 ring-blue-500/10 focus:border-blue-500 transition-all bg-slate-50/30 transition-all bg-slate-50/30" value={student.note} onChange={(e) => {
                                        const newNote = e.target.value;
                                        setStudents(prev => prev.map(s => s.studentId === student.studentId ? {...s, note: newNote} : s));
                                    }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const StatusButton = ({ active, onClick, color, activeColor, icon, label }) => (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[11px] font-black transition-all duration-300 transition-all duration-300 ${active ? activeColor : `${color} hover:bg-slate-200 hover:text-slate-600`}`}>
        {icon} {label}
    </button>
);