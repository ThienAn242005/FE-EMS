import React, { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronRight, Newspaper, ImageOff, Clock } from "lucide-react";

// NewsCard memoized để tối ưu render
const NewsCard = memo(({ item, onClick }) => {
  const [imgError, setImgError] = useState(false);

  // Hàm loại bỏ HTML tags để lấy text thuần cho summary
  const getSummaryText = (html) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div
      onClick={() => onClick(item.id)}
      className="group flex gap-4 bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-50 relative">
        {!imgError && item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            {imgError ? <ImageOff size={28} /> : <Newspaper size={28} />}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1">
            <Clock size={10} />
            {/* Sử dụng createdAt theo Model Spring Boot */}
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : "Vừa đăng"}
          </span>
        </div>

        <h4 className="font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors mb-1 uppercase text-[13px]">
          {item.title}
        </h4>

        <p className="text-[11px] text-slate-400 font-medium line-clamp-1 italic">
          {item.summary || getSummaryText(item.content)}
        </p>
      </div>
    </div>
  );
});

export default function StudentNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/api/news", {
          signal: controller.signal
        });
        
        // LOGIC: Sắp xếp theo thời gian tạo (createdAt) giảm dần và chỉ lấy 6 bài
        const rawData = Array.isArray(data) ? data : (data.content || []);
        const latestSix = rawData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);
          
        setNews(latestSix);
      } catch (error) {
        if (!axios.isCancel(error)) console.error("Lỗi fetch news:", error);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const handleNewsClick = (id) => {
    navigate(`/student/news/details/${id}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex gap-4 p-4 bg-white rounded-[28px] border border-slate-100 animate-pulse">
            <div className="w-24 h-24 rounded-2xl bg-slate-100 flex-shrink-0" />
            <div className="flex-1 space-y-3 py-2">
              <div className="h-2 w-20 bg-slate-100 rounded" />
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-3 w-2/3 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section (Ông có thể bỏ nếu ở ngoài đã có tiêu đề) */}
      <div className="flex justify-between items-center px-1">
        <div className="relative">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">
            Bảng tin Portal
          </h3>
          <div className="absolute -bottom-2 left-0 h-1 w-6 bg-blue-600 rounded-full" />
        </div>
        <button 
          onClick={() => navigate("/student/news/list")} 
          className="group text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1 hover:gap-2 transition-all"
        >
          Xem tất cả <ChevronRight size={14} />
        </button>
      </div>

      {/* Grid hiển thị 6 bài viết (2 cột trên Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.length > 0 ? (
          news.map((item) => (
            <NewsCard key={item.id} item={item} onClick={handleNewsClick} />
          ))
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-100 rounded-[40px]">
            <Newspaper size={40} className="text-slate-200 mb-3" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              Hiện chưa có thông báo mới
            </p>
          </div>
        )}
      </div>
    </div>
  );
}