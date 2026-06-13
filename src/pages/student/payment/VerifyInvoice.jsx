import axios from "axios";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VerifyInvoice() {
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        // Gọi API lấy thông tin hóa đơn theo ID
       axios.get(`http://192.168.1.17:8080/api/payments/public-verify/${id}`)
             .then(res => setData(res.data));
    }, [id]);

    if (!data) return <div>Đang kiểm tra dữ liệu hóa đơn...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-50 p-4">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl border-4 border-emerald-500 max-w-md w-full text-center">
                <div className="bg-emerald-500 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={48} />
                </div>
                <h1 className="text-2xl font-black text-emerald-700 uppercase mb-2">Hóa đơn hợp lệ</h1>
                <p className="text-slate-500 text-sm mb-6">Thông tin được xác thực bởi hệ thống VUST-SMS</p>
                
                <div className="text-left space-y-3 border-t border-dashed pt-4 font-mono text-sm">
                    <p><strong>Chủ hộ:</strong> {data.studentName}</p>
                    <p><strong>Mã SV:</strong> {data.studentCode}</p>
                    <p><strong>Số tiền:</strong> {data.amount.toLocaleString()}đ</p>
                    <p><strong>Ngày nộp:</strong> {data.payDate}</p>
                    <p className="text-emerald-600 font-bold italic">Trạng thái: ĐÃ THANH TOÁN</p>
                </div>
            </div>
        </div>
    );
}