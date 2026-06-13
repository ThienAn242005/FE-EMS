import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { alertService } from "../../utils/swalUtils";
import { 
    School, Plus, Edit3, Trash2, Search, X, Save, Loader2, Building2 
} from 'lucide-react';

const api = axios.create({
    baseURL: "http://localhost:8080/api/departments"
});

export default function AdminDepartmentPage() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({ id: null, name: "" });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => { fetchDepartments(); }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/all');
            setDepartments(data);
        } catch (err) {
            alertService.error("Không thể tải danh sách khoa");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (dept = null) => {
        if (dept) {
            setFormData(dept);
            setIsEditing(true);
        } else {
            setFormData({ id: null, name: "" });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/update/${formData.id}`, formData);
                alertService.success("Cập nhật thành công!");
            } else {
                await api.post('/add', formData);
                alertService.success("Thêm khoa mới thành công!");
            }
            setIsModalOpen(false);
            fetchDepartments();
        } catch (err) {
            alertService.error("Lỗi khi xử lý dữ liệu");
        }
    };

    const handleDelete = async (id) => {
        const confirm = await alertService.confirmDelete("Xóa khoa này?", "Hành động này sẽ ảnh hưởng đến các lớp và sinh viên thuộc khoa!");
        if (confirm.isConfirmed) {
            try {
                await api.delete(`/delete/${id}`);
                alertService.success("Đã xóa khoa!");
                fetchDepartments();
            } catch (err) {
                alertService.error("Lỗi: Có thể khoa này đang chứa dữ liệu liên quan.");
            }
        }
    };

    const filteredDepts = departments.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 uppercase italic flex items-center gap-3">
                        <School className="text-blue-600" size={28} /> Quản lý Khoa
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">Danh sách các khoa đào tạo trong trường</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-800 transition-all active:scale-95"
                >
                    <Plus size={20} /> Thêm Khoa mới
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 border border-slate-100 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Tìm tên khoa..."
                    className="w-full outline-none text-sm font-medium text-slate-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Content Section */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDepts.map((dept) => (
                        <div key={dept.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Building2 size={24} />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenModal(dept)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                        <Edit3 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(dept.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mã khoa: #{dept.id}</h3>
                            <h2 className="text-lg font-black text-slate-800 leading-tight uppercase truncate">{dept.name}</h2>
                            <div className="mt-6 flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-tighter">
                                <span>Chi tiết nhân sự</span>
                                <Plus size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredDepts.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 italic">Không tìm thấy khoa nào khớp với từ khóa.</p>
                </div>
            )}

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border-t-8 border-blue-700">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-black text-slate-800 uppercase italic">
                                {isEditing ? "Cập nhật Khoa" : "Tạo Khoa mới"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Tên khoa đào tạo</label>
                                <input 
                                    type="text" required
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-700 outline-none transition-all font-bold text-slate-700"
                                    placeholder="Ví dụ: Công nghệ Thông tin..."
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all uppercase text-xs tracking-widest"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-700 text-white rounded-2xl font-black hover:bg-blue-800 shadow-xl shadow-blue-100 transition-all active:scale-95 uppercase text-xs tracking-widest"
                                >
                                    <Save size={18} /> Lưu khoa
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}