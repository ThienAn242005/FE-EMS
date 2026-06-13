import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { alertService } from "../../utils/swalUtils";
import { 
    Receipt, Trash2, CheckCircle, Search, 
    X, ShieldAlert, Loader2, User, DollarSign, Calendar
} from 'lucide-react';

const api = axios.create({ baseURL: "http://localhost:8080/api/payments" });
const systemApi = axios.create({ baseURL: "http://localhost:8080/api/admin/system" });

export default function AdminInvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => { fetchInvoices(); }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const res = await api.get('');
            // Sắp xếp hóa đơn mới nhất lên đầu
            const sorted = [...res.data].sort((a, b) => b.id - a.id);
            setInvoices(sorted);
        } catch (err) { 
            alertService.error("Lỗi tải danh sách hóa đơn!"); 
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // 🔴 NÚT QUYỀN LỰC: QUÉT VÀ ĐỒNG BỘ HÓA ĐƠN
    // ==========================================
    const handleSyncInvoices = async () => {
        const confirm = await alertService.confirmDelete(
            "XÁC NHẬN ĐỒNG BỘ HỆ THỐNG",
            "Hệ thống sẽ đối soát lại toàn bộ trạng thái hóa đơn từ cổng thanh toán. Bạn có chắc chắn muốn thực hiện?"
        );

        if (confirm) {
            try {
                setIsScanning(true);
                // Gọi tới Endpoint sync-invoices (giả định đã viết ở Backend)
                await systemApi.post('/sync-invoices');
                alertService.success("Đã đồng bộ hóa dữ liệu hóa đơn thành công!");
                fetchInvoices();
            } catch (err) {
                alertService.error("Lỗi khi thực thi lệnh đồng bộ!");
            } finally {
                setIsScanning(false);
            }
        }
    };

    const handleDelete = async (id) => {
        const confirm = await alertService.confirmDelete("Xóa hóa đơn?", "Dữ liệu này sẽ biến mất vĩnh viễn khỏi lịch sử giao dịch.");
        if (confirm) {
            try {
                await api.delete(`/${id}`);
                alertService.success("Đã xóa hóa đơn thành công!");
                setInvoices(prev => prev.filter(i => i.id !== id));
            } catch (err) { alertService.error("Không thể xóa hóa đơn!"); }
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            COMPLETED: "bg-emerald-100 text-emerald-600 border-emerald-200",
            PENDING: "bg-amber-100 text-amber-600 border-amber-200",
            FAILED: "bg-rose-100 text-rose-600 border-rose-200",
            PROCESSING: "bg-purple-100 text-purple-600 border-purple-200 animate-pulse"
        };
        const labels = { COMPLETED: "THÀNH CÔNG", PENDING: "ĐANG CHỜ", FAILED: "THẤT BẠI", PROCESSING: "XỬ LÝ" };
        return <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase ${styles[status] || 'bg-slate-100'}`}>
            {labels[status] || status}
        </span>;
    };

    const filteredInvoices = invoices.filter(i => 
        i.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.student?.studentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.id.toString().includes(searchTerm)
    );

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-[1000] text-slate-800 uppercase italic flex items-center gap-3">
                        <Receipt className="text-blue-700" size={28}/> Quản lý hóa đơn
                    </h1>
                    <p className="text-slate-500 text-sm font-medium italic">Lịch sử giao dịch và quyết toán hệ thống</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleSyncInvoices}
                        disabled={isScanning}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg transition-all active:scale-95 ${
                            isScanning 
                            ? 'bg-slate-400 text-white cursor-not-allowed' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                        }`}
                    >
                        {isScanning ? <Loader2 size={16} className="animate-spin" /> : <ShieldAlert size={16} />}
                        {isScanning ? "Đang xử lý..." : "Đồng bộ hóa đơn"}
                    </button>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Tìm mã HĐ hoặc MSSV..." 
                            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-64 font-bold outline-none focus:border-blue-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Đang truy xuất dữ liệu...</span>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b">
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <th className="p-5">Mã Giao Dịch</th>
                                <th className="p-5">Sinh viên nộp</th>
                                <th className="p-5">Số tiền thanh toán</th>
                                <th className="p-5">Phương thức</th>
                                <th className="p-5">Trạng thái</th>
                                <th className="p-5 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredInvoices.map(pay => (
                                <tr key={pay.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="p-5">
                                        <div className="font-mono font-black text-blue-600">
                                            #PAY-{pay.id.toString().padStart(4, '0')}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                            <Calendar size={10}/> {pay.createdAt ? new Date(pay.createdAt).toLocaleDateString('vi-VN') : "N/A"}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-700 uppercase italic leading-tight">
                                                    {pay.student?.fullName || "Khách vãng lai"}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold tracking-tighter">
                                                    MSSV: {pay.student?.studentCode || "N/A"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 font-black text-blue-700">
                                        {pay.amount?.toLocaleString()}₫
                                    </td>
                                    <td className="p-5">
                                        <div className="text-[10px] font-black text-slate-500 uppercase italic">
                                            {pay.paymentMethod || "VNPAY"}
                                        </div>
                                    </td>
                                    <td className="p-5">{getStatusBadge(pay.status)}</td>
                                    <td className="p-5 text-center">
                                        <button 
                                            onClick={() => handleDelete(pay.id)}
                                            className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                                            title="Xóa hóa đơn"
                                        >
                                            <Trash2 size={18}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {filteredInvoices.length === 0 && !loading && (
                    <div className="p-20 text-center">
                        <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
                            <Receipt className="text-slate-300" size={32} />
                        </div>
                        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest italic">
                            Không có dữ liệu hóa đơn nào khớp...
                        </p>
                    </div>
                )}
            </div>

            <footer className="mt-8 text-center opacity-20">
                <p className="text-[9px] font-black uppercase tracking-[0.4em]">HITU University • Finance Module</p>
            </footer>
        </div>
    );
}