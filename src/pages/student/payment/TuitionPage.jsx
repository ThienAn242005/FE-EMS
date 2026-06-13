import { useEffect, useState } from "react";
import api from "../../../Service/api";
import { CreditCard, AlertTriangle, Loader2 } from "lucide-react";

export default function TuitionPaymentPage() {
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnpaid();
  }, []);

  const fetchUnpaid = async () => {
    try {
      const res = await api.get("/payments/me/unpaid");
      setPayments(res.data.payments || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmTransfer = async (id) => {
    try {
      await api.patch(`/payments/${id}/confirm-request`);
      alert("Đã gửi yêu cầu xác nhận. Vui lòng chờ kế toán duyệt.");
      fetchUnpaid();
    } catch (err) {
      alert("Có lỗi xảy ra");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <div className="flex items-center gap-3 mb-6 text-red-600">
          <AlertTriangle size={28} />
          <h1 className="text-2xl font-black">
            CẢNH BÁO HỌC PHÍ
          </h1>
        </div>

        <p className="mb-6 text-slate-600 font-semibold">
          Bạn chưa hoàn tất học phí. Vui lòng thanh toán để tiếp tục sử dụng hệ thống.
        </p>

        <table className="w-full border-collapse rounded-xl overflow-hidden">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Học kỳ</th>
              <th className="p-4 text-right">Tổng tiền</th>
              <th className="p-4 text-right">Đã đóng</th>
              <th className="p-4 text-right">Còn nợ</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-4 font-bold">{p.semester}</td>
                <td className="p-4 text-right">
                  {p.totalAmount.toLocaleString()} đ
                </td>
                <td className="p-4 text-right text-green-600">
                  {p.amountPaid.toLocaleString()} đ
                </td>
                <td className="p-4 text-right text-red-600 font-bold">
                  {(p.totalAmount - p.amountPaid).toLocaleString()} đ
                </td>
                <td className="p-4 text-center">
                  {p.status === "PROCESSING" ? (
                    <span className="text-orange-500 font-bold">
                      Đang chờ duyệt
                    </span>
                  ) : (
                    <button
                      onClick={() => confirmTransfer(p.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 mx-auto"
                    >
                      <CreditCard size={16} />
                      Đã chuyển tiền
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 text-right text-xl font-black text-red-600">
          Tổng nợ: {total.toLocaleString()} đ
        </div>
      </div>
    </div>
  );
}
