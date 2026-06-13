import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { alertService } from "../../utils/swalUtils";
import { Plus, Edit, Trash2, Save, X, Users, BookOpen } from 'lucide-react';

const api = axios.create({ baseURL: "http://localhost:8080/api/classrooms" });

export default function AdminClassRoom() {
    const [classrooms, setClassrooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ id: null, className: "", courseYear: new Date().getFullYear() });

    useEffect(() => { fetchClassRooms(); }, []);

    const fetchClassRooms = async () => {
        try {
            const res = await api.get('/all');
            setClassrooms(res.data);
        } catch (err) { alertService.error("Lỗi tải danh sách lớp học!"); }
    };

    const handleOpenModal = (room = null) => {
        if (room) {
            setFormData(room);
            setIsEditing(true);
        } else {
            setFormData({ id: null, className: "", courseYear: new Date().getFullYear() });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/${formData.id}`, formData);
                alertService.success("Cập nhật lớp thành công!");
            } else {
                await api.post('/add', formData);
                alertService.success("Thêm lớp mới thành công!");
            }
            setIsModalOpen(false);
            fetchClassRooms();
        } catch (err) { alertService.error("Lỗi xử lý dữ liệu!"); }
    };

    const handleDelete = async (id) => {
        const confirm = await alertService.confirmDelete("Xóa lớp này?");
        if (confirm.isConfirmed) {
            try {
                await api.delete(`/${id}`);
                alertService.success("Đã xóa lớp!");
                fetchClassRooms();
            } catch (err) { alertService.error("Không thể xóa lớp đang có sinh viên!"); }
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-[1000] text-slate-800 uppercase italic">Quản lý Lớp hành chính</h1>
                    <p className="text-slate-500 text-sm font-medium italic underline decoration-blue-500 decoration-2">Classroom Management</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2 uppercase text-[10px] tracking-widest">
                    <Plus size={18} /> Thêm lớp mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {classrooms.map(room => (
                    <div key={room.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <Users size={24} />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => handleOpenModal(room)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16}/></button>
                                <button onClick={() => handleDelete(room.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                            </div>
                        </div>
                        <h2 className="text-xl font-black text-slate-800 uppercase italic">{room.className}</h2>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Khóa: {room.courseYear}</span>
                            <span className="text-[10px] font-black px-3 py-1 bg-slate-100 rounded-full text-slate-600 uppercase italic">Active</span>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl p-10 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-800">Thông tin lớp học</h2>
                            <button onClick={() => setIsModalOpen(false)}><X/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Tên lớp (Ví dụ: CNTT K20)</label>
                                <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold outline-none focus:border-blue-600" 
                                    value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Khóa (Năm nhập học)</label>
                                <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold outline-none focus:border-blue-600" 
                                    value={formData.courseYear} onChange={e => setFormData({...formData, courseYear: e.target.value})} required />
                            </div>
                            <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-slate-900 transition-all active:scale-95">
                                <Save size={18} className="inline mr-2" /> {isEditing ? "Lưu thay đổi" : "Tạo lớp học"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}