import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Save, FileUp, CheckCircle, Loader2, Search } from 'lucide-react';
import { AuthContext } from "../../Context/AuthContext";

const TeacherGrading = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const teacherCode = user?.teacherCode;

  // 1. Load danh sách lớp khi vào trang
  useEffect(() => {
    const fetchCourses = async () => {
      if (!teacherCode) return;
      try {
        const { data } = await axios.get(`http://localhost:8080/api/teachers/${teacherCode}/dashboard-stats`);
        setCourses(data.upcomingClasses || []);
      } catch (err) {
        console.error("Failed to fetch courses");
      }
    };
    fetchCourses();
  }, [teacherCode]);

  // 2. Load danh sách sinh viên & ĐIỂM CŨ TỪ DATABASE
  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    
    if (!courseId) {
      setStudents([]);
      setGrades({});
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:8080/api/teachers/course/${courseId}/students`);
      setStudents(data);

      const initialGrades = {};
      data.forEach(s => {
        initialGrades[s.enrollmentId] = {
          midTerm: s.midTerm !== null ? s.midTerm : '',
          finalTerm: s.finalTerm !== null ? s.finalTerm : '',
          assignment: s.assignment !== null ? s.assignment : ''
        };
      });
      setGrades(initialGrades);
    } catch (err) {
      alert("Không thể tải danh sách sinh viên hoặc điểm cũ");
    } finally {
      setLoading(false);
    }
  };

  // 3. Xử lý nhập điểm trực tiếp
  const handleInputChange = (enId, field, value) => {
    if (value !== '' && (parseFloat(value) < 0 || parseFloat(value) > 10)) return;
    
    setGrades(prev => ({
      ...prev,
      [enId]: { ...prev[enId], [field]: value }
    }));
  };

  // 4. Import Excel
  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);

      const updatedGrades = { ...grades };
      let count = 0;

      data.forEach(row => {
        const student = students.find(s => s.studentCode === String(row.MaSV));

        if (student && student.enrollmentId) {
          const enId = student.enrollmentId;
          updatedGrades[enId] = {
            midTerm: row.MidTerm ?? row.midTerm ?? '', 
            finalTerm: row.FinalTerm ?? row.finalTerm ?? '',
            assignment: row.Assignment ?? row.assignment ?? ''
          };
          count++;
        }
      });

      setGrades(updatedGrades);
      alert(`Đã nạp điểm thành công cho ${count} sinh viên từ Excel!`);
    };
    reader.readAsBinaryString(file);
    e.target.value = null; 
  };

  // 5. Lưu bảng điểm xuống DB
  const handleSubmit = async () => {
    if (!selectedCourse) return;
    setSaving(true);
    try {
      const payload = Object.entries(grades).map(([id, val]) => ({
        enrollmentId: parseInt(id),
        midTerm: val.midTerm === '' ? 0 : parseFloat(val.midTerm),
        finalTerm: val.finalTerm === '' ? 0 : parseFloat(val.finalTerm),
        assignment: val.assignment === '' ? 0 : parseFloat(val.assignment)
      }));
      
      await axios.post(`http://localhost:8080/api/teachers/grading/save-multiple`, payload);
      alert("Đã lưu điểm vào hệ thống thành công!");
    } catch (err) {
      alert("Lỗi server, không thể lưu điểm. Vui lòng kiểm tra lại kết nối.");
    } finally {
      setSaving(false);
    }
  };

  const calculateTotal = useCallback((enId) => {
    const g = grades[enId] || {};
    const score = (parseFloat(g.assignment || 0) * 0.2) + 
                  (parseFloat(g.midTerm || 0) * 0.3) + 
                  (parseFloat(g.finalTerm || 0) * 0.5);
    return isNaN(score) ? "0.0" : score.toFixed(1);
  }, [grades]);

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Quản lý điểm số</h1>
          <p className="text-slate-500 text-sm font-medium">Trọng số tính điểm: BT(20%) - GK(30%) - CK(50%)</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <label className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-2xl cursor-pointer font-bold text-xs hover:shadow-md transition-all active:scale-95">
            <FileUp size={16} className="text-amber-500" />
            <span>Nạp Excel</span>
            <input type="file" className="hidden" onChange={handleImportExcel} accept=".xlsx, .xls" />
          </label>
          <button 
            onClick={handleSubmit} 
            disabled={saving || !selectedCourse}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-7 py-2.5 rounded-2xl font-bold text-xs uppercase hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Đang xử lý..." : "Lưu vào DB"}
          </button>
        </div>
      </div>

      <div className="relative">
        <select
          className="w-full p-4 pl-6 rounded-3xl border-none shadow-sm font-bold text-slate-700 appearance-none bg-white focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          onChange={handleCourseChange}
          value={selectedCourse}
        >
          <option value="">-- Chọn lớp học phần để hiển thị danh sách --</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.sectionCode} - {c.subject?.subjectName || 'Học phần'}</option>
          ))}
        </select>
        <CheckCircle className={`absolute right-6 top-1/2 -translate-y-1/2 transition-colors ${selectedCourse ? "text-emerald-500" : "text-slate-200"}`} size={20} />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-200">
        {loading ? (
          <div className="p-32 flex flex-col items-center gap-3">
            <Loader2 size={40} className="animate-spin text-blue-600" />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Đang tải dữ liệu điểm...</span>
          </div>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="p-6">Sinh viên</th>
                  <th className="p-6 text-center w-32">Bài tập (20%)</th>
                  <th className="p-6 text-center w-32">Giữa kỳ (30%)</th>
                  <th className="p-6 text-center w-32">Cuối kỳ (50%)</th>
                  <th className="p-6 text-center w-32 bg-blue-50/30 text-blue-600">Tổng kết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6">
                      <p className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{s.fullName}</p>
                      <p className="text-[10px] text-slate-400 font-bold tracking-wider">{s.studentCode}</p>
                    </td>
                    {['assignment', 'midTerm', 'finalTerm'].map(f => (
                      <td key={f} className="p-6">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          className="w-20 mx-auto block bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-center font-bold text-slate-700 focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none transition-all"
                          value={grades[s.enrollmentId]?.[f] ?? ''}
                          onChange={(e) => handleInputChange(s.enrollmentId, f, e.target.value)}
                        />
                      </td>
                    ))}
                    <td className="p-6 text-center">
                      <span className={`inline-block px-5 py-2 rounded-2xl font-black text-sm min-w-[60px] ${parseFloat(calculateTotal(s.enrollmentId)) >= 4 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {calculateTotal(s.enrollmentId)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-24 text-center flex flex-col items-center gap-4">
            <div className="bg-slate-50 p-6 rounded-full text-slate-200">
              <Search size={40} />
            </div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Vui lòng chọn lớp học phần để nhập điểm</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherGrading;