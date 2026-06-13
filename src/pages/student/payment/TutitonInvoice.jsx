import React from "react";
import { QRCodeSVG } from "qrcode.react";

export const TuitionInvoice = React.forwardRef(
    ({ payment, student, enrollments, verifyUrl }, ref) => {
        // Kiểm tra nếu chưa có dữ liệu payment thì không render gì cả
        if (!payment) return null;

        const today = new Date();

        return (
            <div
                ref={ref}
                className="p-16 bg-white text-black font-serif relative shadow-lg"
                style={{ width: "210mm", minHeight: "297mm" }}
            >
                {/* 1. Header: Thông tin trường */}
                <div className="flex justify-between items-start mb-10 border-b-2 border-black pb-4">
                    <div className="text-left">
                        <h2 className="text-sm font-bold uppercase tracking-tighter text-slate-700">
                            BỘ GIÁO DỤC VÀ ĐÀO TẠO
                        </h2>
                        <h1 className="text-xl font-black uppercase text-blue-900 leading-tight">
                            TRƯỜNG ĐẠI HỌC CÔNG NGHỆ VUST
                        </h1>
                        <p className="text-[10px] italic text-slate-500 mt-1">Hệ thống quản lý đào tạo SMS - Trích xuất tự động</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs italic font-medium">Mẫu số: 01/HP - KHTC</p>
                        <p className="text-sm mt-1">
                            Mã hóa đơn:{" "}
                            <span className="font-bold text-red-600">
                                #{String(payment.id).padStart(5, "0")}
                            </span>
                        </p>
                    </div>
                </div>

                {/* 2. Title + QR Code ngang hàng */}
                <div className="flex justify-between items-center mb-10 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <div className="text-center flex-1 ml-24">
                        <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-slate-900">
                            HÓA ĐƠN HỌC PHÍ
                        </h1>
                        <p className="italic text-sm mt-1 font-semibold text-slate-600">
                            Học kỳ II - Năm học 2025 - 2026
                        </p>
                        <p className="text-xs mt-1 text-slate-500 font-medium">
                            Ngày {today.getDate()} tháng {today.getMonth() + 1} năm {today.getFullYear()}
                        </p>
                    </div>

                    {/* QR Code xác thực: Nhận link từ cha truyền xuống */}
                    <div className="ml-6 text-center bg-white p-2 border-2 border-slate-200 rounded-xl shadow-sm">
                        <QRCodeSVG
                            value={verifyUrl || `http://localhost:5173/student/verify-invoice/${payment.id}`}
                            size={85}
                            level="H"
                        />
                        <p className="text-[8px] text-slate-400 mt-1 font-black uppercase tracking-widest">
                            Verify QR
                        </p>
                    </div>
                </div>

                {/* 3. Thông tin sinh viên */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 text-sm px-4">
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500 uppercase text-[10px] font-bold">Họ tên sinh viên:</span>
                        <span className="font-black uppercase text-slate-800">{student?.fullName || "Chưa cập nhật"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-500 uppercase text-[10px] font-bold">Mã số sinh viên:</span>
                        <span className="font-bold text-blue-800">{student?.studentCode || "N/A"}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1 text-slate-600 italic">
                        <span>Bậc đào tạo: Đại học chính quy</span>
                        <span>Hệ: Kỹ sư CLC</span>
                    </div>
                    <div className="col-span-2 mt-2 bg-blue-50/30 p-3 rounded-lg border border-blue-100/50">
                        <p className="text-xs text-slate-700 leading-relaxed">
                            <strong>Lý do nộp:</strong> Thanh toán học phí các học phần đã đăng ký (Hình thức: {payment.paymentMethod || "Chuyển khoản VNPAY"})
                        </p>
                    </div>
                </div>

                {/* 4. Bảng chi tiết học phí */}
                <div className="overflow-hidden rounded-xl border border-black mb-8">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-widest">
                                <th className="border-r border-slate-700 px-2 py-4 w-12 text-center text-white">STT</th>
                                <th className="border-r border-slate-700 px-4 py-4 text-left text-white">Nội dung học phần</th>
                                <th className="border-r border-slate-700 px-2 py-4 text-center w-20 text-white">Số TC</th>
                                <th className="border-r border-slate-700 px-4 py-4 text-right text-white">Đơn giá</th>
                                <th className="px-4 py-4 text-right text-white">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {enrollments?.length > 0 ? (
                                enrollments.map((e, index) => (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                                        <td className="border-r border-slate-200 px-2 py-3 text-center text-slate-400 font-mono">{index + 1}</td>
                                        <td className="border-r border-slate-200 px-4 py-3 font-semibold text-slate-800 italic">{e.course?.subject?.subjectName}</td>
                                        <td className="border-r border-slate-200 px-2 py-3 text-center text-slate-600">{e.course?.subject?.credit}</td>
                                        <td className="border-r border-slate-200 px-4 py-3 text-right text-slate-500">500.000</td>
                                        <td className="px-4 py-3 text-right font-black text-slate-900">
                                            {(e.course?.subject?.credit * 500000).toLocaleString()}đ
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-4 py-12 text-center italic text-slate-300 tracking-widest uppercase text-xs">
                                        Đang trích xuất dữ liệu học phần từ máy chủ...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="font-black text-xl bg-slate-100">
                                <td colSpan="4" className="border-t-2 border-black px-4 py-5 text-right uppercase tracking-tighter text-slate-700 italic">
                                    Tổng số tiền quyết toán (VND):
                                </td>
                                <td className="border-t-2 border-black px-4 py-5 text-right text-blue-900 font-black">
                                    {payment.totalAmount?.toLocaleString()}đ
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* 5. Dấu ĐÃ THANH TOÁN chìm (PAID) */}
                {payment.status === "PAID" && (
                    <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 border-[10px] border-red-500/30 text-red-500/20 font-black text-7xl rotate-[-25deg] px-16 py-6 rounded-[3rem] pointer-events-none uppercase tracking-[0.3em] scale-125 z-0 flex flex-col items-center">
                        <span>ĐÃ THANH TOÁN</span>
                        <span className="text-xl tracking-widest mt-2">{payment.paymentMethod === 'CASH' ? 'CASH PAYMENT' : 'VNPAY VERIFIED'}</span>
                    </div>
                )}

                {/* 6. Phần Chữ ký & Mộc tròn */}
                <div className="flex justify-between mt-20 text-center text-sm px-10 relative z-10">
                    <div className="w-56">
                        <p className="font-black uppercase mb-1 text-slate-800">Người nộp tiền</p>
                        <p className="italic text-[9px] text-slate-400 mb-2">(Ký và ghi rõ họ tên)</p>
                        <div className="h-28"></div>
                        <p className="font-black uppercase text-slate-900 tracking-tight border-t border-slate-100 pt-2">
                            {student?.fullName}
                        </p>
                    </div>

                    <div className="w-80 relative flex flex-col items-center">
                        <p className="font-black uppercase mb-1 text-slate-800 italic">TL. HIỆU TRƯỞNG</p>
                        <p className="font-bold uppercase text-[11px] mb-1">KT. PHÒNG KẾ HOẠCH TÀI CHÍNH</p>
                        <p className="italic text-[9px] text-slate-400 mb-2">(Đã ký và đóng dấu điện tử)</p>
                        
                        <div className="h-44 flex items-center justify-center relative">
                            {/* Con dấu tròn đỏ VUST giả lập chuyên nghiệp */}
                            <div className="w-40 h-40 border-[5px] border-red-600/60 rounded-full flex items-center justify-center pointer-events-none relative shadow-[0_0_15px_rgba(220,38,38,0.1)]">
                                <div className="border-[2px] border-red-600/40 rounded-full w-[90%] h-[90%] flex items-center justify-center relative">
                                    <div className="absolute inset-0 border-[1px] border-red-600/20 rounded-full scale-[0.85]"></div>
                                    <p className="text-red-600/70 font-black text-[10px] uppercase text-center leading-tight px-2 tracking-tighter">
                                        TRƯỜNG ĐẠI HỌC<br/>
                                        <span className="text-[13px] tracking-normal">CÔNG NGHỆ VUST</span><br/>
                                        <span className="text-lg">★</span><br/>
                                        KẾ HOẠCH TÀI CHÍNH
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="font-black text-slate-900 uppercase tracking-wide border-t border-slate-100 pt-2">
                            GS. TS. TRẦN VĂN QUYẾT
                        </p>
                    </div>
                </div>

                {/* 7. Footer chứng thực */}
                <div className="absolute bottom-12 left-0 right-0 px-16">
                    <div className="border-t-2 border-slate-100 pt-6 flex justify-between text-[9px] text-slate-400 font-medium tracking-tight">
                        <div className="flex flex-col gap-1 italic">
                            <p>● Link xác thực: vust.edu.vn/student/verify-invoice/{payment.id}</p>
                            <p>● Chứng từ này có giá trị thay thế hóa đơn giấy theo quy định của nhà trường.</p>
                        </div>
                        <div className="text-right flex flex-col gap-1 uppercase font-bold">
                            <p>Hệ thống SMS VUST - Version 2.0</p>
                            <p className="text-slate-300">Timestamp: {today.toISOString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);