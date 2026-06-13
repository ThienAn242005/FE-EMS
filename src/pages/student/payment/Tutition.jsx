import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";
import axios from "axios";
import { 
    CreditCard, BookOpen, CheckCircle2, ShieldCheck, 
    Receipt, ArrowRight, Loader2, ChevronDown, ChevronUp, AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { alertService } from "../../../utils/swalUtils";
import { AuthContext } from "../../../Context/AuthContext"; // Import AuthContext

const api = axios.create({ baseURL: "http://localhost:8080/api" });

export default function StudentTuition() {
    // SỬA: Lấy user và authLoading từ Context
    const { user, loading: authLoading } = useContext(AuthContext);
    
    const [payments, setPayments] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [activeSemester, setActiveSemester] = useState(null);
    
    const PRICE_PER_CREDIT = 500000;

    const fetchData = useCallback(async () => {
        // SỬA: Kiểm tra studentCode thay vì ID số
        if (authLoading || !user?.studentCode) return;

        try {
            setLoading(true);
            const token = user.token || localStorage.getItem("token");
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // SỬA: Đổi Endpoint gọi theo student/code/...
            const [payRes, enrollRes] = await Promise.all([
                api.get(`/payments/student/code/${user.studentCode}`, config),
                api.get(`/enrollments/student/${user.studentCode}`, config)
            ]);
            
            const sortedPayments = (payRes.data || []).sort((a, b) => b.id - a.id);
            
            setPayments(sortedPayments);
            setEnrollments((enrollRes.data || []).filter(e => e.approved === true));
            
            if (sortedPayments.length > 0) {
                setActiveSemester(sortedPayments[0].semester);
            }
        } catch (error) {
            console.error("Finance API Error:", error);
            alertService.error("Lỗi đồng bộ dữ liệu tài chính.");
        } finally {
            setLoading(false);
        }
    }, [user?.studentCode, authLoading]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleToggleSemester = (semesterName) => {
        setActiveSemester(prev => (prev === semesterName ? null : semesterName));
        if (activeSemester !== semesterName) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const groupedEnrollments = useMemo(() => {
        return enrollments.reduce((groups, en) => {
            const sem = en.course?.semester?.name || "Khác";
            if (!groups[sem]) groups[sem] = [];
            groups[sem].push(en);
            return groups;
        }, {});
    }, [enrollments]);

    const financialReport = useMemo(() => {
        const targetSem = activeSemester || (payments.length > 0 ? payments[0].semester : null);
        if (!targetSem) return null;

        const dbPayment = payments.find(p => p.semester === targetSem) || { amountPaid: 0, totalAmount: 0, balance: 0 };
        const currentItems = groupedEnrollments[targetSem] || [];
        const actualTotal = currentItems.reduce((sum, e) => sum + (e.course?.subject?.credit * PRICE_PER_CREDIT), 0);
        const realBalance = Math.max(0, actualTotal - (dbPayment.amountPaid || 0));
        
        return {
            semester: targetSem,
            id: dbPayment.id,
            totalAmount: dbPayment.totalAmount,
            amountPaid: dbPayment.amountPaid,
            actualTotal,
            realBalance,
            isModified: actualTotal > dbPayment.totalAmount 
        };
    }, [activeSemester, payments, groupedEnrollments]);

    const handleVNPayPayment = async () => {
        if (!financialReport || financialReport.realBalance <= 0) return;
        const confirm = await alertService.confirmDelete("Thanh toán?", `Xác nhận thanh toán phí cho ${financialReport.semester}`);
        if (confirm.isConfirmed) {
            try {
                setIsRedirecting(true);
                const token = user.token || localStorage.getItem("token");
                const response = await api.post(`/payments/${financialReport.id}/create-vnpay`, 
                    { amount: financialReport.realBalance },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.url) window.location.href = response.data.url;
            } catch (error) {
                alertService.error("Lỗi kết nối VNPay.");
                setIsRedirecting(false);
            }
        }
    };

    if (authLoading || (loading && user?.studentCode)) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="mt-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Đang tải dữ liệu tài chính...</p>
        </div>
    );

    if (!user?.studentCode) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
            <AlertCircle className="text-red-500" size={40} />
            <p className="mt-4 font-black text-red-500 uppercase text-[10px] tracking-widest">Không tìm thấy mã sinh viên</p>
        </div>
    );

    return (
        <div className="p-8 w-full bg-[#f8fafc] min-h-screen font-sans">
            <Toaster position="top-right" />
            
            <div className="mb-12">
                <h1 className="text-5xl font-[1000] text-slate-900 tracking-tighter flex items-center gap-4">
                    <div className="p-3 bg-slate-900 rounded-3xl text-white shadow-2xl"><Receipt size={36} /></div>
                    TÀI CHÍNH
                </h1>
                <p className="text-slate-400 font-bold mt-3 ml-2 flex items-center gap-2 text-xs uppercase tracking-widest">
                    <ShieldCheck size={16} className="text-emerald-500" /> Hệ thống quản lý học phí HITU-SMS
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-8 space-y-6">
                    {payments.map((p) => {
                        const items = groupedEnrollments[p.semester] || [];
                        const isExpanded = activeSemester === p.semester;

                        return (
                            <div key={p.id} className={`bg-white rounded-[2.5rem] shadow-sm border transition-all duration-300 ${isExpanded ? 'border-slate-900 ring-4 ring-slate-50' : 'border-slate-100'}`}>
                                <div 
                                    onClick={() => handleToggleSemester(p.semester)}
                                    className={`p-7 flex justify-between items-center cursor-pointer transition-all ${isExpanded ? 'bg-slate-900 text-white rounded-t-[2.3rem]' : 'hover:bg-slate-50 rounded-[2.3rem]'}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`p-3 rounded-2xl ${isExpanded ? 'bg-white/10' : 'bg-blue-50 text-blue-600'}`}><BookOpen size={24} /></div>
                                        <h3 className="font-black text-lg uppercase italic tracking-tight">{p.semester}</h3>
                                    </div>
                                    {isExpanded ? <ChevronUp size={24}/> : <ChevronDown size={24}/>}
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <div className="p-6 grid gap-4 bg-white rounded-b-[2.5rem]">
                                                {items.map(e => (
                                                    <div key={e.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-[2rem] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-blue-600 shadow-sm">{e.course?.subject?.credit}</div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-700 text-lg">{e.course?.subject?.subjectName}</span>
                                                                <span className="text-[10px] font-black text-slate-400 uppercase">Mã: {e.course?.subject?.subjectCode}</span>
                                                            </div>
                                                        </div>
                                                        <p className="font-black text-slate-800">{(e.course?.subject?.credit * PRICE_PER_CREDIT).toLocaleString()}đ</p>
                                                    </div>
                                                ))}
                                                {items.length === 0 && <p className="text-center text-slate-400 italic py-4">Chưa có môn học trong kỳ này.</p>}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                <div className="lg:col-span-4 sticky top-10">
                    <motion.div key={activeSemester} initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-50">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Hóa đơn kỳ:</p>
                                <h3 className="font-[1000] text-blue-600 uppercase italic text-xl">{financialReport?.semester}</h3>
                            </div>
                            <CreditCard className="text-slate-200" size={32} />
                        </div>
                        
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className={`text-6xl font-[1000] tracking-tighter ${financialReport?.realBalance > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {(financialReport?.realBalance || 0).toLocaleString()}
                            </span>
                            <span className="text-2xl font-black text-slate-300">đ</span>
                        </div>

                        {financialReport?.isModified && financialReport?.realBalance > 0 && (
                            <div className="mb-6 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-3">
                                <AlertCircle className="text-orange-500" size={18} />
                                <p className="text-[9px] font-bold text-orange-700 uppercase leading-tight">Phát hiện môn học mới đăng ký chưa quyết toán.</p>
                            </div>
                        )}

                        <div className="space-y-4 mb-10 py-8 border-t border-b border-dashed border-slate-100 text-sm font-bold uppercase tracking-tighter">
                            <div className="flex justify-between text-slate-400"><span>Tổng thực tế:</span><span className="text-slate-800">{(financialReport?.actualTotal || 0).toLocaleString()}đ</span></div>
                            <div className="flex justify-between text-slate-400"><span>Đã nộp (DB):</span><span className="text-emerald-600">{(financialReport?.amountPaid || 0).toLocaleString()}đ</span></div>
                            <div className="flex justify-between pt-4 border-t border-slate-50"><span>Tình trạng:</span>
                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black ${financialReport?.realBalance <= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {financialReport?.realBalance <= 0 ? 'ĐÃ HOÀN TẤT' : 'CHỜ THANH TOÁN'}
                                </span>
                            </div>
                        </div>

                        {financialReport?.realBalance > 0 ? (
                            <button onClick={handleVNPayPayment} disabled={isRedirecting} className="w-full bg-slate-900 text-white font-[1000] py-6 rounded-[2.2rem] flex items-center justify-center gap-4 hover:bg-blue-700 transition-all shadow-xl active:scale-95">
                                {isRedirecting ? <Loader2 className="animate-spin" /> : "THANH TOÁN NGAY"}
                            </button>
                        ) : (
                            <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-center text-white shadow-xl">
                                <CheckCircle2 className="mx-auto mb-3" size={40} />
                                <p className="font-black text-xs uppercase tracking-widest leading-relaxed">Học phí kỳ này <br/>đã hoàn tất</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}