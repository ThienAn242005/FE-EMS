import React, { useState, useEffect, useMemo, useContext } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import CreditCircle from "../../components/CreditCircle";
import { AuthContext } from "../../Context/AuthContext"; // Import AuthContext

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_BASE_URL = "http://localhost:8080/api/grades";

export default function StudentKPIDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext); // Lấy user từ context
  const [dataApi, setDataApi] = useState([]); 
  const [summary, setSummary] = useState(null); 
  const [selectedSemester, setSelectedSemester] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Chặn gọi API nếu chưa có thông tin studentCode từ AuthContext
      if (authLoading || !user?.studentCode) return;

      try {
        setLoading(true);
        const token = user.token || localStorage.getItem("token");
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // GỌI ENDPOINT MỚI: Dùng studentCode thay cho ID số
        const [gradesRes, summaryRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/student/code/${user.studentCode}`, config),
          axios.get(`${API_BASE_URL}/student/code/${user.studentCode}/summary`, config)
        ]);

        setDataApi(gradesRes.data);
        setSummary(summaryRes.data);

        if (gradesRes.data.length > 0) {
          setSelectedSemester(gradesRes.data[0].semesterName);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.studentCode, authLoading]); // Lắng nghe sự thay đổi của studentCode

  const currentSemesterData = useMemo(() => {
    return dataApi.find(s => s.semesterName === selectedSemester);
  }, [dataApi, selectedSemester]);

  const subjects = currentSemesterData?.subjects || [];

  const chartData = {
    labels: subjects.map(s => s.name),
    datasets: [{
      label: "Điểm số",
      data: subjects.map(s => s.grade),
      backgroundColor: "#3b82f6",
      borderRadius: 8,
    }]
  };

  // Hiển thị trạng thái loading chuyên nghiệp hơn
  if (authLoading || loading) return (
    <div className="p-10 text-center flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Đang đồng bộ dữ liệu KPI...</p>
    </div>
  );

  if (!summary) return <div className="p-10 text-center font-bold text-red-400 uppercase text-xs">Không tìm thấy dữ liệu học tập</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-slate-50 rounded-[32px]">
      
      {/* BIỂU ĐỒ ĐIỂM (Theo học kỳ được chọn) */}
      <div className="lg:flex-[2] bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-black mb-4 uppercase text-slate-400 tracking-widest">Phân tích điểm số</h3>
        <div className="h-64">
          <Bar 
            data={chartData} 
            options={{ 
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, max: 10 }
                }
            }} 
          />
        </div>
      </div>

      {/* VÒNG TRÒN TÍN CHỈ (TỔNG TÍCH LŨY TOÀN KHÓA) */}
      <div className="flex flex-col items-center justify-center lg:w-80 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-black mb-6 uppercase text-slate-400 tracking-widest">Tiến độ đào tạo</h3>
        
        <CreditCircle 
          earned={summary.accumulatedCredits} 
          total={summary.requiredCredits} 
        /> 

        <div className="mt-6 text-center">
          <p className="text-3xl font-black text-blue-600">
            {summary.accumulatedCredits} / {summary.requiredCredits}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Tín chỉ đã tích lũy</p>
          
          <div className="mt-4 pt-4 border-t border-slate-50">
            <p className="text-xl font-black text-orange-500">{summary.avgGpa4?.toFixed(2) || "0.00"}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">GPA Tích lũy (Hệ 4)</p>
          </div>
        </div>
      </div>

      {/* DANH SÁCH MÔN (Chi tiết kỳ đang chọn) */}
      <div className="lg:flex-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest">Môn học</h3>
          <select
            className="bg-blue-50 text-blue-700 font-bold p-2 rounded-xl text-[10px] outline-none border-none ring-2 ring-blue-100"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            {dataApi.map(s => (
              <option key={s.semesterName} value={s.semesterName}>{s.semesterName}</option>
            ))}
          </select>
        </div>
        
        <ul className="space-y-3 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
          {subjects.length > 0 ? subjects.map((sub, index) => (
            <li key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-colors group">
              <div className="flex flex-col">
                <span className="font-bold text-xs text-slate-700 group-hover:text-blue-700">{sub.name}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">{sub.credit} Tín chỉ</span>
              </div>
              <span className="font-black text-blue-600 bg-white px-3 py-1 rounded-lg shadow-sm">{sub.grade}</span>
            </li>
          )) : (
            <p className="text-[10px] italic text-slate-400 text-center py-4">Chưa có dữ liệu môn học kỳ này.</p>
          )}
        </ul>
      </div>

    </div>
  );
}