import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { Loader2, Users, BookOpen, GraduationCap } from 'lucide-react';
import api from '../../Service/api';

export default function TeacherClasses() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourses = async () => {
      if (user && user.username) {
        try {
          setLoading(true);
          console.log(">>> [1] Đang lấy danh sách lớp cho:", user.username);
          const res = await api.get(`/courses/teacher/code/${user.username}`);
          setCourses(res.data);
        } catch (err) {
          console.error("XXX [Lỗi] Không thể lấy danh sách lớp:", err.response?.data || err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCourses();
  }, [user]);

  const handleViewDetails = async (course) => {
    setSelectedCourse(course);
    setStudents([]);
    try {
      setLoadingStudents(true);
      const res = await api.get(`/teachers/course/${course.id}/students`);
      console.log(">>> [Dữ liệu API Sinh viên]:", res.data);
      setStudents(res.data);
    } catch (err) {
      console.error("XXX [Lỗi] Không lấy được sinh viên:", err.response?.status);
    } finally {
      setLoadingStudents(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-slate-500 font-medium">Đang tải hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 border-b pb-5">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BookOpen className="text-blue-800" size={28} />
        </div>
        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Học viện Công nghệ VUST</h2>
      </div>

      {/* SECTION 1: DANH SÁCH LỚP HỌC PHẦN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map(course => (
            <div key={course.id} className={`bg-white p-6 rounded-3xl border transition-all flex flex-col justify-between group shadow-sm hover:shadow-md ${selectedCourse?.id === course.id ? 'ring-2 ring-blue-600 border-transparent' : 'border-slate-100'}`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black px-2 py-1 bg-slate-100 text-slate-500 rounded-md uppercase tracking-widest">Mã lớp: {course.sectionCode}</span>
                  <Users size={18} className="text-slate-300" />
                </div>
                <p className="font-black text-blue-900 text-lg uppercase tracking-tight leading-tight">
                  {course.subject?.subjectName || "Môn học chưa xác định"}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[10px] font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md uppercase">
                    {course.subject?.credit} Tín chỉ
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleViewDetails(course)}
                className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg"
              >
                Chi tiết sinh viên
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full p-12 bg-slate-50 rounded-[40px] text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Chưa có dữ liệu phân công giảng dạy.</p>
          </div>
        )}
      </div>

      {/* SECTION 2: BẢNG SINH VIÊN */}
      {selectedCourse && (
        <div className="mt-12 bg-white p-8 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h3 className="font-black text-2xl text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <GraduationCap className="text-blue-600" /> Danh sách sinh viên
              </h3>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
                Lớp: {selectedCourse.sectionCode}
              </p>
            </div>
            <button
              onClick={() => { setSelectedCourse(null); setStudents([]); }}
              className="px-4 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
            >
              Đóng bảng ×
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-100">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">MSSV</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Họ và tên</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày sinh</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email liên hệ</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loadingStudents ? (
                  <tr>
                    <td colSpan="4" className="p-20 text-center">
                      <Loader2 className="animate-spin mx-auto text-blue-600 mb-2" />
                      <span className="text-xs font-bold text-slate-400 uppercase">Đang đồng bộ dữ liệu...</span>
                    </td>
                  </tr>
                ) : students.length > 0 ? (
                  students.map((std) => {
                    // Log ở đây để soi cấu trúc object nhằm tìm trường Email
                    console.log("Dòng dữ liệu sinh viên:", std);

                    return (
                      <tr key={std.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="p-5 text-sm font-black text-blue-900">{std.studentCode}</td>
                        <td className="p-5 text-sm font-bold text-slate-700">{std.fullName}</td>
                        <td className="p-5 text-sm font-black text-blue-900">{std.birthday}</td>
                        <td className="p-5 text-sm font-medium text-slate-400">
                          {/* Kiểm tra email trực tiếp hoặc qua object user lồng nhau */}
                          {std.email || std.user?.email || "N/A"}
                        </td>
                        <td className="p-5 text-center">
                          <span className="text-[10px] font-black px-3 py-1 bg-green-100 text-green-600 rounded-full uppercase">
                            {std.status || "Đang học"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-slate-400 font-bold uppercase text-xs">
                      Không có dữ liệu sinh viên.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}