import React, { useState, useEffect } from "react";
import api from "../../Service/api";
// Import bộ thông báo anh vừa gửi
import { alertService } from "../../utils/swalUtils"; 
import { 
  CalendarPlus, BookOpen, Layers, MapPin, Loader2, 
  ArrowRight, Book, Monitor, Info, 
  CheckCircle2
} from 'lucide-react';

export default function AdminScheduleGenerator() {
  const [courses, setCourses] = useState([]);
  const [terms, setTerms] = useState([]);
  const [rooms, setRooms] = useState([]);
  
  const [formData, setFormData] = useState({
    courseId: "",
    termId: "",
    theoryRoomId: "",
    theoryDay: "1",
    theoryStart: "1",
    hasPractice: false,
    practiceRoomId: "",
    practiceDay: "4",
    practiceStart: "6"
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 1. Tải dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const [resCourses, resTerms, resRooms] = await Promise.all([
          api.get("/courses"),
          api.get("/academic-terms"),
          api.get("/rooms/all")
        ]);
        setCourses(resCourses.data);
        setTerms(resTerms.data);
        setRooms(resRooms.data);
      } catch (err) {
        alertService.error("Không thể tải danh sách dữ liệu!");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  // 2. Xử lý gửi Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Dùng Confirm của anh để hỏi trước khi rải (vì rải lịch 15 tuần rất quan trọng)
    const result = await alertService.confirmDelete(
        "Xác nhận rải lịch?", 
        "Hệ thống sẽ tự động tạo lịch học cho toàn bộ học kỳ dựa trên cấu hình này."
    );

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const params = {
        courseId: parseInt(formData.courseId),
        termId: parseInt(formData.termId),
        theoryRoomId: parseInt(formData.theoryRoomId),
        theoryDay: parseInt(formData.theoryDay),
        theoryStart: parseInt(formData.theoryStart),
      };

      if (formData.hasPractice) {
        params.practiceRoomId = parseInt(formData.practiceRoomId);
        params.practiceDay = parseInt(formData.practiceDay);
        params.practiceStart = parseInt(formData.practiceStart);
      }

      const response = await api.post("/schedule/generate", null, { params });

      // Dùng Success Modal to vật vã cho sướng
      alertService.successModal("THÀNH CÔNG", response.data || "Lịch học đã được rải đều 15 tuần!");
      
      // Reset form nhẹ
      setFormData(prev => ({ ...prev, courseId: "", hasPractice: false }));
    } catch (err) {
      // Dùng Toast Error đỏ của anh
      alertService.error(err.response?.data || "Lỗi trùng lịch hoặc thiếu dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  if (fetching) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={50} />
        <span className="font-black text-slate-400 uppercase tracking-tighter">Đang đồng bộ dữ liệu...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-t-[2.5rem] p-10 border-b border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <CalendarPlus size={150} />
          </div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="p-4 bg-blue-600 text-white rounded-3xl shadow-lg shadow-blue-200">
              <CalendarPlus size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Rải lịch tự động</h1>
              <p className="text-slate-500 font-bold italic">Phân bổ lịch Lý thuyết & Thực hành thông minh</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="bg-white rounded-b-[2.5rem] shadow-2xl p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* PHẦN 1: CHỌN MÔN VÀ ĐỢT HỌC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className="text-xs font-black text-slate-400 uppercase mb-3 block tracking-widest ml-2 group-focus-within:text-blue-600 transition-colors">Lớp Học Phần & Giảng Viên</label>
                <select name="courseId" required className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold text-slate-700 focus:border-blue-500 focus:bg-white outline-none transition-all appearance-none" 
                  value={formData.courseId} onChange={handleChange}>
                  <option value="">-- Chọn lớp học phần --</option>
                  {courses.map(c => <option key={c.id} value={c.id}>[{c.subject?.subjectCode}] {c.subject?.subjectName} - GV: {c.teacher?.fullName}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-3 block tracking-widest ml-2">Học Kỳ / Đợt Học</label>
                <select name="termId" required className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold text-slate-700 focus:border-blue-500 focus:bg-white outline-none transition-all appearance-none"
                  value={formData.termId} onChange={handleChange}>
                  <option value="">-- Chọn đợt --</option>
                  {terms.map(t => <option key={t.id} value={t.id}>{t.termName} (Tuần 1: {new Date(t.startDate).toLocaleDateString('vi-VN')})</option>)}
                </select>
              </div>
            </div>

            {/* PHẦN 2: CẤU HÌNH LÝ THUYẾT */}
            <div className="space-y-6 bg-blue-50/50 p-8 rounded-[2rem] border-2 border-blue-100/50">
              <div className="flex items-center gap-3 text-blue-700 font-black uppercase text-sm tracking-widest">
                <div className="p-2 bg-blue-600 text-white rounded-xl"><Book size={18}/></div>
                Cấu hình buổi Lý thuyết
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-400 uppercase ml-1">Thứ học</label>
                  <select name="theoryDay" className="w-full p-4 bg-white border-2 border-blue-100 rounded-2xl font-black text-blue-800 outline-none" value={formData.theoryDay} onChange={handleChange}>
                    <option value="1">Thứ 2</option><option value="2">Thứ 3</option><option value="3">Thứ 4</option><option value="4">Thứ 5</option><option value="5">Thứ 6</option><option value="6">Thứ 7</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-400 uppercase ml-1">Ca học</label>
                  <select name="theoryStart" className="w-full p-4 bg-white border-2 border-blue-100 rounded-2xl font-black text-blue-800 outline-none" value={formData.theoryStart} onChange={handleChange}>
                    <option value="1">Sáng (T1-5)</option><option value="6">Chiều (T6-10)</option><option value="11">Tối (T11-15)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-400 uppercase ml-1">Phòng Học</label>
                  <select name="theoryRoomId" required className="w-full p-4 bg-white border-2 border-blue-100 rounded-2xl font-black text-blue-800 outline-none" value={formData.theoryRoomId} onChange={handleChange}>
                    <option value="">-- Chọn phòng --</option>
                    {rooms.map(r => <option key={r.id} value={r.id}>{r.roomName}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* PHẦN 3: CẤU HÌNH THỰC HÀNH */}
            <div className={`p-8 rounded-[2rem] border-2 transition-all duration-500 ${formData.hasPractice ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
              <label className="flex items-center gap-4 cursor-pointer group mb-6">
                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${formData.hasPractice ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'}`}>
                    {formData.hasPractice && <CheckCircle2 size={16} />}
                </div>
                <input type="checkbox" name="hasPractice" className="hidden" checked={formData.hasPractice} onChange={handleChange}/>
                <span className="font-black text-slate-700 uppercase tracking-wider group-hover:text-emerald-700">Môn học này có tiết thực hành riêng</span>
              </label>

              {formData.hasPractice && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-500 uppercase ml-1">Thứ học thực hành</label>
                    <select name="practiceDay" className="w-full p-4 bg-white border-2 border-emerald-100 rounded-2xl font-black text-emerald-800 outline-none" value={formData.practiceDay} onChange={handleChange}>
                       <option value="1">Thứ 2</option><option value="2">Thứ 3</option><option value="3">Thứ 4</option><option value="4">Thứ 5</option><option value="5">Thứ 6</option><option value="6">Thứ 7</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-500 uppercase ml-1">Ca học thực hành</label>
                    <select name="practiceStart" className="w-full p-4 bg-white border-2 border-emerald-100 rounded-2xl font-black text-emerald-800 outline-none" value={formData.practiceStart} onChange={handleChange}>
                       <option value="6">Chiều (T6-10)</option><option value="1">Sáng (T1-5)</option><option value="11">Tối (T11-15)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-500 uppercase ml-1">Phòng Thực Hành</label>
                    <select name="practiceRoomId" className="w-full p-4 bg-white border-2 border-emerald-100 rounded-2xl font-black text-emerald-800 outline-none" value={formData.practiceRoomId} onChange={handleChange}>
                      <option value="">-- Chọn phòng máy --</option>
                      {rooms.map(r => <option key={r.id} value={r.id}>{r.roomName}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Info Summary */}
            <div className="bg-slate-800 rounded-3xl p-6 text-slate-300 flex items-start gap-4">
                <Info className="text-blue-400 shrink-0" size={24} />
                <div className="text-sm font-medium">
                    Hệ thống sẽ rải lịch dựa trên <span className="text-white font-bold">Số tiết</span> của môn học (Thường là 15 buổi Theory / 6-12 buổi Practice). Tuần thi sẽ được để trống tự động.
                </div>
            </div>

            <button type="submit" disabled={loading} 
                className="w-full bg-[#003366] text-white py-6 rounded-[2rem] font-black shadow-2xl shadow-blue-900/40 hover:bg-blue-800 active:scale-[0.98] transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] disabled:bg-slate-400 disabled:shadow-none overflow-hidden relative group">
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />}
              <span>{loading ? "Đang ghi dữ liệu..." : "Xác nhận rải lịch toàn khóa"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}