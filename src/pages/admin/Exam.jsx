import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { alertService } from "../../utils/swalUtils";
import { Plus, Edit, Trash2, Calendar, Clock, MapPin, Save, X, Timer, GraduationCap } from 'lucide-react';

const api = axios.create({ baseURL: "http://localhost:8080/api" });

export default function AdminExamPage() {
    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [academicTerms, setAcademicTerms] = useState([]); // 1. State lưu danh sách học kỳ
    const [isModalOpen, setIsModalOpen] = useState(false);

    const initialFormState = {
        id: null,
        examDate: "",
        startTime: "",
        shift: "CA 1",
        examType: "CUỐI KỲ",
        duration: 90,
        courseId: "",
        roomId: "",
        teacherId: "",
        termId: "" // 2. Thêm field vào form state
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // 3. Fetch thêm dữ liệu AcademicTerm
            const [exRes, coRes, roRes, teRes, termRes] = await Promise.all([
                api.get('/exams/all'),
                api.get('/courses'),
                api.get('/rooms/all'),
                api.get('/teachers/all'),
                api.get('/academic-terms') // Giả sử endpoint là /terms/all
            ]);
            setExams(exRes.data);
            setCourses(coRes.data);
            setRooms(roRes.data);
            setTeachers(teRes.data);
            setAcademicTerms(termRes.data);
        } catch (err) {
            alertService.error("Không thể kết nối đến máy chủ Backend.");
        }
    };

    const handleEdit = (ex) => {
        setFormData({
            id: ex.id,
            examDate: ex.examDate,
            startTime: ex.startTime,
            shift: ex.shift || "CA 1",
            examType: ex.examType || "CUỐI KỲ",
            duration: ex.duration || 90,
            courseId: ex.course?.id || "",
            roomId: ex.room?.id || "",
            teacherId: ex.teacher?.id || "",
            termId: ex.academicTerm?.id || "" // Load termId khi sửa
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 4. Đóng gói payload khớp với Entity Java
        const payload = {
            id: formData.id,
            examDate: formData.examDate,
            startTime: formData.startTime,
            shift: formData.shift,
            examType: formData.examType,
            duration: parseInt(formData.duration) || 90,
            course: { id: parseInt(formData.courseId) },
            room: { id: parseInt(formData.roomId) },
            teacher: { id: parseInt(formData.teacherId) },
            academicTerm: { id: parseInt(formData.termId) } // Gửi object chứa id
        };

        try {
            if (formData.id) {
                await api.put(`/exams/${formData.id}`, payload);
            } else {
                await api.post('/exams/add', payload);
            }
            alertService.success("Lưu lịch thi thành công!");
            setIsModalOpen(false);
            setFormData(initialFormState);
            fetchData();
        } catch (err) {
            alertService.error(err.response?.data || "Lỗi: Kiểm tra định dạng dữ liệu hoặc trùng lịch thi!");
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            {/* Header section... */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-[1000] text-slate-800 uppercase italic">Lịch thi học phần</h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1 italic">Examination Control</p>
                </div>
                <button onClick={() => { setFormData(initialFormState); setIsModalOpen(true); }}
                    className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-slate-900 transition-all flex items-center gap-2 text-[10px] tracking-widest uppercase active:scale-95">
                    <Plus size={18} /> Thiết lập lịch mới
                </button>
            </div>

            {/* List Exams... */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map(ex => (
                    <div key={ex.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[9px] font-black uppercase">
                                {ex.examType} - {ex.academicTerm?.termName}
                            </span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => handleEdit(ex)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                                <button onClick={() => handleDelete(ex.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <h2 className="text-lg font-black text-slate-800 uppercase italic leading-tight mb-4">{ex.course?.subject?.subjectName}</h2>
                        {/* Detail lines... */}
                        <div className="space-y-3 border-t pt-4 border-dashed border-slate-200 text-xs font-bold text-slate-600">
                             <div className="flex items-center gap-3 uppercase">
                                <Calendar size={14} className="text-rose-500" /> 
                                <span>{ex.examDate}</span>
                                <span className="text-slate-300">|</span>
                                <span className="text-indigo-600 italic font-black">{ex.shift}</span>
                            </div>
                            <div className="flex items-center gap-3"><Clock size={14} className="text-rose-500" /> <span>Bắt đầu: {ex.startTime}</span></div>
                            <div className="flex items-center gap-3"><MapPin size={14} className="text-rose-500" /> <span>Phòng: {ex.room?.roomName}</span></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl p-10 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-8 border-b pb-6">
                            <h2 className="text-xl font-black uppercase italic text-slate-800">
                                {formData.id ? "Cập nhật lịch thi" : "Sắp xếp lịch mới"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-600"><X size={24} /></button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                            {/* Academic Term Selection - MỚI */}
                            <div className="col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Học kỳ (Academic Term)</label>
                                <select className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold"
                                    value={formData.termId} onChange={e => setFormData({ ...formData, termId: e.target.value })} required>
                                    <option value="">-- Chọn học kỳ áp dụng --</option>
                                    {academicTerms.map(t => <option key={t.id} value={t.id}>{t.termName} ({t.startDate} - {t.endDate})</option>)}
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Lớp học phần (Course)</label>
                                <select className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold"
                                    value={formData.courseId} onChange={e => setFormData({ ...formData, courseId: e.target.value })} required>
                                    <option value="">-- Chọn lớp học phần --</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.subject?.subjectName} ({c.sectionCode})</option>)}
                                </select>
                            </div>
                            
                            {/* Các input khác: Ngày thi, Ca thi, Giờ, Thời lượng, Phòng, Giảng viên giữ nguyên như code cũ... */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Ngày thi</label>
                                <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold" 
                                    value={formData.examDate} onChange={e => setFormData({ ...formData, examDate: e.target.value })} required />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Ca thi</label>
                                    <select className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold" 
                                        value={formData.shift} onChange={e => setFormData({ ...formData, shift: e.target.value })}>
                                        <option value="CA 1">CA 1</option>
                                        <option value="CA 2">CA 2</option>
                                        <option value="CA 3">CA 3</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Giờ bắt đầu</label>
                                    <input type="time" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold" 
                                        value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} required />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Phòng thi</label>
                                <select className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold"
                                    value={formData.roomId} onChange={e => setFormData({ ...formData, roomId: e.target.value })} required>
                                    <option value="">-- Chọn phòng --</option>
                                    {rooms.map(r => <option key={r.id} value={r.id}>{r.roomName}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Giảng viên</label>
                                <select className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold" 
                                    value={formData.teacherId} onChange={e => setFormData({ ...formData, teacherId: e.target.value })} required>
                                    <option value="">-- Chọn giảng viên --</option>
                                    {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                                </select>
                            </div>

                            <button type="submit" className="col-span-2 py-5 bg-rose-600 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl hover:bg-slate-900 transition-all mt-4 flex items-center justify-center gap-2">
                                <Save size={18} /> {formData.id ? "Xác nhận cập nhật" : "Phát hành lịch mới"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}