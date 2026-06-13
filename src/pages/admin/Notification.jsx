import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { alertService } from "../../utils/swalUtils";
import { 
    Bell, Plus, Trash2, Mail, 
    BookOpen, CreditCard, Settings, X, Send, User, Globe, Loader2
} from 'lucide-react';

// Cấu hình Axios Instance
const api = axios.create({
    baseURL: "http://localhost:8080"
});

const NOTI_TYPES = [
    { value: 'ACADEMIC', label: 'Học tập', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { value: 'TUITION', label: 'Học phí', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' },
    { value: 'SYSTEM', label: 'Hệ thống', icon: Settings, color: 'text-rose-600', bg: 'bg-rose-50' }
];

export default function AdminNotificationPage() {
    const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Form data: mặc định isGlobal là true
    const [formData, setFormData] = useState({ 
        title: "", 
        description: "", 
        type: "ACADEMIC", 
        studentId: "", 
        isGlobal: true 
    });

    useEffect(() => { fetchNotifications(); }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            // SỬA: Gọi endpoint /notifications để lấy toàn bộ danh sách cho Admin
            const { data } = await api.get('/notifications'); 
            
            // Sắp xếp: Mới nhất (ID lớn nhất) lên đầu
            const sorted = [...data].sort((a, b) => b.id - a.id);
            setNotifications(sorted);
        } catch (err) { 
            console.error(err);
            alertService.error("Không thể tải danh sách thông báo"); 
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                type: formData.type,
                isGlobal: formData.isGlobal,
                // Nếu Global thì student là null, ngược lại gửi object chứa ID
                student: formData.isGlobal ? null : { id: parseInt(formData.studentId) }
            };

            const res = await api.post('/notifications', payload);
            alertService.success("Thông báo đã được phát hành!");
            
            // Cập nhật State: Đưa tin mới vào đầu danh sách
            setNotifications(prev => [res.data, ...prev]);
            
            setIsModalOpen(false);
            setFormData({ title: "", description: "", type: "ACADEMIC", studentId: "", isGlobal: true });
        } catch (err) { 
            console.error(err);
            alertService.error("Lỗi khi gửi thông báo"); 
        }
    };

    const handleDelete = async (id) => {
        const confirm = await alertService.confirmDelete("Xóa thông báo này?", "Dữ liệu sẽ biến mất khỏi hòm thư của sinh viên.");
        if (confirm.isConfirmed) {
            try {
                await api.delete(`/notifications/${id}`);
                setNotifications(prev => prev.filter(n => n.id !== id));
                alertService.success("Đã xóa vĩnh viễn");
            } catch (err) {
                alertService.error("Không thể xóa thông báo");
            }
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-[1000] text-slate-800 uppercase tracking-tighter italic flex items-center gap-3">
                        <Bell className="text-indigo-600" /> Notification Center
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">Trung tâm điều phối thông báo toàn hệ thống</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                    <Plus size={18} /> Soạn tin mới
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-indigo-600" size={40} />
                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Đang tải dữ liệu...</span>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Phân loại</th>
                                <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Phạm vi</th>
                                <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Nội dung thông điệp</th>
                                <th className="p-5 text-[10px] font-black uppercase text-slate-400 text-center tracking-widest">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {notifications.map((noti) => {
                                const typeInfo = NOTI_TYPES.find(t => t.value === noti.type) || NOTI_TYPES[0];
                                return (
                                    <tr key={noti.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-5">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${typeInfo.bg} ${typeInfo.color}`}>
                                                <typeInfo.icon size={14} />
                                                <span className="text-[10px] font-black uppercase">{typeInfo.label}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            {noti.isGlobal ? (
                                                <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl w-fit uppercase">
                                                    <Globe size={12} /> Toàn trường
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl w-fit uppercase">
                                                    <User size={12} /> ID: {noti.student?.id || "N/A"}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            <p className="text-sm font-black text-slate-800 mb-0.5 uppercase tracking-tight">{noti.title}</p>
                                            <p className="text-xs text-slate-500 font-medium line-clamp-1">{noti.description}</p>
                                        </td>
                                        <td className="p-5 text-center">
                                            <button 
                                                onClick={() => handleDelete(noti.id)} 
                                                className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
                
                {notifications.length === 0 && !loading && (
                    <div className="p-20 text-center">
                        <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
                            <Mail className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Hòm thư lưu trữ đang trống</p>
                    </div>
                )}
            </div>

            {/* MODAL SOẠN TIN */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white rounded-[3.5rem] w-full max-w-lg shadow-2xl border-4 border-white animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                    <Send size={20} />
                                </div>
                                <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">Soạn thông báo</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2.5 hover:bg-slate-200 rounded-2xl transition-all active:rotate-90"><X size={20}/></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Phân loại */}
                            <div className="grid grid-cols-3 gap-3">
                                {NOTI_TYPES.map(type => (
                                    <button
                                        key={type.value} type="button"
                                        onClick={() => setFormData({...formData, type: type.value})}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-[2rem] border-2 transition-all ${formData.type === type.value ? 'border-indigo-600 bg-indigo-50 shadow-inner' : 'border-slate-100 hover:bg-slate-50'}`}
                                    >
                                        <type.icon size={20} className={formData.type === type.value ? 'text-indigo-600' : 'text-slate-400'} />
                                        <span className="text-[9px] font-black uppercase tracking-tighter">{type.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Cấu hình đối tượng */}
                            <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem]">
                                <button 
                                    type="button"
                                    className={`flex-1 py-3 text-[10px] font-black rounded-2xl transition-all ${formData.isGlobal ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                                    onClick={() => setFormData({...formData, isGlobal: true, studentId: ""})}
                                >TOÀN TRƯỜNG</button>
                                <button 
                                    type="button"
                                    className={`flex-1 py-3 text-[10px] font-black rounded-2xl transition-all ${!formData.isGlobal ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                                    onClick={() => setFormData({...formData, isGlobal: false})}
                                >ĐÍCH DANH</button>
                            </div>

                            {!formData.isGlobal && (
                                <div className="animate-in slide-in-from-top-2 duration-300">
                                    <label className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-2 block tracking-widest">ID Sinh viên nhận tin</label>
                                    <input 
                                        type="number" placeholder="Nhập ID số (Ví dụ: 27)..." required
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold transition-all"
                                        value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})}
                                    />
                                </div>
                            )}
                            
                            <div className="space-y-4">
                                <input 
                                    type="text" placeholder="Tiêu đề thông báo..." required
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold transition-all"
                                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                />

                                <textarea 
                                    placeholder="Nội dung thông điệp chi tiết..." rows="4" required
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 text-sm font-medium transition-all"
                                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-900 shadow-2xl shadow-indigo-100 transition-all active:scale-95">
                                <Send size={20} /> Xác nhận phát hành
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}