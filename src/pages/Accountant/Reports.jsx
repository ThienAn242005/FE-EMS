export default function Reports() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Báo cáo</h1>
      <p className="text-slate-500">Tổng hợp dữ liệu tài chính</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border">Doanh thu theo tháng</div>
        <div className="bg-white p-4 rounded-xl border">Doanh thu theo năm</div>
      </div>
    </div>
  );
}
