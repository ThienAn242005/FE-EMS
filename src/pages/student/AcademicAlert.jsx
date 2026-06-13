import React from "react";
import { AlertOctagon, AlertTriangle } from "lucide-react";

export default function AcademicAlert({ academicStatus, gpa }) {
    // Log để bạn soi dữ liệu thực tế truyền vào component
    console.log("Dữ liệu nhận được tại Alert:", { academicStatus, gpa });

    // Kiểm tra điều kiện hiển thị: Chỉ hiện nếu có status và không phải NORMAL
    if (!academicStatus || academicStatus === "NORMAL" || academicStatus === "null") {
        return null;
    }

    const isDismissal = academicStatus === "DISMISSAL";

    return (
        <div className={`mb-10 p-6 rounded-[32px] border-2 flex items-center gap-6 shadow-sm animate-in fade-in duration-500 ${
            isDismissal ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
        }`}>
            <div className={`p-4 rounded-2xl text-white shadow-lg animate-pulse ${
                isDismissal ? "bg-red-600" : "bg-amber-500"
            }`}>
                {isDismissal ? <AlertOctagon size={28} /> : <AlertTriangle size={28} />}
            </div>

            <div className="flex-1">
                <h3 className={`font-[1000] uppercase text-lg ${isDismissal ? "text-red-900" : "text-amber-900"}`}>
                    {isDismissal ? "Quyết định Buộc thôi học" : "Cảnh báo học vụ"}
                </h3>
                <p className={`text-sm font-medium ${isDismissal ? "text-red-800" : "text-amber-800"}`}>
                    GPA tích lũy: <span className="font-black text-xl">{gpa || "0.0"}</span>. 
                    {isDismissal 
                        ? " Bạn đã vi phạm quy chế đào tạo. Vui lòng liên hệ Văn phòng khoa." 
                        : " Điểm số của bạn đang ở mức nguy hiểm. Hãy chú ý cải thiện."}
                </p>
            </div>
        </div>
    );
}