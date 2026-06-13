import React, { useState, useEffect } from "react";
import axios from "axios";
import { Receipt, User, DollarSign, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";

export default function Invoices() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Gọi API lấy danh sách hóa đơn (Payments)
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/payments");
        // Sắp xếp hóa đơn mới nhất lên đầu
        const sortedData = response.data.sort((a, b) => b.id - a.id);
        setPayments(sortedData);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách hóa đơn:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // 2. Hàm format tiền tệ VNĐ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Đang tải dữ liệu hóa đơn...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-[1000] text-slate-800 uppercase tracking-tighter italic flex items-center gap-3">
          <Receipt className="text-blue-700" size={32} /> Quản lý hóa đơn
        </h1>
        <p className="text-slate-500 font-medium italic mt-1">Danh sách tất cả giao dịch thanh toán trên hệ thống</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Mã Giao Dịch</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Sinh Viên</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Số Tiền</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Phương Thức</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.length > 0 ? (
                payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-6">
                      <span className="font-mono font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                        #PAY-{pay.id.toString().padStart(4, '0')}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 uppercase text-xs tracking-tight">
                            {pay.student?.fullName || "N/A"}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{pay.student?.studentCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="font-black text-blue-700 text-sm">
                        {formatCurrency(pay.amount)}
                      </p>
                    </td>
                    <td className="p-6 text-[10px] font-black text-slate-500 uppercase italic">
                      {pay.paymentMethod || "VNPay"}
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center">
                        <StatusBadge status={pay.status} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <Receipt className="text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Chưa có dữ liệu hóa đơn</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Component phụ hiển thị Badge trạng thái
function StatusBadge({ status }) {
  const config = {
    COMPLETED: { 
      label: "Thành công", 
      icon: <CheckCircle2 size={12} />, 
      style: "bg-emerald-50 text-emerald-600 border-emerald-100" 
    },
    PENDING: { 
      label: "Chờ duyệt", 
      icon: <Clock size={12} />, 
      style: "bg-amber-50 text-amber-600 border-amber-100" 
    },
    FAILED: { 
      label: "Thất bại", 
      icon: <AlertCircle size={12} />, 
      style: "bg-rose-50 text-rose-600 border-rose-100" 
    }
  };

  const current = config[status] || config.PENDING;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tight ${current.style}`}>
      {current.icon}
      {current.label}
    </div>
  );
}