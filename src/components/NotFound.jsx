import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Ghost, Search } from "lucide-react";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full text-center">
                {/* Minh họa icon */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 blur-3xl opacity-50 animate-pulse"></div>
                    <div className="relative flex justify-center">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-100 border border-slate-100">
                            <Ghost size={80} className="text-blue-600 animate-bounce" />
                        </div>
                    </div>
                </div>

                {/* Nội dung thông báo */}
                <h1 className="text-8xl font-black text-slate-800 tracking-tighter mb-2">404</h1>
                <h2 className="text-2xl font-black text-slate-700 uppercase tracking-tight mb-4">
                    Trang không tồn tại
                </h2>
                <p className="text-slate-500 font-medium mb-10 leading-relaxed px-4">
                    Có vẻ như đường dẫn này đã bị dời đi hoặc bạn đã nhập sai địa chỉ. Đừng lo, hãy để chúng mình dẫn bạn về nhà nhé!
                </p>

                {/* Các nút điều hướng */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 font-black rounded-2xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <ArrowLeft size={18} />
                        QUAY LẠI
                    </button>
                    
                    <Link 
                        to="/"
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                    >
                        <Home size={18} />
                        VỀ TRANG CHỦ
                    </Link>
                </div>

                {/* Chân trang trang trí */}
                <div className="mt-16 flex items-center justify-center gap-2 text-slate-300">
                    <Search size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                        University Management System
                    </span>
                </div>
            </div>
        </div>
    );
}