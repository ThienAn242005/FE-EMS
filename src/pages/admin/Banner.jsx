import React, { useState, useEffect } from 'react';
import api from "../../Service/api";
import { alertService } from "../../utils/swalUtils";
import { uploadToCloudinary } from "../../Service/uploadService"; // Import file bro vừa gửi
import { 
    Plus, Edit2, Trash2, ExternalLink, 
    Image as ImageIcon, Save, X, Loader2, UploadCloud 
} from 'lucide-react';

export default function AdminBannerPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    
    const [formData, setFormData] = useState({ id: null, title: "", imageUrl: "", active: true });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => { fetchBanners(); }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/banners');
            setBanners(data);
        } catch (err) { alertService.error("Lỗi tải danh sách!"); }
        finally { setLoading(false); }
    };

    // XỬ LÝ KHI CHỌN FILE
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            setProgress(0);
            
            // Gọi hàm của bro để đẩy lên mây
            const data = await uploadToCloudinary(file, (percent) => {
                setProgress(percent);
            });

            // Lấy URL từ Cloudinary trả về gán vào Form
            setFormData({ ...formData, imageUrl: data.secure_url });
            alertService.success("Tải ảnh lên thành công!");
        } catch (err) {
            console.error(err);
            alertService.error("Không thể tải ảnh lên Cloudinary!");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.imageUrl) return alertService.error("Vui lòng tải ảnh lên trước!");

        try {
            if (isEditing) {
                await api.put(`/banners/${formData.id}`, formData);
                alertService.successModal("Xong!", "Đã cập nhật banner.");
            } else {
                await api.post('/banners', formData);
                alertService.successModal("Xong!", "Đã thêm banner mới.");
            }
            setIsModalOpen(false);
            fetchBanners();
        } catch (err) { alertService.error("Lỗi lưu database!"); }
    };

    const handleDelete = async (id) => {
        const confirm = await alertService.confirmDelete("Xác nhận xóa?");
        if (confirm.isConfirmed) {
            try {
                await api.delete(`/banners/${id}`);
                fetchBanners();
            } catch (err) { alertService.error("Lỗi xóa!"); }
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 uppercase italic">Banner Manager</h1>
                    <p className="text-slate-500 text-sm font-medium">Lưu trữ hình ảnh trực tiếp trên Cloudinary</p>
                </div>
                <button onClick={() => { setIsEditing(false); setFormData({id:null, title:"", imageUrl:"", active:true}); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-800 shadow-xl shadow-blue-100 transition-all active:scale-95"
                >
                    <Plus size={20} /> Thêm Banner
                </button>
            </div>

            {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div> : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {banners.map((banner) => (
                        <div key={banner.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 group">
                            <div className="relative h-44 overflow-hidden">
                                <img src={banner.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button onClick={() => { setFormData(banner); setIsEditing(true); setIsModalOpen(true); }} className="p-2 bg-white rounded-xl text-blue-600 hover:scale-110 transition-all"><Edit2 size={18}/></button>
                                    <button onClick={() => handleDelete(banner.id)} className="p-2 bg-white rounded-xl text-red-600 hover:scale-110 transition-all"><Trash2 size={18}/></button>
                                </div>
                            </div>
                            <div className="p-4 flex justify-between items-center">
                                <span className="font-bold text-slate-700 truncate mr-2">{banner.title}</span>
                                <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${banner.active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {banner.active ? 'ACTIVE' : 'HIDDEN'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="font-black text-slate-800 uppercase tracking-tight">Banner Info</h2>
                            <button onClick={() => setIsModalOpen(false)}><X/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <input 
                                type="text" placeholder="Tiêu đề banner..." required
                                className="w-full px-4 py-3 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 transition-all"
                                value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />

                            <div className="relative group">
                                <div className={`border-2 border-dashed rounded-[2rem] p-6 transition-all flex flex-col items-center justify-center min-h-[160px] ${formData.imageUrl ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50'}`}>
                                    {uploading ? (
                                        <div className="flex flex-col items-center">
                                            <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                                                <Loader2 className="animate-spin text-blue-600 absolute" size={40} />
                                                <span className="text-[10px] font-black">{progress}%</span>
                                            </div>
                                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Đang tải lên...</p>
                                        </div>
                                    ) : formData.imageUrl ? (
                                        <div className="relative w-full">
                                            <img src={formData.imageUrl} className="h-32 w-full object-cover rounded-2xl" alt="Preview" />
                                            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-black shadow-xl">THAY ĐỔI ẢNH</label>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer flex flex-col items-center">
                                            <UploadCloud size={40} className="text-slate-300 mb-2" />
                                            <span className="text-xs font-bold text-slate-400">Nhấn để chọn ảnh</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    )}
                                    <input type="file" className="hidden" id="fileInput" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 ml-2">
                                <input type="checkbox" className="w-5 h-5" checked={formData.active} onChange={(e) => setFormData({...formData, active: e.target.checked})} />
                                <span className="text-sm font-bold text-slate-600 uppercase text-[10px]">Hiển thị banner này</span>
                            </div>

                            <button 
                                type="submit" disabled={uploading || !formData.imageUrl}
                                className="w-full py-4 bg-blue-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-800 disabled:bg-slate-300 transition-all active:scale-95 shadow-lg shadow-blue-100"
                            >
                                {isEditing ? "Cập nhật dữ liệu" : "Lưu banner mới"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}