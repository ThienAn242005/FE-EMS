import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { alertService } from "../../utils/swalUtils";
import { Plus, Edit, Trash2, Save, X, Calendar, Clock } from 'lucide-react';

const api = axios.create({ baseURL: "http://localhost:8080/api/semesters" });

export default function AdminSemester() {
    const [semesters, setSemesters] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ 
        id: null, name: "", academicYear: "", startDate: "", endDate: "" 
    });

    useEffect(() => { fetchSemesters(); }, []);

    const fetchSemesters = async () => {
        try {
            const res = await api.get('/all');
            setSemesters(res.data);
        } catch (err) { alertService.error("Lỗi tải danh sách học kỳ!"); }
    };

    const handleOpenModal = (sem = null) => {
        if (sem) {
            setFormData(sem);
            setIsEditing(true);
        } else {
            const currentYear = new Date().getFullYear();
            setFormData({ 
                id: null, 
                name: "Học kỳ 1", 
                academicYear: `${currentYear}-${currentYear + 1}`, 
                startDate: "", 
                endDate: "" 
            });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/${formData.id}`, formData);
                alertService.success("Cập nhật học kỳ thành công!");
            } else {
                await api.post('/add', formData);
                alertService.success("Thêm học kỳ mới thành open!");
            }
            setIsModalOpen(false);
            fetchSemesters();
        } catch (err) { alertService.error("Lỗi xử lý dữ liệu!"); }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-[1000] text-slate-800 uppercase italic">Quản lý Học kỳ</h1>
                    <p className="text-slate-500 text-sm font-medium italic underline decoration-blue-500 decoration-2">Academic Semesters</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2 uppercase text-[10px] tracking-widest">
                    <Plus size={18} /> Thêm học kỳ mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {semesters.map(sem => (
                    <div key={sem.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <Calendar size={24} />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => handleOpenModal(sem)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16}/></button>
                                <button onClick={() => {}} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                            </div>
                        </div>
                        <h2 className="text-lg font-black text-slate-800 uppercase leading-tight italic">{sem.name}</h2>
                        <p className="text-xs font-bold text-blue-600 mt-1 uppercase tracking-widest">Năm học: {sem.academicYear}</p>
                        
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                <Clock size={12} /> BẮT ĐẦU: {sem.startDate}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                <Clock size={12} /> KẾT THÚC: {sem.endDate}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl p-10 animate-in zoom-in-95">
                        <h2 className="text-xl font-black mb-8 uppercase italic text-slate-800">Cấu hình học kỳ</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block italic">Tên kỳ (Ví dụ: Học kỳ 1)</label>
                                <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" 
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block italic">Năm học (Ví dụ: 2025-2026)</label>
                                <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" 
                                    value={formData.academicYear} onChange={e => setFormData({...formData, academicYear: e.target.value})} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block italic">Ngày bắt đầu</label>
                                    <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" 
                                        value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block italic">Ngày kết thúc</label>
                                    <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" 
                                        value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-all mt-4">
                                <Save size={18} className="inline mr-2" /> Lưu học kỳ
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}