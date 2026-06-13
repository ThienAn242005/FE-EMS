import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function NewsList() {
    const [news, setNews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Gọi API lấy danh sách tin tức từ Backend
        axios.get("http://localhost:8080/api/news")
            .then(res => setNews(res.data))
            .catch(err => console.error("Lỗi lấy tin tức:", err));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Tiêu đề trang phong cách HITU */}
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-2 h-12 bg-blue-700 rounded-full"></div>
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">
                        Tin tức & Sự kiện
                    </h2>
                </div>

                {/* Danh sách tin tức dạng lưới */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {news.map((item) => (
                        <div 
                            key={item.id}
                            onClick={() => navigate(`/student/news/details/${item.id}`)}
                            className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer group flex flex-col h-full border border-slate-100"
                        >
                            {/* Ảnh Thumbnail */}
                            <div className="relative h-60 overflow-hidden">
                                <img 
                                    src={item.thumbnail || "https://images.unsplash.com/photo-1512233844290-0d41932111bc?q=80&w=1000&auto=format&fit=crop"} 
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase">
                                    Tin học vụ
                                </div>
                            </div>

                            {/* Nội dung tóm tắt */}
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 text-slate-400 text-[11px] mb-4 font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                                    <span className="flex items-center gap-1.5"><User size={14}/> {item.author?.fullName || "Admin"}</span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 leading-tight mb-4 group-hover:text-blue-700 transition-colors line-clamp-2">
                                    {item.title}
                                </h3>

                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6">
                                    {item.summary}
                                </p>

                                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center text-blue-600 font-bold text-sm group-hover:gap-3 transition-all">
                                    XEM CHI TIẾT <ArrowRight size={18} className="ml-2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Thông báo nếu không có tin tức */}
                {news.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[40px] shadow-inner border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">Hiện tại chưa có tin tức nào được đăng tải.</p>
                    </div>
                )}
            </div>
        </div>
    );
}