import React, { useState, useEffect, useMemo, useContext } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Save, Send, AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { AuthContext } from "../../Context/AuthContext";

export default function TrainingPoint() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [evaluation, setEvaluation] = useState(null);
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    const semesterId = 6;

    useEffect(() => {
        if (!authLoading && user?.studentCode) {
            fetchData();
        }
    }, [user, authLoading]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = user.token || localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // 1. Khởi tạo hoặc lấy phiếu (Dùng MSSV)
            const res = await axios.get(`http://localhost:8080/api/training-points/init/${user.studentCode}/${semesterId}`, config);
            setEvaluation(res.data);

            // 2. Kiểm tra ID an toàn trước khi lấy chi tiết
            if (res.data && res.data.id) {
                const detailRes = await axios.get(`http://localhost:8080/api/training-points/details/${res.data.id}`, config);
                setDetails(detailRes.data);
            } else {
                setDetails([]);
            }
        } catch (err) {
            console.error(err);
            toast.error("Không thể tải bảng điểm rèn luyện");
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        if (!evaluation?.id) {
            toast.error("Vui lòng nhấn 'Lưu nháp' để khởi tạo phiếu trước!");
            return;
        }
        try {
            setLoading(true);
            const token = user.token || localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const res = await axios.post(`http://localhost:8080/api/training-points/sync/${evaluation.id}`, {}, config);
            setEvaluation(res.data);
            
            // Lấy lại chi tiết sau khi đồng bộ
            const detailRes = await axios.get(`http://localhost:8080/api/training-points/details/${res.data.id}`, config);
            setDetails(detailRes.data);
            toast.success("Đã đồng bộ điểm hệ thống mới nhất!");
        } catch (err) {
            toast.error("Lỗi khi đồng bộ dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const totals = useMemo(() => {
        const student = details.reduce((sum, d) => sum + (Number(d.studentPoint) || 0), 0);
        return { student: Math.min(100, student) };
    }, [details]);

    const handlePointChange = (id, field, value, max = 0) => {
        setDetails(prev => prev.map(d => {
            if (d.id === id) {
                if (field === 'studentPoint') {
                    const val = Math.min(max, Math.max(0, parseInt(value) || 0));
                    return { ...d, [field]: val };
                }
                return { ...d, [field]: value };
            }
            return d;
        }));
    };

    const handleSave = async (isSubmit = false) => {
        try {
            const token = user.token || localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const res = await axios.post(
                `http://localhost:8080/api/training-points/save/${user.studentCode}/${semesterId}`,
                details,
                config
            );

            setEvaluation(res.data);
            toast.success(isSubmit ? "Đã nộp phiếu thành công!" : "Đã lưu bản nháp!");

            // Lấy lại chi tiết dựa trên ID trả về từ res.data
            if (res.data && res.data.id) {
                const detailRes = await axios.get(`http://localhost:8080/api/training-points/details/${res.data.id}`, config);
                setDetails(detailRes.data);
            }

            if (isSubmit) fetchData();
        } catch (err) {
            toast.error("Lỗi khi lưu dữ liệu");
        }
    };

    if (authLoading || loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse uppercase tracking-widest">Đang đồng bộ dữ liệu rèn luyện...</div>;

    return (
        <div className="p-6 w-full bg-[#f8fafc] min-h-screen">
            <Toaster />

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Phiếu điểm rèn luyện</h1>
                    <p className="text-slate-500 font-medium">Học kỳ {semesterId} | MSSV: {user?.studentCode}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSync}
                        className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-100 transition-all border border-emerald-100"
                    >
                        <RefreshCw size={18} /> LÀM MỚI HỆ THỐNG
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard label="Tự đánh giá" value={totals.student} color="text-blue-600" />
                <StatCard label="CVHT xác nhận" value={evaluation?.totalPointAdvisor || 0} color="text-slate-400" />
                <StatCard label="Khoa xác nhận" value={evaluation?.totalPointDept || 0} color="text-slate-800" isFinal />
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <tr>
                            <th className="p-6 w-1/2">Tiêu chí đánh giá</th>
                            <th className="p-6 text-center">Tối đa</th>
                            <th className="p-6 text-center w-32">SV Chấm</th>
                            <th className="p-6">Ghi chú / Minh chứng</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {details.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-24 text-center text-slate-400">
                                    <AlertCircle className="mx-auto mb-4 opacity-20" size={48} />
                                    <p className="font-bold text-lg text-slate-300">Chưa có dữ liệu cho học kỳ này</p>
                                    <p className="text-sm italic uppercase tracking-tighter">Hãy nhấn "Lưu nháp" để khởi tạo bảng tiêu chí</p>
                                </td>
                            </tr>
                        ) : details.map((d) => {
                            const isAuto = d.criteria.section === 'I.1' ||
                                d.criteria.section === 'II.3' ||
                                d.studentNote?.includes("Hệ thống");

                            return (
                                <tr key={d.id} className={d.criteria.parent === null ? 'bg-slate-50/50 font-bold' : 'hover:bg-slate-50/30 transition-colors'}>
                                    <td className={`p-4 ${d.criteria.parent ? 'pl-10 text-slate-600' : 'text-slate-900 font-black text-base'}`}>
                                        {d.criteria.section}. {d.criteria.content}
                                    </td>
                                    <td className="p-4 text-center text-slate-400 font-mono italic">
                                        {d.criteria.maxPoint}
                                    </td>
                                    <td className="p-4">
                                        {d.criteria.parent !== null && (
                                            <input
                                                type="number"
                                                value={d.studentPoint || 0}
                                                onChange={(e) => handlePointChange(d.id, 'studentPoint', e.target.value, d.criteria.maxPoint)}
                                                disabled={evaluation?.status === 'SUBMITTED' || isAuto}
                                                className={`w-full p-2 text-center font-black rounded-xl border-2 transition-all outline-none ${isAuto
                                                        ? 'bg-slate-100 text-slate-400 border-transparent cursor-not-allowed'
                                                        : 'text-blue-700 bg-white border-slate-100 focus:border-blue-400 shadow-sm'
                                                    }`}
                                            />
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            <input
                                                type="text"
                                                value={d.studentNote || ""}
                                                onChange={(e) => handlePointChange(d.id, 'studentNote', e.target.value)}
                                                placeholder="Nhập ghi chú..."
                                                disabled={evaluation?.status === 'SUBMITTED' || isAuto}
                                                className="w-full bg-transparent text-xs text-slate-500 outline-none italic border-b border-transparent focus:border-slate-200"
                                            />
                                            {isAuto && (
                                                <span className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-tighter">
                                                    <ShieldCheck size={12} /> Dữ liệu hệ thống
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="p-8 bg-slate-50 border-t flex justify-end gap-4">
                    <button
                        onClick={() => handleSave(false)}
                        disabled={evaluation?.status === 'SUBMITTED'}
                        className="px-8 py-3 bg-white border border-slate-300 rounded-2xl font-black text-slate-600 flex items-center gap-2 hover:bg-slate-100 transition-all disabled:opacity-50"
                    >
                        <Save size={20} /> LƯU BẢN NHÁP
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        disabled={evaluation?.status === 'SUBMITTED' || details.length === 0}
                        className="px-8 py-3 bg-blue-700 text-white rounded-2xl font-black flex items-center gap-2 hover:bg-blue-800 shadow-xl shadow-blue-200 transition-all disabled:opacity-50"
                    >
                        <Send size={20} /> NỘP PHIẾU NGAY
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, color, isFinal }) {
    return (
        <div className={`bg-white p-6 rounded-[2rem] border-2 transition-all ${isFinal ? 'border-blue-600 shadow-lg' : 'border-slate-100'}`}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-4xl font-black ${color}`}>{value}<span className="text-sm font-bold text-slate-300 ml-1 italic">đ</span></p>
        </div>
    );
}