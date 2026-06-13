import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Users, X, Loader2, Building2, Phone, Mail, MapPin, Calendar } from "lucide-react";

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: null,
    fullName: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
    department: { id: "" }
  });

  const getAuthHeader = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return {};
    try {
      const userObj = JSON.parse(userStr);
      const token = userObj.token || userObj.accessToken;
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      };
    } catch (err) { return {}; }
  };

  useEffect(() => {
    const initData = async () => {
      setListLoading(true);
      await Promise.all([fetchTeachers(), fetchDepartments()]);
      setListLoading(false);
    };
    initData();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/teachers/all", { headers: getAuthHeader() });
      setTeachers(res.data);
    } catch (err) { console.error("Lỗi lấy giảng viên:", err.response?.status); }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/departments/all", { headers: getAuthHeader() });
      setDepartments(res.data);
    } catch (err) { console.error("Lỗi lấy danh sách khoa"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.department.id) return alert("Vui lòng chọn khoa công tác!");

    setLoading(true);
    try {
      const url = isEdit
        ? `http://localhost:8080/api/teachers/update/${formData.id}`
        : "http://localhost:8080/api/teachers/add";

      if (isEdit) {
        await axios.put(url, formData, { headers: getAuthHeader() });
      } else {
        await axios.post(url, formData, { headers: getAuthHeader() });
      }

      closeModal();
      fetchTeachers();
    } catch (err) {
      alert(isEdit ? "Cập nhật thất bại!" : "Thêm mới thất bại!");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giảng viên này?")) {
      try {
        await axios.delete(`http://localhost:8080/api/teachers/delete/${id}`, { headers: getAuthHeader() });
        fetchTeachers();
      } catch (err) { alert("Xóa thất bại!"); }
    }
  };

  const openEditModal = (teacher) => {
    setFormData({
      id: teacher.id,
      fullName: teacher.fullName,
      email: teacher.email,
      phone: teacher.phone || "",
      address: teacher.address || "",
      birthday: teacher.birthday || "",
      department: { id: teacher.department?.id || "" }
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setFormData({ id: null, fullName: "", email: "", phone: "", address: "", birthday: "", department: { id: "" } });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Quản lý Giảng viên</h2>
          <p className="text-slate-400 text-xs font-bold uppercase mt-1 tracking-widest">Hệ thống nhân sự sư phạm</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-all hover:bg-blue-700"
        >
          <Plus size={18} strokeWidth={3} /> Thêm giảng viên
        </button>
      </div>

      {/* Main List */}
      {listLoading ? (
        <div className="flex h-96 items-center justify-center bg-white rounded-[40px] border border-slate-50">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.length > 0 ? teachers.map((tc) => (
            <div key={tc.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center gap-5 mb-6">
                <div className="bg-blue-50 text-blue-600 p-4 rounded-[24px] group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <Users size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-800 text-lg truncate">{tc.fullName}</h3>
                  <div className="flex items-center gap-1 text-blue-500 font-bold text-[10px] uppercase tracking-wider">
                    <Building2 size={12} /> {tc.department?.name || "Chưa gán khoa"}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 bg-slate-50/50 p-5 rounded-3xl border border-slate-50">
                <div className="flex items-center gap-3 text-slate-600 text-sm"><Mail size={16} className="text-slate-300" /> {tc.email}</div>
                <div className="flex items-center gap-3 text-slate-600 text-sm"><Phone size={16} className="text-slate-300" /> {tc.phone || "N/A"}</div>
                <div className="flex items-start gap-3 text-slate-600 text-sm line-clamp-1"><MapPin size={16} className="text-slate-300 mt-0.5" /> {tc.address || "Chưa cập nhật địa chỉ"}</div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                <button onClick={() => openEditModal(tc)} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"><Edit size={20}/></button>
                <button onClick={() => handleDelete(tc.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={20}/></button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-white rounded-[40px] text-slate-400 font-bold uppercase tracking-widest border-2 border-dashed border-slate-100">Danh sách trống</div>
          )}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden my-auto animate-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{isEdit ? "Sửa giảng viên" : "Thêm giảng viên"}</h3>
                <button onClick={closeModal} className="bg-slate-50 p-2 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Họ và tên</label>
                    <input required className="w-full px-6 py-4 rounded-[24px] border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-700"
                      value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Email</label>
                    <input type="email" required className="w-full px-6 py-4 rounded-[24px] border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-700"
                      value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 text-blue-600">Ngày sinh (Dùng làm mật khẩu)</label>
                    <input type="date" required className="w-full px-6 py-4 rounded-[24px] border border-blue-100 bg-blue-50 focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-blue-700"
                      value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Số điện thoại</label>
                    <input className="w-full px-6 py-4 rounded-[24px] border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-700"
                      value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Địa chỉ thường trú</label>
                    <input className="w-full px-6 py-4 rounded-[24px] border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-700"
                      value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Khoa công tác</label>
                    <select required className="w-full px-6 py-4 rounded-[24px] border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-500/10 outline-none appearance-none font-bold text-slate-700 cursor-pointer"
                      value={formData.department.id} onChange={(e) => setFormData({...formData, department: { id: e.target.value }})}>
                      <option value="">Chọn khoa...</option>
                      {departments.map(dept => (<option key={dept.id} value={dept.id}>{dept.name}</option>))}
                    </select>
                  </div>
                </div>

                <button disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-[28px] font-black uppercase tracking-[0.2em] text-xs mt-4 hover:bg-blue-700 transition-all flex justify-center items-center gap-3 shadow-xl shadow-blue-200 disabled:bg-slate-300">
                  {loading ? <Loader2 className="animate-spin" /> : (isEdit ? "Lưu thay đổi" : "Xác nhận thêm mới")}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}