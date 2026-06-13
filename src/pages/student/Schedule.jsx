import React, { useState, useEffect, useMemo, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

const API_BASE_URL = "http://localhost:8080/api";

const TIME_SLOTS = [
  { label: 'Sáng', start: '07:30', end: '11:30', bg: 'bg-[#fffdec]' },
  { label: 'Chiều', start: '12:30', end: '16:30', bg: 'bg-[#fffdec]' },
  { label: 'Tối', start: '17:00', end: '20:30', bg: 'bg-[#fffdec]' },
];

const WEEK_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const DAY_LABELS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

export default function StudentSchedule() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [schedule, setSchedule] = useState([]);
  const [exams, setExams] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

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
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dayStr = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${dayStr}`;
    });
  }, [currentDate]);

  const weekDatesFormatted = useMemo(() => {
    return weekDateStrings.map(dateStr => {
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    });
  }, [weekDateStrings]);

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading || !user) return;

      try {
        setLoading(true);
        const token = user.token || localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const studentIdentifier = user.studentCode || user.username;
        
        const [schRes, exRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/student/code/${studentIdentifier}`, config),
          axios.get(`${API_BASE_URL}/exams/student/${user.id || 0}`, config)
        ]);
        
        setSchedule(Array.isArray(schRes.data) ? schRes.data : []);
        setExams(Array.isArray(exRes.data) ? exRes.data : []);
      } catch (err) {
        console.error("Lỗi fetch lịch học:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  const scheduleGrid = useMemo(() => {
    const grid = TIME_SLOTS.map(() => WEEK_DAYS.map(() => []));
    
    schedule.forEach(entry => {
      const dayIdx = weekDateStrings.indexOf(entry.date);
      const slotIdx = TIME_SLOTS.findIndex(s => entry.startTime >= s.start && entry.startTime < s.end);
      if (dayIdx !== -1 && slotIdx !== -1) {
        grid[slotIdx][dayIdx].push({ ...entry, isExam: false });
      }
    });

    exams.forEach(exam => {
      const dayIdx = weekDateStrings.indexOf(exam.examDate);
      const slotIdx = TIME_SLOTS.findIndex(s => exam.startTime >= s.start && exam.startTime < s.end);
      if (dayIdx !== -1 && slotIdx !== -1) {
        grid[slotIdx][dayIdx].push({ ...exam, isExam: true });
      }
    });

    return grid;
  }, [schedule, exams, weekDateStrings]);

  const changeWeek = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  if (authLoading || loading) return <div className="p-10 text-center font-bold text-blue-800">ĐANG TẢI DỮ LIỆU...</div>;

  return (
    <div className="w-full bg-[#f4f7f9] min-h-screen p-4">
      <div className="max-w-[1400px] mx-auto bg-white shadow-md border border-slate-200">
        <div className="flex flex-wrap items-center justify-end p-4 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              className="border p-1.5 text-sm rounded outline-none"
              value={currentDate.toISOString().split('T')[0]}
              onChange={(e) => setCurrentDate(new Date(e.target.value))}
            />
            <button onClick={() => setCurrentDate(new Date())} className="bg-[#007bff] text-white px-3 py-1.5 text-sm rounded hover:bg-blue-600 transition-colors">Hiện tại</button>
            <button onClick={() => changeWeek(-7)} className="bg-[#007bff] text-white px-3 py-1.5 text-sm rounded hover:bg-blue-600 transition-colors">{'< Trở về'}</button>
            <button onClick={() => changeWeek(7)} className="bg-[#007bff] text-white px-3 py-1.5 text-sm rounded hover:bg-blue-600 transition-colors">{'Tiếp >'}</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f8fbfe]">
                <th className="border border-slate-200 p-3 text-[#00558d] font-bold w-20">Ca học</th>
                {DAY_LABELS.map((day, i) => (
                  <th key={day} className="border border-slate-200 p-3 text-[#00558d] text-center min-w-[160px]">
                    <div className="font-bold">{day}</div>
                    <div className="text-[12px] font-normal">{weekDatesFormatted[i]}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, sIdx) => (
                <tr key={slot.label}>
                  <td className={`border border-slate-200 p-4 text-center font-bold text-slate-700 ${slot.bg}`}>
                    {slot.label}
                  </td>
                  {WEEK_DAYS.map((_, dIdx) => (
                    <td key={dIdx} className="border border-slate-200 p-1.5 align-top h-[220px] bg-[#fdfdfd]">
                      {scheduleGrid[sIdx][dIdx].map((entry, idx) => (
                        <CourseCard key={idx} entry={entry} />
                      ))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex flex-wrap gap-6 border-t border-slate-100 bg-[#fcfcfc]">
            <LegendItem color="bg-[#d0dae3]" label="Lịch học lý thuyết" />
            <LegendItem color="bg-[#70c137]" label="Lịch học thực hành" />
            <LegendItem color="bg-[#ffff99]" label="Lịch thi" />
            <LegendItem color="bg-[#e2e8f0]" label="Lịch tạm hoãn" />
        </div>
      </div>
    </div>
  );
}

const CourseCard = ({ entry }) => {
  if (entry.isExam) {
    return (
      <div className="bg-[#ffff99] p-3 rounded shadow-sm text-[13px] border border-red-300 h-full flex flex-col text-red-800 mb-1">
        <div className="font-bold mb-1 leading-tight uppercase">{entry.course?.subject?.subjectName}</div>
        <div className="text-[11px] font-bold">Hình thức: {entry.examType}</div>
        <div className="mt-2 font-medium">Giờ thi: <span className="font-bold">{entry.startTime.substring(0, 5)}</span></div>
        <div>Phòng thi: <span className="font-bold text-red-600">{entry.room?.roomName}</span></div>
      </div>
    );
  }

  const isPostponed = entry.status === 'POSTPONED' || entry.isPostponed === true;
  const isLab = entry.course?.subject?.subjectName?.toLowerCase().includes("thực hành") || 
                entry.room?.roomType === 'THỰC HÀNH' || entry.sessionType === 'PRACTICE';
  
  let cardColor = isLab ? 'bg-[#70c137] text-white' : 'bg-[#d0dae3] text-[#003366]';
  let labelColor = isLab ? 'text-white' : 'text-red-600';

  if (isPostponed) {
    cardColor = 'bg-[#e2e8f0] text-slate-500 italic';
    labelColor = 'text-slate-500';
  }

  return (
    <div className={`${cardColor} p-3 rounded shadow-sm text-[13px] border border-slate-300 h-full flex flex-col mb-1 relative overflow-hidden`}>
      {isPostponed && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] px-1.5 font-bold uppercase not-italic">
          Đã hoãn
        </div>
      )}
      <div className="font-bold mb-1 leading-tight uppercase">{entry.course?.subject?.subjectName}</div>
      <div className="text-[11px] opacity-90">{entry.course?.sectionCode}</div>
      <div className="mt-2 font-medium">Giờ: {entry.startTime.substring(0, 5)} - {entry.endTime.substring(0, 5)}</div>
      <div>Phòng: <span className={`font-bold ${labelColor}`}>{entry.room?.roomName}</span></div>
      <div>GV: <span className={`font-bold ${labelColor}`}>{entry.teacher?.fullName}</span></div>
    </div>
  );
};

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
    <div className={`w-8 h-4 ${color} border border-slate-300`}></div>
    <span>{label}</span>
  </div>
);