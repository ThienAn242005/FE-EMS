import React, { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Service/api";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { AuthContext } from "../../Context/AuthContext";

const TIME_SLOTS = [
  { label: 'Sáng', start: '07:30', end: '11:30' },
  { label: 'Chiều', start: '12:30', end: '16:30' },
  { label: 'Tối', start: '17:00', end: '20:30' },
];

const WEEK_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const DAY_LABELS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

const ScheduleCard = ({ entry }) => {
  const navigate = useNavigate();
  const isPostponed = entry.status === 'POSTPONED';
  const isLab = entry.subject?.toLowerCase().includes("thực hành");

  const cardBg = isPostponed ? 'bg-slate-200' : (isLab ? 'bg-[#70c137]' : 'bg-[#d0dae3]');
  const textColor = isPostponed ? 'text-slate-500' : (isLab ? 'text-white' : 'text-[#003366]');

  return (
    <div className={`${cardBg} ${textColor} p-3 rounded-md border border-slate-400/50 mb-2 shadow-sm text-[12px] transition-all ${isPostponed ? 'opacity-60 grayscale' : ''}`}>
      <div className="font-bold uppercase mb-2 border-b border-black/10 pb-1 italic">
        {entry.subject} {isPostponed && "(ĐÃ HOÃN)"}
      </div>

      <div className="space-y-1">
        <p className="font-semibold opacity-90">{entry.code}</p>
        <p><span className="opacity-70">Tiết:</span> <span className="font-bold">{entry.startPeriod} - {entry.endPeriod}</span></p>
        <p><span className="opacity-70">Giờ:</span> <span className="font-medium">{entry.startTime} - {entry.endTime}</span></p>
        <p><span className="opacity-70">Phòng:</span> <span className="font-black text-red-600">{entry.room}</span></p>

        {!isPostponed && (
          <>
            <p onClick={() => navigate(`/teacher/attendance/${entry.id}`)} className="text-[10px] text-blue-800 font-bold mt-2 underline cursor-pointer">
              Bấm để điểm danh →
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/teacher/reschedule-finder/${entry.id}`);
              }}
              className="mt-3 w-full py-2 bg-white border border-red-300 rounded text-[10px] font-black text-red-600 uppercase flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
              <AlertCircle size={12} /> Hoãn & Tìm lịch bù
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default function TeacherSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user, loading: authLoading } = useContext(AuthContext);

  const weekDateStrings = useMemo(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayStr = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${dayStr}`;
    });
  }, [currentDate]);

  const weekDatesFormatted = useMemo(() => {
    return weekDateStrings.map(dateStr => {
      const [y, m, d] = dateStr.split('-');
      return `${d}/${m}/${y}`;
    });
  }, [weekDateStrings]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!authLoading && user?.teacherCode) {
        try {
          setLoading(true);
          const { data } = await api.get(`/teachers/schedule/${user.teacherCode}`);
          setSchedule(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Lỗi fetch:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSchedule();
  }, [user, authLoading]);

  const scheduleGrid = useMemo(() => {
    const grid = TIME_SLOTS.map(() => WEEK_DAYS.map(() => []));
    schedule.forEach(entry => {
      const dayIdx = weekDateStrings.indexOf(entry.date);
      const slotIdx = TIME_SLOTS.findIndex(s =>
        entry.startTime >= s.start && entry.startTime < s.end
      );
      if (dayIdx !== -1 && slotIdx !== -1) {
        grid[slotIdx][dayIdx].push(entry);
      }
    });
    return grid;
  }, [schedule, weekDateStrings]);

  const changeWeek = (days) => {
    setCurrentDate(prev => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + days);
      return next;
    });
  };

  if (authLoading || loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="w-full border-b border-slate-200">
        <div className="flex items-center justify-between p-4 bg-white">
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Lịch dạy giảng viên theo tuần</h2>
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 ring-blue-500"
              value={currentDate.toLocaleDateString('en-CA')}
              onChange={(e) => { if (e.target.value) setCurrentDate(new Date(e.target.value)) }}
            />
            <button onClick={() => setCurrentDate(new Date())} className="bg-[#007bff] text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-700">Hiện tại</button>
            <button onClick={() => changeWeek(-7)} className="bg-[#007bff] text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"><ChevronLeft size={18} /></button>
            <button onClick={() => changeWeek(7)} className="bg-[#007bff] text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"><ChevronRight size={18} /></button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse table-fixed border-l-0 border-r-0">
            <thead>
              <tr className="bg-[#f8fbfe]">
                <th className="border border-slate-200 p-4 text-[#00558d] font-bold w-32 text-sm uppercase">Ca học</th>
                {DAY_LABELS.map((day, i) => (
                  <th key={day} className="border border-slate-200 p-3 text-[#00558d] text-center">
                    <div className="font-bold text-sm uppercase">{day}</div>
                    <div className="text-[11px] font-normal text-slate-500 mt-1">{weekDatesFormatted[i]}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, sIdx) => (
                <tr key={slot.label}>
                  <td className="border border-slate-200 p-4 text-center font-bold text-slate-600 bg-[#fcfcfc] text-sm">
                    {slot.label}
                  </td>
                  {WEEK_DAYS.map((_, dIdx) => (
                    <td key={dIdx} className="border border-slate-200 p-2 align-top h-[280px] bg-white transition-colors hover:bg-slate-50/50">
                      {scheduleGrid[sIdx][dIdx].map((entry, idx) => (
                        <ScheduleCard key={idx} entry={entry} />
                      ))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}