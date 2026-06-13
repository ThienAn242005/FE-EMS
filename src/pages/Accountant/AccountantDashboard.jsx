import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function AccountantDashboard() {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [summaryRes, chartRes] = await Promise.all([
        axios.get("http://localhost:8080/api/accountants/summary"),
        axios.get("http://localhost:8080/api/accountants/revenue-by-month?year=2026")
      ]);

      setSummary(summaryRes.data);

      const labels = chartRes.data.map(item => "Tháng " + item.month);
      const values = chartRes.data.map(item => item.revenue);

      setChartData({
        labels,
        datasets: [
          {
            label: "Doanh thu (VNĐ)",
            data: values,
            borderWidth: 1,
            borderRadius: 8,
            barThickness: 40,
          }
        ]
      });

      setLoading(false);
    } catch (err) {
      console.error("Lỗi tải dashboard:", err);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Đang tải dashboard...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Kế Toán</h1>

      {/* SUMMARY */}
      {summary && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow p-4 rounded">
            <p className="text-sm text-gray-500">Tổng doanh thu</p>
            <p className="text-xl font-bold">
              {summary.totalRevenue?.toLocaleString("vi-VN")} đ
            </p>
          </div>

          <div className="bg-white shadow p-4 rounded">
            <p className="text-sm text-gray-500">Hôm nay</p>
            <p className="text-xl font-bold">
              {summary.todayRevenue?.toLocaleString("vi-VN")} đ
            </p>
          </div>

          <div className="bg-white shadow p-4 rounded">
            <p className="text-sm text-gray-500">Chờ duyệt</p>
            <p className="text-xl font-bold">{summary.pendingInvoices}</p>
          </div>

          <div className="bg-white shadow p-4 rounded">
            <p className="text-sm text-gray-500">Đã thanh toán</p>
            <p className="text-xl font-bold">{summary.paidInvoices}</p>
          </div>
        </div>
      )}

      {/* CHART */}
      <div className="bg-white p-6 shadow rounded">
        <h2 className="font-semibold mb-4">Biểu đồ doanh thu theo tháng</h2>

        {chartData ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
                tooltip: {
                  callbacks: {
                    label: (ctx) =>
                      ctx.raw.toLocaleString("vi-VN") + " đ"
                  }
                }
              },
              scales: {
                y: {
                  ticks: {
                    callback: (value) =>
                      value.toLocaleString("vi-VN") + " đ"
                  }
                }
              }
            }}
          />
        ) : (
          <p>Không có dữ liệu</p>
        )}
      </div>
    </div>
  );
}
