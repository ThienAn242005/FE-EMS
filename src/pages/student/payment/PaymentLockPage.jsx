import React, { useContext, useState, useEffect, useMemo } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { LogOut, ChevronRight, Landmark, ReceiptText, Loader2, AlertCircle, BookOpen } from "lucide-react";
import api from "../../../Service/api";
import { useWebSocket } from "../../../hooks/WebSocket"; // 1. IMPORT HOOK
import { alertService } from "../../../utils/swalUtils";

export default function PaymentLockPage() {
    const { user, logoutUser, refreshUserData } = useContext(AuthContext); // Giả sử ông có hàm refreshUserData để tải lại profile
    const [payments, setPayments] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const PRICE_PER_CREDIT = 500000;

    // 2. SỬ DỤNG WEBSOCKET HOOK
    const { subscribe } = useWebSocket(user?.studentCode);

    useEffect(() => {
        // Lắng nghe tín hiệu mở khóa từ Backend
        if (user?.studentCode) {
            subscribe(`/user/${user.studentCode}/queue/status`, (status) => {
                if (status === "UNLOCKED") {
                    alertService.success("Hệ thống đã ghi nhận thanh toán thành công! Đang mở khóa tài khoản...");
                    
                    // 3. TỰ ĐỘNG CẬP NHẬT LẠI CONTEXT ĐỂ GUARD CHO QUA
                    if (refreshUserData) {
                        refreshUserData(); 
                    } else {
                        // Nếu không có hàm refresh thì ép load lại trang cho nhanh
                        window.location.reload();
                    }
                }
            });
        }
    }, [user, subscribe]);

    useEffect(() => {
        const fetchDebtData = async () => {
            if (!user?.studentCode) return;
            try {
                setLoading(true);
                const [payRes, enrollRes] = await Promise.all([
                    api.get(`/payments/student/code/${user.studentCode}`),
                    api.get(`/enrollments/student/${user.studentCode}`)
                ]);
                
                setPayments(payRes.data || []);
                setEnrollments((enrollRes.data || []).filter(e => e.approved === true));
            } catch (err) {
                console.error("Lỗi fetch dữ liệu khóa:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDebtData();
    }, [user]);

    // ... Giữ nguyên phần groupedEnrollments và debtDetails của ông ...
    const groupedEnrollments = useMemo(() => {
        return enrollments.reduce((groups, en) => {
            const sem = en.course?.semester?.name || "Khác";
            if (!groups[sem]) groups[sem] = [];
            groups[sem].push(en);
            return groups;
        }, {});
    }, [enrollments]);

    const debtDetails = useMemo(() => {
        let unpaidSubjects = [];
        let totalDebt = 0;
        payments.forEach(p => {
            const subjectsInSem = groupedEnrollments[p.semester] || [];
            const actualTotal = subjectsInSem.reduce((sum, e) => sum + (e.course?.subject?.credit * PRICE_PER_CREDIT), 0);
            const amountPaid = p.amountPaid || 0;
            if (actualTotal > amountPaid) {
                unpaidSubjects = [...unpaidSubjects, ...subjectsInSem];
                totalDebt += (actualTotal - amountPaid);
            }
        });
        return { unpaidSubjects, totalDebt };
    }, [payments, groupedEnrollments]);

    const formatCurrency = (val) => 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

    if (loading) return (
        <div className="fixed inset-0 z-[9999] bg-slate-900 flex items-center justify-center">
            <Loader2 className="animate-spin text-white" size={40} />
        </div>
    );

    return (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-white rounded-[40px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header, Content và Footer giữ nguyên như cũ */}
                <div className="bg-rose-600 p-8 text-white shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2 bg-white/20 w-fit px-3 py-1 rounded-full border border-white/30">
                                <AlertCircle size={14} className="text-white" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Hệ thống tạm khóa</span>
                            </div>
                            <h1 className="text-3xl font-[1000] uppercase italic tracking-tighter">Học phí quá hạn</h1>
                            <p className="text-sm font-bold opacity-80 mt-1">Vui lòng thanh toán các môn dưới đây để mở khóa tài khoản</p>
                        </div>
                        <Landmark size={48} className="opacity-20" />
                    </div>
                </div>

                <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                        <ReceiptText size={16} /> Chi tiết các môn chưa quyết toán
                    </div>
                    <div className="space-y-3">
                        {debtDetails.unpaidSubjects.map((en, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><BookOpen size={20} /></div>
                                    <div>
                                        <h4 className="font-black text-slate-800 uppercase text-xs">{en.course?.subject?.subjectName}</h4>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{en.course?.semester?.name} • {en.course?.subject?.credit} Tín chỉ</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-900 text-sm">{formatCurrency(en.course?.subject?.credit * PRICE_PER_CREDIT)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 bg-white border-t border-slate-100">
                    <div className="bg-rose-50 p-6 rounded-[32px] border-2 border-dashed border-rose-200 flex items-center justify-between mb-6">
                        <span className="font-black text-rose-800 uppercase text-xs">Tổng nợ cần thanh toán:</span>
                        <span className="text-3xl font-[1000] text-rose-600">{formatCurrency(debtDetails.totalDebt)}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={() => window.location.href = '/student/tuition'} className="py-5 bg-slate-900 hover:bg-rose-600 text-white rounded-[2rem] font-black uppercase text-xs shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                            Đến trang thanh toán <ChevronRight size={18} />
                        </button>
                        <button onClick={logoutUser} className="py-5 bg-slate-100 text-slate-500 rounded-[2rem] font-black uppercase text-xs hover:bg-slate-200 transition-all">
                            Đăng xuất tài khoản
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}