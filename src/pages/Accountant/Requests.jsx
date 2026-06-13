export default function Requests() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Yêu cầu duyệt</h1>
      <p className="text-slate-500">Danh sách yêu cầu từ sinh viên</p>

      <div className="mt-6 bg-white p-4 rounded-xl border">
        <div className="flex justify-between items-center border-b py-2">
          <span>Gia hạn học phí</span>
          <div className="space-x-2">
            <button className="px-3 py-1 bg-green-500 text-white rounded-lg">Duyệt</button>
            <button className="px-3 py-1 bg-red-500 text-white rounded-lg">Từ chối</button>
          </div>
        </div>
      </div>
    </div>
  );
}
