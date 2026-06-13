import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { 
    CreditCard, BookOpen, CheckCircle2, ShieldCheck, 
    Receipt, ArrowRight, Loader2, ChevronDown, ChevronUp, AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { alertService } from "../../../utils/swalUtils";

const api = axios.create({ baseURL: "http://localhost:8080/api" });

export function Payment() {
    const [payments, setPayments] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRedirecting, setIsRedirecting] = useState(false);
    
    // TRỌNG TÂM: Lưu học kỳ đang được người dùng xem chi tiết
    const [activeSemester, setActiveSemester] = useState(null);
    
    const studentId = 1; 
    const PRICE_PER_CREDIT = 500000;

    const fetchData = useCallback(async () => {
        try {
            const [payRes, enrollRes] = await Promise.all([
                api.get(`/payments/student/${studentId}`),
                api.get(`/enrollments/student/${studentId}`)
            ]);
            
            const pData = payRes.data || [];
            setPayments(pData);
            setEnrollments((enrollRes.data || []).filter(e => e.approved === true));
            
            // Mặc định chọn học kỳ mới nhất (Học kỳ 1 - 2023 trong ảnh của bạn)
            if (pData.length > 0) {
                setActiveSemester(pData[0].semester);
            }
        } catch (error) {
            alertService.error("Lỗi đồng bộ dữ liệu tài chính.");
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // 1. Nhóm môn học theo học kỳ
    const groupedEnrollments = useMemo(() => {
        return enrollments.reduce((groups, en) => {
            const sem = en.course?.semester?.name || "Khác";
            if (!groups[sem]) groups[sem] = [];
            groups[sem].push(en);
            return groups;
        }, {});
    }, [enrollments]);

    // 2. LOGIC TỐI ƯU: Tính toán hóa đơn dựa trên activeSemester
    const financialReport = useMemo(() => {
        if (!activeSemester || payments.length === 0) return null;
        
        // Tìm thông tin đóng tiền của học kỳ đang chọn từ DB
        const dbPayment = payments.find(p => p.semester === activeSemester) || { amountPaid: 0, totalAmount: 0, balance: 0 };
        
        // Lấy danh sách môn học thực tế của học kỳ đang chọn
        const currentItems = groupedEnrollments[activeSemester] || [];
        
        // Tính tổng tiền thực tế từ tín chỉ
        const actualTotal = currentItems.reduce((sum, e) => 
            sum + (e.course?.subject?.credit * PRICE_PER_CREDIT), 0);
        
        // Số dư thực tế = Tổng thực tế - Tiền đã đóng
        const realBalance = Math.max(0, actualTotal - (dbPayment.amountPaid || 0));
        
        return {
            semester: activeSemester,
            id: dbPayment.id,
            totalAmount: dbPayment.totalAmount,
            amountPaid: dbPayment.amountPaid,
            actualTotal,
            realBalance,
            isModified: actualTotal > dbPayment.totalAmount // Phát hiện môn mới đăng ký
        };
    }, [activeSemester, payments, groupedEnrollments]);

    const handleVNPayPayment = async () => {
        if (!financialReport || financialReport.realBalance <= 0) return;

        const confirm = await alertService.confirmDelete(
            "Xác nhận thanh toán?",
            `Thanh toán học phí cho ${financialReport.semester}: ${financialReport.realBalance.toLocaleString()}đ`
        );

        if (confirm.isConfirmed) {
            try {
                setIsRedirecting(true);
                const response = await api.post(`/payments/${financialReport.id}/create-vnpay`, {
                    amount: financialReport.realBalance
                });
                if (response.data.url) window.location.href = response.data.url;
            } catch (error) {
                alertService.error("Cổng thanh toán lỗi.");
                setIsRedirecting(false);
            }
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
    );

    return (
        <div className="p-8 w-full bg-[#f8fafc] min-h-screen font-sans">
            <Toaster position="top-right" />
            
            {/* Cấu trúc Grid 12 cột */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* CỘT TRÁI: DANH SÁCH HỌC KỲ */}
                <div className="lg:col-span-8 space-y-6">
                    {Object.entries(groupedEnrollments).map(([semester, items]) => (
                        <div key={semester} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            {/* Khi click vào header, cập nhật activeSemester để cột phải nhảy theo */}
                            <div 
                                onClick={() => setActiveSemester(semester)}
                                className={`p-7 flex justify-between items-center cursor-pointer transition-all ${activeSemester === semester ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`p-3 rounded-2xl ${activeSemester === semester ? 'bg-white/10' : 'bg-blue-50 text-blue-600'}`}>
                                        <BookOpen size={24} />
                                    </div>
                                    <h3 className="font-black text-lg uppercase italic">{semester}</h3>
                                </div>
                                {activeSemester === semester ? <ChevronUp size={24}/> : <ChevronDown size={24}/>}
                            </div>

                            <AnimatePresence>
                                {activeSemester === semester && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden bg-white">
                                        <div className="p-6 grid gap-4">
                                            {items.map(e => (
                                                <div key={e.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-[2rem]">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-blue-600">{e.course?.subject?.credit}</div>
                                                        <span className="font-bold text-slate-700">{e.course?.subject?.subjectName}</span>
                                                    </div>
                                                    <span className="font-black text-slate-800">{(e.course?.subject?.credit * PRICE_PER_CREDIT).toLocaleString()}đ</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* CỘT PHẢI: HÓA ĐƠN TỔNG HỢP (DYNAMIC THEO ACTIVE SEMESTER) */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl sticky top-10 border border-slate-50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Số dư quyết toán</p>
                        <h3 className="font-[1000] text-slate-900 uppercase italic mb-6 text-xl">{financialReport?.semester}</h3>
                        
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className={`text-6xl font-[1000] tracking-tighter ${financialReport?.realBalance > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {(financialReport?.realBalance || 0).toLocaleString()}
                            </span>
                            <span className="text-2xl font-black text-slate-300">đ</span>
                        </div>

                        {financialReport?.isModified && (
                            <div className="mb-6 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-3">
                                <AlertCircle className="text-orange-500 shrink-0" size={18} />
                                <p className="text-[10px] font-bold text-orange-700 uppercase">Phát hiện môn học mới đăng ký chưa quyết toán.</p>
                            </div>
                        )}

                        <div className="space-y-4 mb-10 py-8 border-t border-b border-dashed border-slate-100 text-sm font-bold">
                            <div className="flex justify-between">
                                <span className="text-slate-400">TỔNG PHÍ THỰC TẾ:</span>
                                <span className="text-slate-800">{(financialReport?.actualTotal || 0).toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">TIỀN ĐÃ NỘP (DB):</span>
                                <span className="text-emerald-600">{(financialReport?.amountPaid || 0).toLocaleString()}đ</span>
                            </div>
                        </div>

                        {financialReport?.realBalance > 0 ? (
                            <button onClick={handleVNPayPayment} disabled={isRedirecting} className="w-full bg-slate-900 text-white font-black py-6 rounded-[2.2rem] flex items-center justify-center gap-4 hover:bg-blue-700 transition-all">
                                {isRedirecting ? <Loader2 className="animate-spin" /> : "THANH TOÁN NGAY"}
                            </button>
                        ) : (
                            <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-center text-white shadow-xl">
                                <CheckCircle2 className="mx-auto mb-3" size={40} />
                                <p className="font-black text-xs uppercase tracking-widest">Học phí kỳ này <br/>đã hoàn tất</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}