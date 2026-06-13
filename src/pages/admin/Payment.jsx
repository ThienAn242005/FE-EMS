import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { alertService } from "../../utils/swalUtils";
import { 
  Plus, Edit, Trash2, Save, CheckCircle, Search, 
  Filter, X, ShieldAlert, Zap, Loader2 
} from 'lucide-react';

const api = axios.create({ baseURL: "http://localhost:8080/api/payments" });
// API hệ thống để gọi nút quyền lực
const systemApi = axios.create({ baseURL: "http://localhost:8080/api/admin/system" });

export default function AdminPaymentPage() {
    const [payments, setPayments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isScanning, setIsScanning] = useState(false);

    const [formData, setFormData] = useState({
        id: null, totalAmount: 0, amountPaid: 0, status: "PENDING", semester: ""
    });

    useEffect(() => { fetchPayments(); }, []);

    const fetchPayments = async () => {
        try {
            const res = await api.get('');
            setPayments(res.data);
        } catch (err) { alertService.error("Lỗi tải dữ liệu học phí!"); }
    };

    // ==========================================
    // 🔴 HÀM XỬ LÝ NÚT QUYỀN LỰC: QUÉT VÀ KHÓA
    // ==========================================
    const handleSystemScanAndLock = async () => {
        const confirm = await alertService.confirmDelete(
            "XÁC NHẬN KHÓA NỢ HỌC PHÍ",
            "Hệ thống sẽ quét TOÀN BỘ sinh viên. Những ai còn nợ tiền sẽ bị KHÓA TRANG ngay lập tức. Bạn có chắc chắn?"
        );

        if (confirm) {
            try {
                setIsScanning(true);
                // Gọi tới Endpoint scan-debtors đã viết ở Backend
                await systemApi.post('/scan-debtors');
                alertService.success("Đã quét và thực thi lệnh khóa hàng loạt thành công!");
                fetchPayments(); // Reload lại danh sách
            } catch (err) {
                alertService.error("Lỗi khi thực thi lệnh quét hệ thống!");
                console.error(err);
            } finally {
                setIsScanning(false);
            }
        }
    };

    const handleApprove = async (id, total, currentPaid) => {
        const remaining = total - currentPaid;
        try {
            await api.patch(`/${id}/pay?amount=${remaining}`);
            alertService.success("Xác nhận thanh toán thành công!");
            fetchPayments();
        } catch (err) { alertService.error("Lỗi khi duyệt thanh toán!"); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/${formData.id}`, formData);
                alertService.success("Cập nhật thành công!");
            }
            setIsModalOpen(false);
            fetchPayments();
        } catch (err) { alertService.error("Lỗi cập nhật!"); }
    };

    const getStatusBadge = (status) => {
        const styles = {
            PAID: "bg-emerald-100 text-emerald-600 border-emerald-200",
            PENDING: "bg-amber-100 text-amber-600 border-amber-200",
            PARTIAL: "bg-blue-100 text-blue-600 border-blue-200",
            PROCESSING: "bg-purple-100 text-purple-600 border-purple-200 animate-pulse"
        };
        return <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase ${styles[status] || 'bg-slate-100'}`}>{status}</span>;
    };

    const filteredPayments = payments.filter(p => 
        p.student?.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.student?.studentCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-[1000] text-slate-800 uppercase italic">Đối soát học phí</h1>
                    <p className="text-slate-500 text-sm font-medium italic">Quản lý trạng thái nộp tiền của sinh viên</p>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* NÚT QUYỀN LỰC */}
                    <button 
                        onClick={handleSystemScanAndLock}
                        disabled={isScanning}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg transition-all active:scale-95 ${
                            isScanning 
                            ? 'bg-slate-400 text-white cursor-not-allowed' 
                            : 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200'
                        }`}
                    >
                        {isScanning ? <Loader2 size={16} className="animate-spin" /> : <ShieldAlert size={16} />}
                        {isScanning ? "Đang quét hệ thống..." : "Quét & Khóa nợ phí"}
                    </button>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Tìm tên hoặc MSSV..." 
                            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-64 font-bold outline-none focus:border-emerald-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="p-5">Sinh viên / Học kỳ</th>
                            <th className="p-5">Tổng phải đóng</th>
                            <th className="p-5">Thực đóng</th>
                            <th className="p-5">Còn nợ</th>
                            <th className="p-5">Trạng thái</th>
                            <th className="p-5 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredPayments.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-5">
                                    <div className="font-black text-slate-700 uppercase italic">
                                        {p.student?.user?.fullName || "Khách vãng lai"}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold tracking-tighter">
                                        {p.student?.studentCode || "N/A"} • {p.semester}
                                    </div>
                                </td>
                                <td className="p-5 font-black text-slate-500">{p.totalAmount?.toLocaleString()}đ</td>
                                <td className="p-5 font-black text-emerald-600">{p.amountPaid?.toLocaleString()}đ</td>
                                <td className="p-5 font-black text-rose-500">
                                    {(p.totalAmount - p.amountPaid).toLocaleString()}đ
                                </td>
                                <td className="p-5">{getStatusBadge(p.status)}</td>
                                <td className="p-5">
                                    <div className="flex justify-center gap-2">
                                        {p.status === 'PROCESSING' && (
                                            <button 
                                                onClick={() => handleApprove(p.id, p.totalAmount, p.amountPaid)} 
                                                title="Duyệt thanh toán"
                                                className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-transform active:scale-90"
                                            >
                                                <CheckCircle size={18}/>
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => { setFormData(p); setIsEditing(true); setIsModalOpen(true); }} 
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Edit size={16}/>
                                        </button>
                                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredPayments.length === 0 && (
                    <div className="p-20 text-center text-slate-400 font-bold italic">Không tìm thấy dữ liệu phù hợp...</div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl p-10 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black uppercase italic text-slate-800">Cập nhật học phí</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={24}/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Sinh viên</label>
                                <input type="text" className="w-full p-4 bg-slate-100 rounded-2xl border font-bold text-slate-500" value={formData.student?.user?.fullName} disabled />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Phải đóng</label>
                                    <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" 
                                        value={formData.totalAmount} onChange={e => setFormData({...formData, totalAmount: parseFloat(e.target.value)})} required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Đã nộp</label>
                                    <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" 
                                        value={formData.amountPaid} onChange={e => setFormData({...formData, amountPaid: parseFloat(e.target.value)})} required />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Trạng thái nộp</label>
                                <select className="w-full p-4 bg-slate-50 rounded-2xl border font-bold appearance-none outline-none focus:border-emerald-500" 
                                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                    <option value="PENDING">PENDING</option>
                                    <option value="PARTIAL">PARTIAL</option>
                                    <option value="PAID">PAID</option>
                                    <option value="PROCESSING">PROCESSING</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all mt-4">
                                <Save size={18} className="inline mr-2" /> Cập nhật thông tin
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}