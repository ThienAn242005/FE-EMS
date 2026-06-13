import React, { useEffect, useContext, useRef } from "react"; // Thêm useRef
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { AuthContext } from "../../../Context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

export default function PaymentResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { refreshStudentData } = useContext(AuthContext);

    // 1. TẠO KHÓA CHẶN (Chỉ cho phép chạy 1 lần duy nhất)
    const hasCalledAPI = useRef(false);

    const responseCode = searchParams.get("vnp_ResponseCode");
    const amount = searchParams.get("vnp_Amount");
    const txnRef = searchParams.get("vnp_TxnRef");

    const isSuccess = responseCode === "00";

    useEffect(() => {
        // 2. KIỂM TRA: Nếu thành công VÀ chưa từng gọi API thì mới cho vào
        if (isSuccess && !hasCalledAPI.current) {
            
            // 3. KHÓA CỬA NGAY LẬP TỨC
            hasCalledAPI.current = true; 

            const loadingToast = toast.loading("Đang xác thực giao dịch...");
            
            axios.get(`http://localhost:8080/api/payments/vnpay-callback`, {
                params: Object.fromEntries(searchParams.entries())
            })
            .then(async (res) => {
                console.log("Database updated!");
                
                if (refreshStudentData) {
                    await refreshStudentData();
                }
                
                toast.success("Thanh toán thành công!", { id: loadingToast });
                
                setTimeout(() => {
                    navigate("/student", { replace: true });
                }, 2000);
            })
            .catch(err => {
                console.error("Lỗi cập nhật DB:", err);
                // Nếu lỗi có thể mở khóa để thử lại hoặc giữ nguyên để chặn
                toast.error("Lỗi xác thực, vui lòng kiểm tra lại!", { id: loadingToast });
            });
        }
    }, [isSuccess, searchParams, navigate, refreshStudentData]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center border-4 border-white">
                {isSuccess ? (
                    <>
                        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-50">
                            <CheckCircle2 size={48} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Thành công!</h1>
                        <p className="text-slate-400 font-medium mt-2">Hóa đơn #{txnRef} đã được quyết toán.</p>
                        <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số tiền đã nộp</p>
                            <p className="text-2xl font-black text-blue-700">
                                {amount ? (parseInt(amount) / 100).toLocaleString() : 0}đ
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-50">
                            <XCircle size={48} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Thất bại</h1>
                        <p className="text-slate-400 font-medium mt-2">Giao dịch bị từ chối hoặc có lỗi xảy ra.</p>
                    </>
                )}

                <div className="grid gap-3 mt-10">
                    <button 
                        onClick={() => navigate(isSuccess ? "/student" : "/student/payment-lock")}
                        className="w-full py-4 bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} /> {isSuccess ? "Về trang chủ" : "Quay lại trang học phí"}
                    </button>
                </div>
            </div>
        </div>
    );
}