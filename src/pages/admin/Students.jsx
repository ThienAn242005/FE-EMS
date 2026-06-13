import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { 
  Plus, Edit, Trash2, Loader2, Search, X, Check, 
  UserPlus, Phone, Mail, GraduationCap, ChevronDown 
} from "lucide-react";

export default function StudentManagement() {
  // --- STATES ---
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]); // Lưu danh sách khoa từ DB
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // State cho form thêm mới
  const [newStudent, setNewStudent] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    birthday: ""
  });

  // --- LOGIC AUTH ---
  const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  };

  // --- API CALLS ---
  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, []);

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/students/all", {
        headers: getAuthHeader()
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu sinh viên:", err);
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách khoa từ DepartmentApiController
  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/departments/all");
      setDepartments(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách khoa:", err);
    }
  };

  // Xử lý tạo mới sinh viên
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/students/add", newStudent, {
        headers: getAuthHeader()
      });
      setIsModalOpen(false);
      setNewStudent({ fullName: "", email: "", phone: "", department: "", birthday: "" });
      fetchStudents();
      alert("Thêm sinh viên thành công!");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || "Không thể thêm mới"));
    }
  };

  // Xử lý xóa sinh viên
  const deleteStudent = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
      try {
        await axios.delete(`http://localhost:8080/api/students/${id}`, {
          headers: getAuthHeader()
        });
        setStudents(students.filter(s => s.id !== id));
      } catch (err) {
        alert("Xóa thất bại!");
      }
    }
  };

  // --- SEARCH LOGIC ---
  const filteredStudents = useMemo(() => {
    return students.filter(s =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, students]);

  return (
    <div className="animate-in fade-in duration-500 space-y-6 p-4 md:p-0">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Quản lý Sinh viên</h2>
          <p className="text-slate-500 text-sm font-medium">Hệ thống cập nhật trực tiếp từ Database</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm tên hoặc MSSV..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <Plus size={20} /> <span className="hidden md:inline">Thêm mới</span>
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">MSSV</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Thông tin cơ bản</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Liên hệ</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Khoa / Ngành</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-blue-500" size={40} />
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Đang kết nối Database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6 font-black text-blue-600 text-sm">{st.studentCode}</td>
                    <td className="p-6">
                      <p className="font-bold text-slate-800">{st.fullName}</p>
                      <p className="text-[11px] text-slate-400 font-bold">Ngày sinh: {st.birthday || "N/A"}</p>
                    </td>
                    <td className="p-6 space-y-1">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Mail size={14} className="text-slate-400" /> {st.email}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Phone size={14} className="text-slate-400" /> {st.phone || "Chưa cập nhật"}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-wider">
                        <GraduationCap size={14} />
                        {st?.department || "Tự do"}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteStudent(st.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-24 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <Search size={48} className="text-slate-400 mb-2" />
                      <p className="text-slate-500 font-black uppercase text-sm tracking-widest">Không tìm thấy dữ liệu</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM MỚI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600 rounded-2xl text-white">
                    <UserPlus size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Thêm Mới</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-1 block">Họ và tên đầy đủ</label>
                    <input
                      required
                      placeholder="VD: Nguyễn Văn A"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                      value={newStudent.fullName}
                      onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-1 block">Email liên lạc</label>
                    <input
                      type="email" required
                      placeholder="example@gmail.com"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-1 block">Số điện thoại</label>
                    <input
                      placeholder="09xx xxx xxx"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-1 block">Ngày sinh</label>
                    <input
                      type="date"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                      value={newStudent.birthday}
                      onChange={(e) => setNewStudent({ ...newStudent, birthday: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-1 block">
                      Khoa chủ quản
                    </label>
                    <div className="relative">
                      <select
                        required
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                        value={newStudent.department}
                        onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                      >
                        <option value="">-- Chọn khoa từ hệ thống --</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.name}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-5 rounded-[20px] font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 mt-4"
                >
                  <Check size={20} /> Hoàn tất lưu trữ
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}