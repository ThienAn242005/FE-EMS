import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { AlertCircle, Loader2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const API_BASE_URL = "http://localhost:8080/api/students";

export default function StudentCard({ studentId, studentInfo }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const flattenData = (data) => {
    if (!data) return null;
    const nameForAvatar = data.fullName || "User";
    const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForAvatar)}&background=random&size=128`;

    return {
      fullName: data.fullName || "N/A",
      studentCode: data.studentCode || "N/A",
      birthday: data.birthday || "N/A",
      className: data.className || "N/A",
      department: data.department || "N/A",
      avatar: data.avatar || fallbackAvatar,
    };
  };

  useEffect(() => {
    if (studentInfo) {
      setStudent(flattenData(studentInfo));
      return;
    }
    if (studentId) {
      const fetchStudent = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          const { data } = await axios.get(`${API_BASE_URL}/code/${studentId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          setStudent(flattenData(data));
        } catch (err) {
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [studentId, studentInfo]);

  const qrValue = useMemo(() => {
    if (!student) return "";
    return `MSSV:${student.studentCode}|Name:${student.fullName}`;
  }, [student]);

  if (loading) return <div className="w-[500px] h-[300px] bg-slate-100 animate-pulse rounded-xl mx-auto" />;
  if (error || !student) return <ErrorState />;

  return (
    <div className="w-[550px] h-[330px] mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 relative font-sans text-slate-800">
      
      {/* Header: Logo & Title */}
      <div className="flex p-4 items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Logo VUST tròn màu xanh */}
          <div className="w-20 h-20 rounded-full bg-[#00558d] flex items-center justify-center p-2 shadow-sm">
            <span className="text-white font-black text-xl italic tracking-tighter border-b-2 border-white leading-none">VUST</span>
          </div>
          <div>
            <h2 className="text-[#00558d] font-bold text-[13px] leading-tight uppercase">VUST — VIETNAM UNIVERSITY OF SCIENCE AND TECHNOLOGY</h2>
            <h1 className="text-[#00558d] font-black text-[18px] leading-tight uppercase tracking-wide">SMART STUDENT IDENTITY CARD</h1>
          </div>
        </div>
      </div>

      {/* Title: THẺ SINH VIÊN */}
      <div className="text-center -mt-2">
        <h2 className="text-[#e11d48] font-black text-[28px] uppercase tracking-wider">THẺ SINH VIÊN</h2>
      </div>

      {/* Main Content: Avatar & Info */}
      <div className="flex px-6 mt-2 gap-6">
        {/* Avatar */}
        <div className="w-[120px] h-[150px] border border-slate-300 shadow-sm overflow-hidden bg-slate-50">
          <img src={student.avatar} alt="Avatar" className="w-full h-full object-cover" />
        </div>

        {/* Info Grid */}
        <div className="flex-1 space-y-1.5 pt-1">
          <h3 className="text-black font-black text-[22px] uppercase mb-1">{student.fullName}</h3>
          
          <div className="grid grid-cols-2 text-[15px]">
            <p className="font-bold">Ngày sinh : <span className="font-medium">{student.birthday}</span></p>
            <p className="font-bold">MSSV: <span className="font-medium">{student.studentCode}</span></p>
          </div>

          <p className="text-[15px] font-bold">Khoa <span className="ml-9">: {student.department}</span></p>
          <p className="text-[15px] font-bold">Bậc <span className="ml-[45px]">: Đại học</span></p>
          
          {/* Barcode giả lập */}
          <div className="pt-2">
            <div className="h-10 w-full bg-[url('https://www.cognex.com/api/Sitecore/Barcode/Get?data=12345678&code=Code128&width=300&height=50')] bg-contain bg-no-repeat"></div>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center justify-center">
            <div className="p-1 border border-slate-300 rounded-sm bg-white">
                <QRCodeCanvas value={qrValue} size={75} />
            </div>
        </div>
      </div>

      {/* Footer: Hạn thẻ & Website */}
      <div className="absolute bottom-0 w-full">
        {/* Sóng xanh đặc trưng bên trái */}
        <div className="absolute bottom-0 left-0">
           <svg width="200" height="40" viewBox="0 0 200 40">
              <path d="M0 40 Q 50 10 100 40 T 200 40 L 200 40 L 0 40 Z" fill="#007bff" opacity="0.6"/>
              <path d="M0 40 Q 60 20 120 40 T 240 40 L 240 40 L 0 40 Z" fill="#00558d"/>
           </svg>
        </div>
        
        <div className="flex justify-between items-end px-6 pb-2 relative z-10">
          <p className="text-[13px] font-bold text-black">Hạn thẻ: 2023 - 2027</p>
          <p className="text-[12px] font-bold text-[#00558d]">www.vust.edu.vn</p>
        </div>
      </div>
    </div>
  );
}

const ErrorState = () => (
  <div className="w-[500px] p-10 bg-red-50 border border-red-200 rounded-xl text-center mx-auto">
    <AlertCircle className="text-red-500 mx-auto mb-2" size={32} />
    <p className="text-red-700 font-bold">Không thể hiển thị thông tin thẻ</p>
  </div>
);