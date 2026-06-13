import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { FileText, FileClock, Loader2, CheckCircle2 } from "lucide-react";
import { TuitionInvoice } from "./TutitonInvoice";

const API_BASE = "http://localhost:8080/api";
// THAY ĐỔI: Sử dụng IP máy tính của ông để điện thoại có thể quét được
const UI_SERVER_IP = "192.168.1.17"; // Ông gõ ipconfig ở cmd để lấy IP thật nhé

export default function PaymentHistory() {
    const [payments, setPayments] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState(null);
    
    const contentRef = useRef(null);
    const studentId = 1; 

    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        documentTitle: `BienLai_HocPhi_SV${studentId}`,
    });

    useEffect(() => {
        const fetchPaidHistory = async () => {
            try {
                setLoading(true);
                const [payRes, enrollRes] = await Promise.all([
                    axios.get(`${API_BASE}/payments/student/${studentId}`),
                    axios.get(`${API_BASE}/enrollments/student/${studentId}`)
                ]);

                const successPayments = (payRes.data || []).filter(p => p.status === "PAID");
                setPayments(successPayments);
                setEnrollments(enrollRes.data || []);
                
                if (successPayments.length > 0) {
                    setSelectedPayment(successPayments[0]);
                }
            } catch (err) {
                console.error("Lỗi tải lịch sử thanh toán:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPaidHistory();
    }, [studentId]);

    if (loading) return (
        <div className="flex justify-center p-20">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
    );

    if (payments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <FileClock size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-700">Chưa có lịch sử thanh toán</h3>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Lịch sử giao dịch</h2>
                        <p className="text-slate-400 text-xs font-bold flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-500"/> GIAO DỊCH ĐÃ HOÀN TẤT
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {payments.map((pay) => (
                        <div key={pay.id} className="flex flex-col md:flex-row justify-between items-center p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-indigo-200 hover:bg-white transition-all">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã hóa đơn</p>
                                    <p className="font-bold text-slate-800 text-lg">#{pay.id}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setSelectedPayment(pay);
                                    setTimeout(() => handlePrint(), 150);
                                }}
                                className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            >
                                <FileText size={18} /> Xuất biên lai
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* PHẦN QUAN TRỌNG: Truyền URL xác thực vào hóa đơn */}
            <div style={{ display: "none" }}>
                <TuitionInvoice 
                    ref={contentRef} 
                    payment={selectedPayment} 
                    student={{ studentCode: `SV${studentId}`, fullName: "Sinh viên thực hiện" }}
                    enrollments={enrollments} 
                    // Link này sẽ được mã hóa vào QR trong file TuitionInvoice.jsx
                    verifyUrl={`http://${UI_SERVER_IP}:5173/student/verify-invoice/${selectedPayment?.id}`}
                />
            </div>
        </div>
    );
}