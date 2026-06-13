export default function Settings() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Cài đặt</h1>
      <p className="text-slate-500">Cấu hình hệ thống</p>

      <div className="mt-6 bg-white p-4 rounded-xl border space-y-4">
        <div>
          <label className="block text-sm">Tên hệ thống</label>
          <input
            className="mt-1 border rounded-lg px-3 py-2 w-full"
            placeholder="SMS Portal"
          />
        </div>

        <div>
          <label className="block text-sm">Email hỗ trợ</label>
          <input
            className="mt-1 border rounded-lg px-3 py-2 w-full"
            placeholder="support@email.com"
          />
        </div>
      </div>
    </div>
  );
}
