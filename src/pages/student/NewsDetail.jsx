import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, ChevronRight } from "lucide-react";

export default function NewsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [relatedNews, setRelatedNews] = useState([]);

    useEffect(() => {
        // Cuộn lên đầu trang khi đổi bài
        window.scrollTo(0, 0);

        // Lấy chi tiết bài báo
        axios.get(`http://localhost:8080/api/news/${id}`).then(res => {
            setArticle(res.data);
        });

        // Lấy danh sách tin liên quan (lấy 4 bài mới nhất)
        axios.get(`http://localhost:8080/api/news`).then(res => {
            // Lọc bỏ bài đang xem hiện tại
            const filtered = res.data.filter(item => item.id !== parseInt(id)).slice(0, 4);
            setRelatedNews(filtered);
        });
    }, [id]);

    if (!article) return <div className="flex justify-center mt-20 font-bold text-slate-400 italic">Đang tải nội dung...</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-sm overflow-hidden break-words">
                    {/* Tiêu đề */}
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
                        {article.title}
                    </h1>

                    {/* Tác giả & Ngày tháng */}
                    <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-100">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {article.author?.fullName?.charAt(0) || "A"}
                        </div>
                        <div>
                            <p className="text-slate-900 font-bold uppercase tracking-tight">{article.author?.fullName || "Ban Quản trị"}</p>
                            <p className="text-slate-400 text-sm flex items-center gap-2">
                                <Calendar size={14}/> {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </div>

                    {/* HIỂN THỊ NỘI DUNG - FIX TRÀN DÒNG */}
                    <div 
                        className="prose prose-slate prose-lg max-w-none 
                                   break-words overflow-hidden
                                   prose-img:rounded-3xl prose-img:mx-auto prose-img:shadow-lg
                                   prose-p:text-justify prose-p:leading-relaxed prose-p:break-words
                                   prose-headings:text-blue-900 prose-headings:font-black"
                        dangerouslySetInnerHTML={{ __html: article.content }} 
                    />

                    {/* Footer */}
                    <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 text-sm italic">
                        <p>© 2025 Khoa CNTT - HITU</p>
                        <div className="flex gap-4">
                            <span className="hover:text-blue-600 cursor-pointer">Chia sẻ</span>
                        </div>
                    </div>
                </div>

                {/* --- PHẦN TIN LIÊN QUAN --- */}
                <div className="mt-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Tin tức liên quan</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {relatedNews.map((news) => (
                            <div 
                                key={news.id}
                                onClick={() => navigate(`/student/news/details/${news.id}`)}
                                className="bg-white p-5 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 items-center group"
                            >
                                <img 
                                    src={news.thumbnail} 
                                    className="w-24 h-24 rounded-2xl object-cover flex-shrink-0 group-hover:opacity-80 transition-opacity"
                                    alt={news.title}
                                />
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                        {news.title}
                                    </h4>
                                    <p className="text-slate-400 text-xs mt-2 flex items-center gap-1 uppercase font-bold tracking-tighter">
                                        Xem ngay <ChevronRight size={12}/>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}