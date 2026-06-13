import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Calendar, MapPin, Star, XCircle, CheckCircle2, Lock, Loader2 } from "lucide-react";
import { AuthContext } from "../../Context/AuthContext";

export default function ActivityList() {
    const [activities, setActivities] = useState([]);
    const { user, loading: authLoading } = useContext(AuthContext);

    useEffect(() => {
        if (!authLoading && user?.studentCode) {
            fetchActivities();
        }
    }, [user, authLoading]);

    const fetchActivities = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/activities/upcoming-with-status/${user.studentCode}`);
            setActivities(res.data);
        } catch (err) {
            toast.error("Không thể tải danh sách hoạt động");
        }
    };

    const toggleRegistration = async (activity) => {
        // Nếu đã hết hạn (expired: true) thì chặn click luôn
        if (activity.expired) {
            toast.error("Hoạt động này đã kết thúc hoặc đã khóa đăng ký!");
            return;
        }

        try {
            if (activity.registered) {
                await axios.delete(`http://localhost:8080/api/activities/unregister/${activity.id}/${user.studentCode}`);
                toast.success("Đã hủy đăng ký thành công");
            } else {
                await axios.post(`http://localhost:8080/api/activities/register/${activity.id}/${user.studentCode}`);
                toast.success("Đăng ký tham gia thành công!");
            }
            
            setActivities(prev => prev.map(a => 
                a.id === activity.id ? { ...a, registered: !a.registered } : a
            ));
        } catch (err) {
            toast.error(err.response?.data || "Thao tác thất bại");
        }
    };

    if (authLoading) return <div className="p-10 text-center font-black uppercase text-slate-400 animate-pulse">Đang đồng bộ dữ liệu...</div>;

    return (
        <div className="p-8 w-full bg-slate-50 min-h-screen font-sans">
            <Toaster />
            <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
                    Sự kiện & Hoạt động
                </h1>
                <p className="text-slate-500 font-medium tracking-tight">Đăng ký tham gia các hoạt động để tích lũy điểm rèn luyện</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activities.map((act) => (
                    <div key={act.id} className={`group relative bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-300 
                        ${act.expired ? 'opacity-70 grayscale-[0.4]' : ''} 
                        ${act.registered && !act.expired ? 'border-blue-500 shadow-blue-100 shadow-2xl scale-[1.01]' : 'border-transparent shadow-sm hover:border-slate-200'}`}>
                        
                        <div className="flex justify-between items-start mb-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider 
                                ${act.expired ? 'bg-slate-400 text-white' : (act.registered ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500')}`}>
                                {act.expired ? 'Đã kết thúc' : (act.registered ? 'Đã đăng ký' : act.criteria?.section || 'Ngoại khóa')}
                            </span>
                            <div className={`flex items-center font-black text-lg ${act.expired ? 'text-slate-400' : 'text-amber-500'}`}>
                                <Star size={20} className={`${act.expired ? '' : 'fill-current'} mr-1`} />
                                +{act.point}
                            </div>
                        </div>

                        <h3 className="text-xl font-black text-slate-800 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                            {act.title}
                        </h3>
                        
                        <p className="text-slate-400 text-sm mb-6 line-clamp-2 italic leading-relaxed">
                            {act.description}
                        </p>

                        <div className="space-y-3 mb-8 text-sm font-bold text-slate-500">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-400"><Calendar size={16}/></div>
                                {new Date(act.startDate).toLocaleDateString("vi-VN")}
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-400"><MapPin size={16}/></div>
                                Hội trường A / Khu trung tâm
                            </div>
                        </div>

                        {/* PHẦN NÚT BẤM ĐÃ FIX ICON LOCK VÀ TEXT */}
                        <button 
                            onClick={() => toggleRegistration(act)}
                            disabled={act.expired}
                            className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                                act.expired 
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-100' 
                                : act.registered 
                                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-2 border-rose-100' 
                                    : 'bg-slate-900 text-white hover:bg-blue-700 shadow-lg shadow-slate-200 active:scale-95'
                            }`}
                        >
                            {/* ƯU TIÊN SỐ 1: NẾU HẾT HẠN (EXPIRED: TRUE) THÌ HIỆN LOCK */}
                            {act.expired ? (
                                <>
                                    <Lock size={18} />
                                    <span>ĐÃ KHÓA ĐĂNG KÝ</span>
                                </>
                            ) : act.registered ? (
                                <>
                                    <XCircle size={18} />
                                    <span>HỦY THAM GIA</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={18} />
                                    <span>ĐĂNG KÝ THAM GIA</span>
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}