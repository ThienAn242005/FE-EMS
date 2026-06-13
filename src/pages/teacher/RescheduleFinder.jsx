import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Service/api";
import { alertService } from "../../utils/swalUtils";
import { AuthContext } from "../../Context/AuthContext"; // Import AuthContext
import { 
  Calendar, Clock, MapPin, ChevronRight, RotateCcw, 
  AlertTriangle, Loader2, ArrowLeft, ShieldCheck, Users 
} from 'lucide-react';

export default function RescheduleFinder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext); // Lấy user định danh
  
  const [originalSchedule, setOriginalSchedule] = useState(null);
  const [suggestedSlots, setSuggestedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const formatViewDate = (d) => {
    if (!d) return "";
    if (typeof d !== "string") return "";
    if (d.includes("/")) return d;
    const parts = d.split("-");
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : d;
  };

  useEffect(() => {
    const fetchData = async () => {
      // Chỉ chạy khi auth đã load xong và có mã giảng viên
      if (!authLoading && user?.teacherCode) {
        try {
          setLoading(true);

          // 1. Lấy toàn bộ lịch của GV này theo teacherCode thay vì ID 22
          const resList = await api.get(`/teachers/schedule/${user.teacherCode}`);
          const current = resList.data.find(s => s.id === parseInt(id, 10));
          
          if (current) {
            setOriginalSchedule(current);
          } else {
            alertService.error("Buổi dạy không thuộc quyền quản lý của bạn!");
            navigate("/teacher/schedule");
            return;
          }

          // 2. Quét các ô lịch trống khả dụng cho buổi dạy này
          const resSlots = await api.get(`/teachers/available-slots/${id}`);
          setSuggestedSlots(resSlots.data || []);

        } catch (err) {
          console.error("Lỗi đồng bộ hệ thống:", err);
          alertService.error("Không thể quét dữ liệu lịch trống!");
        } finally {
          setLoading(false);
        }
      }
    };

    if (id) fetchData();
  }, [id, navigate, user, authLoading]);

  const handleConfirmProcess = async (slot) => {
    const confirm = await alertService.confirmDelete(
      "Xác nhận thay đổi lịch dạy?",
      `Hệ thống sẽ dời sang: ${formatViewDate(slot.date)} | Giờ: ${slot.startTime} - ${slot.endTime} | Phòng: ${slot.roomName}`
    );

    if (confirm.isConfirmed) {
      setSubmitting(true);
      try {
        await api.post("/teachers/postpone-reschedule", null, {
          params: { 
            scheduleId: id, 
            newDate: slot.date, 
            newStartP: slot.startPeriod, 
            newRoomId: slot.roomId 
          }
        });
        
        await alertService.success("THÀNH CÔNG", "Lịch dạy đã dời. Toàn bộ sinh viên đã nhận được thông báo.");
        navigate("/teacher/schedule");
      } catch (err) {
        alertService.error(err.response?.data || "Xung đột lịch phát sinh ngoài dự kiến!");
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Màn hình loading check bảo mật
  if (authLoading || loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-blue-500">
      <Loader2 className="animate-spin mb-4" size={56} />
      <span className="font-black uppercase tracking-[0.3em] animate-pulse">VUST Security Check</span>
      <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-widest">Đang kiểm tra xung đột thời gian thực cho {user?.teacherCode}...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fbfe] font-sans pb-20">
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40 shadow-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-3 text-slate-500 font-black text-[10px] uppercase transition-all hover:text-blue-600"
        >
          <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-blue-50 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Quay lại bảng lịch
        </button>
        <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl text-[10px] font-black uppercase border border-emerald-100 shadow-sm">
          <ShieldCheck size={14} /> Hệ thống đồng bộ sinh viên rảnh
        </div>
      </header>

      <main className="p-10 space-y-10 w-full max-w-none">
        {/* Card thông tin buổi dạy bị hoãn */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-2xl border-l-[15px] border-red-500 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-red-50/50 to-transparent pointer-events-none"></div>
          <AlertTriangle className="absolute -right-10 -top-10 text-red-500/5 rotate-12" size={300} />
          
          <div className="relative z-10 space-y-4">
            <span className="bg-red-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-xl tracking-widest inline-block shadow-sm shadow-red-200">Postpone Action</span>
            <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter leading-tight">
              {originalSchedule?.subject || "NULL_SUBJECT"}
            </h2>
            <div className="flex flex-wrap gap-10 font-bold text-slate-400 text-base italic uppercase">
              <span className="flex items-center gap-3"><Calendar size={20} className="text-red-400"/> {formatViewDate(originalSchedule?.date)}</span>
              <span className="flex items-center gap-3"><Clock size={20} className="text-red-400"/> {originalSchedule?.startTime} - {originalSchedule?.endTime}</span>
              <span className="flex items-center gap-3"><MapPin size={20} className="text-red-400"/> {originalSchedule?.room}</span>
            </div>
          </div>
        </section>

        {/* Grid các ô lịch trống */}
        <section className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-200 overflow-hidden w-full">
          <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">Ô Lịch Bù Khả Dụng</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <Users size={14} className="text-blue-500" /> Dữ liệu đã lọc sạch xung đột 3 bên (GV - Phòng - SV)
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="p-5 bg-white border border-slate-200 rounded-[2rem] text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95"
            >
              <RotateCcw size={24} />
            </button>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {suggestedSlots.length > 0 ? (
              suggestedSlots.map((slot, i) => (
                <button 
                  key={i} 
                  onClick={() => handleConfirmProcess(slot)} 
                  className="group relative flex flex-col p-10 bg-white rounded-[3rem] border-2 border-slate-100 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100/50 transition-all text-left overflow-hidden"
                >
                  <div className="flex items-center gap-6 mb-8 italic">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner transform group-hover:rotate-6">
                      <Calendar size={32} />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{formatViewDate(slot.date)}</p>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{slot.dayOfWeek}</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto space-y-5 pt-8 border-t border-slate-50 group-hover:border-blue-50 transition-colors font-bold uppercase">
                    <div className="flex items-center justify-between text-slate-700">
                      <div className="flex items-center gap-3">
                        <Clock size={18} className="text-blue-500" />
                        <span className="text-lg tracking-tighter">{slot.startTime} - {slot.endTime}</span>
                      </div>
                      <span className="text-[9px] px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 tracking-tighter">Tiết {slot.startPeriod}</span>
                    </div>
                    <div className="flex items-center gap-3 text-emerald-700 text-sm italic tracking-tight">
                      <MapPin size={18} className="text-emerald-500" /> {slot.roomName}
                    </div>
                  </div>
                  <ChevronRight className="absolute bottom-10 right-10 text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" size={28} />
                </button>
              ))
            ) : (
              <div className="col-span-full py-32 flex flex-col items-center text-center space-y-6 opacity-30 italic">
                <ShieldCheck size={100} strokeWidth={1} />
                <p className="text-xl font-black uppercase tracking-widest">Không tìm thấy ô lịch trống nào khả dụng</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Overlay xử lý thuật toán dời lịch */}
      {submitting && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex flex-col items-center justify-center text-white p-10 text-center">
          <Loader2 className="animate-spin mb-8 text-blue-500" size={80} />
          <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-4">VUST ENGINE ACTIVE</h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs max-w-sm leading-loose">
            Hệ thống đang đồng bộ lịch dạy và rải thông báo Academic tới tài khoản sinh viên lớp học phần...
          </p>
        </div>
      )}
    </div>
  );
}