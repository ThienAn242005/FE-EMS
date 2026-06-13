import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { alertService } from "../../utils/swalUtils";
import { Plus, Save, Edit, Trash2 } from 'lucide-react';

const api = axios.create({ baseURL: "http://localhost:8080/api" });

export default function AdminCoursePage() {
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({ 
        id: null, sectionCode: "", maxCapacity: 45, startDate: "", endDate: "",
        subjectId: "", semesterId: "", teacherId: ""
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [courseRes, subRes, semRes, teaRes] = await Promise.all([
                api.get('/courses'), api.get('/subjects/all'),
                api.get('/semesters/all'), api.get('/teachers/all')
            ]);
            
            setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);
            setSubjects(Array.isArray(subRes.data) ? subRes.data : []);
            setSemesters(Array.isArray(semRes.data) ? semRes.data : []);
            setTeachers(Array.isArray(teaRes.data) ? teaRes.data : []);
        } catch (err) { 
            console.error(err);
            setCourses([]);
        }
    };

    const handleEdit = (course) => {
        setFormData({
            id: course.id,
            sectionCode: course.sectionCode,
            maxCapacity: course.maxCapacity,
            startDate: course.startDate,
            endDate: course.endDate,
            subjectId: course.subject?.id || "",
            semesterId: course.semester?.id || "",
            teacherId: course.teacher?.id || ""
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const confirm = await alertService.confirmDelete("Xóa lớp học phần này?", "Dữ liệu đăng ký sinh viên liên quan sẽ bị ảnh hưởng!");
        if (confirm.isConfirmed) {
            try {
                await api.delete(`/courses/${id}`);
                alertService.success("Đã xóa lớp học thành công!");
                fetchData();
            } catch (err) { alertService.error("Không thể xóa lớp đang có sinh viên đăng ký!"); }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                sectionCode: formData.sectionCode,
                maxCapacity: parseInt(formData.maxCapacity),
                startDate: formData.startDate,
                endDate: formData.endDate,
                subject: { id: parseInt(formData.subjectId) },
                semester: { id: parseInt(formData.semesterId) },
                teacher: formData.teacherId ? { id: parseInt(formData.teacherId) } : null
            };

            if (isEditing) {
                await api.put(`/courses/${formData.id}`, payload);
                alertService.success("Cập nhật lớp học thành công!");
            } else {
                await api.post('/courses', payload);
                alertService.success("Mở lớp học phần mới thành công!");
            }
            setIsModalOpen(false);
            resetForm();
            fetchData();
        } catch (err) { alertService.error("Lỗi xử lý dữ liệu!"); }
    };

    const resetForm = () => {
        setFormData({ id: null, sectionCode: "", maxCapacity: 45, startDate: "", endDate: "", subjectId: "", semesterId: "", teacherId: "" });
        setIsEditing(false);
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-[1000] text-slate-800 uppercase italic">Quản lý Lớp học phần</h1>
                <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black shadow-xl hover:bg-indigo-600 transition-all flex items-center gap-2 text-[10px] tracking-widest">
                    <Plus size={18} /> Mở lớp mới
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="p-5">Mã lớp</th>
                            <th className="p-5">Môn học / GV</th>
                            <th className="p-5">Học kỳ</th>
                            <th className="p-5 text-center">Sĩ số</th>
                            <th className="p-5 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {courses.length > 0 ? courses.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-5 font-black text-indigo-600 italic uppercase">{c.sectionCode}</td>
                                <td className="p-5">
                                    <div className="font-bold text-slate-800 uppercase text-xs">{c.subject?.subjectName}</div>
                                    <div className="text-[10px] text-slate-400 font-bold italic">GV: {c.teacher?.fullName || "Chưa gán"}</div>
                                </td>
                                <td className="p-5 text-[10px] font-black text-slate-500">{c.semester?.name}</td>
                                <td className="p-5 font-black text-slate-600 text-xs text-center">{c.currentEnrolled || 0} / {c.maxCapacity}</td>
                                <td className="p-5">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => handleEdit(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16}/></button>
                                        <button onClick={() => handleDelete(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-10 text-center text-slate-400 text-xs font-bold italic">Không có dữ liệu lớp học</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl p-10">
                        <h2 className="text-xl font-black mb-8 uppercase italic text-slate-800">{isEditing ? "Cập nhật lớp học" : "Mở lớp mới"}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Mã lớp</label>
                                <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" value={formData.sectionCode} onChange={e => setFormData({...formData, sectionCode: e.target.value})} required />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Sĩ số tối đa</label>
                                <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" value={formData.maxCapacity} onChange={e => setFormData({...formData, maxCapacity: e.target.value})} required />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Môn học</label>
                                <select className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})} required>
                                    <option value="">-- Chọn Subject --</option>
                                    {subjects.map(s => <option key={s.id} value={s.id}>{s.subjectName}</option>)}
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Giảng viên</label>
                                <select className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" value={formData.teacherId} onChange={e => setFormData({...formData, teacherId: e.target.value})} required>
                                    <option value="">-- Chọn Teacher --</option>
                                    {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Học kỳ</label>
                                <select className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" value={formData.semesterId} onChange={e => setFormData({...formData, semesterId: e.target.value})} required>
                                    <option value="">-- Chọn Semester --</option>
                                    {semesters.map(sem => <option key={sem.id} value={sem.id}>{sem.name}</option>)}
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Ngày bắt đầu</label>
                                <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Ngày kết thúc</label>
                                <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
                            </div>
                            <div className="col-span-2 flex gap-3 mt-4">
                                <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-slate-900 transition-all">
                                    <Save size={18} className="inline mr-2" /> {isEditing ? "Lưu thay đổi" : "Khởi tạo lớp"}
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">
                                    Đóng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}