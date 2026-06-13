import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { alertService } from "../../utils/swalUtils";
import { UserPlus, Edit, Trash2, Save, X, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

const api = axios.create({ baseURL: "http://localhost:8080/api/users" });

export default function AdminUserPage() {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ 
        id: null, username: "", password: "", fullName: "", email: "", phone: "", role: "student", address: "", enabled: true 
    });

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/all');
            setUsers(res.data);
        } catch (err) { alertService.error("Lỗi tải danh sách người dùng!"); }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setFormData({ ...user, password: "" }); // Không hiện pass cũ vì lý do bảo mật
            setIsEditing(true);
        } else {
            setFormData({ id: null, username: "", password: "", fullName: "", email: "", phone: "", role: "student", address: "", enabled: true });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/${formData.id}`, formData);
                alertService.success("Cập nhật User thành công!");
            } else {
                await api.post('/add', formData);
                alertService.success("Thêm User mới thành công!");
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (err) { alertService.error("Lỗi: Username hoặc Email đã tồn tại!"); }
    };

    const handleDelete = async (id) => {
        const confirm = await alertService.confirmDelete("Xóa người dùng này?", "Mọi dữ liệu liên quan đến Student/Teacher sẽ bị ảnh hưởng!");
        if (confirm.isConfirmed) {
            try {
                await api.delete(`/${id}`);
                alertService.success("Đã xóa User!");
                fetchUsers();
            } catch (err) { alertService.error("Lỗi khi xóa!"); }
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-[1000] text-slate-800 uppercase italic">Quản lý Tài khoản</h1>
                    <p className="text-slate-500 text-sm font-medium italic underline decoration-rose-500 decoration-2">User Access Control</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black shadow-xl hover:bg-rose-600 transition-all flex items-center gap-2 uppercase text-[10px] tracking-widest">
                    <UserPlus size={18} /> Tạo tài khoản mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(u => (
                    <div key={u.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${u.role === 'admin' ? 'bg-rose-500' : 'bg-blue-500'}`}></div>
                        
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400">
                                    {u.fullName.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="font-black text-slate-800 uppercase text-sm leading-tight">{u.fullName}</h2>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${u.enabled ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {u.enabled ? '● Hoạt động' : '● Đã khóa'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => handleOpenModal(u)} className="p-2 text-slate-400 hover:text-blue-600"><Edit size={16}/></button>
                                <button onClick={() => handleDelete(u.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><Mail size={12}/> {u.email}</div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><ShieldCheck size={12}/> Quyền: <span className="uppercase text-blue-600">{u.role}</span></div>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-400 italic">
                            <span>User: {u.username}</span>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl p-10 animate-in zoom-in-95 overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl font-black mb-8 uppercase italic tracking-tighter text-slate-800">{isEditing ? "Cập nhật tài khoản" : "Tạo tài khoản mới"}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Username</label>
                                <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold outline-none focus:border-rose-500" 
                                    value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required disabled={isEditing}/>
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Mật khẩu {isEditing && "(để trống nếu không đổi)"}</label>
                                <input type="password" title="Password" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold outline-none focus:border-rose-500" 
                                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!isEditing} />
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Họ và tên</label>
                                <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold outline-none focus:border-rose-500" 
                                    value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Email</label>
                                <input type="email" title="Email" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold outline-none focus:border-rose-500" 
                                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Quyền hạn (Role)</label>
                                <select className="w-full p-4 bg-slate-50 rounded-2xl border font-bold outline-none appearance-none" 
                                    value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="col-span-2 flex items-center gap-3 ml-2">
                                <input type="checkbox" className="w-5 h-5" checked={formData.enabled} 
                                    onChange={e => setFormData({...formData, enabled: e.target.checked})} />
                                <label className="text-[10px] font-black text-slate-700 uppercase italic">Kích hoạt tài khoản</label>
                            </div>
                            <button type="submit" className="col-span-2 py-5 bg-rose-600 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-all active:scale-95 mt-4">
                                <Save size={18} className="inline mr-2" /> Lưu thông tin User
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}