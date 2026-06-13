export default function Students() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Sinh viên</h1>
      <p className="text-slate-500">Danh sách sinh viên</p>

      <div className="mt-6 bg-white rounded-xl border p-4">
        <ul className="space-y-3">
          <li className="flex justify-between">
            <span>Nguyễn Văn A</span>
            <span className="text-slate-400">KTPM01</span>
          </li>
          <li className="flex justify-between">
            <span>Trần Thị B</span>
            <span className="text-slate-400">HTTT02</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
