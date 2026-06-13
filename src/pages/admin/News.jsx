import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import { Edit3, Trash2, Send, PlusCircle, Newspaper } from "lucide-react"; // Dùng icon cho đẹp

const API_BASE = "http://localhost:8080/api/news";
const CLOUD_NAME = "drleabez2";
const UPLOAD_PRESET = "wecg1rfy";

export default function AdminNewsCRUD() {
    // State cho Form
    const [id, setId] = useState(null); // Để phân biệt Thêm mới hay Cập nhật
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [newsList, setNewsList] = useState([]);
    const quillRef = useRef(null);

    // 1. Tải danh sách bài viết
    const fetchNews = async () => {
        try {
            const res = await axios.get(API_BASE);
            setNewsList(res.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách tin tức", err);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    // 2. Hàm xử lý Upload ảnh lên Cloudinary cho Editor
    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", UPLOAD_PRESET);

            try {
                const res = await axios.post(
                    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                    formData
                );
                const url = res.data.secure_url;
                const editor = quillRef.current.getEditor();
                const range = editor.getSelection();
                editor.insertEmbed(range.index, "image", url);
            } catch (err) {
                console.error("Upload ảnh thất bại", err);
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["image", "link", "video"],
                ["clean"],
            ],
            handlers: { image: imageHandler },
        },
    }), []);

    // 3. Hàm Lưu (Thêm mới hoặc Cập nhật)
    const handleSave = async () => {
        if (!title || !content) return alert("Vui lòng nhập đầy đủ thông tin!");

        const payload = {
            id: id, // Nếu id != null, Spring Boot sẽ thực hiện update
            title: title,
            content: content,
            author: { id: 1 } // Thay đổi theo logic auth của bạn
        };

        try {
            await axios.post(API_BASE, payload);
            alert(id ? "Cập nhật thành công!" : "Đăng bài thành công!");
            resetForm();
            fetchNews();
        } catch (err) {
            console.error("Lỗi khi lưu bài viết", err);
        }
    };

    // 4. Hàm Xóa
    const handleDelete = async (newsId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            try {
                await axios.delete(`${API_BASE}/${newsId}`);
                fetchNews();
            } catch (err) {
                console.error("Xóa thất bại", err);
            }
        }
    };

    // 5. Hàm chuẩn bị sửa
    const handleEdit = (news) => {
        setId(news.id);
        setTitle(news.title);
        setContent(news.content);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const resetForm = () => {
        setId(null);
        setTitle("");
        setContent("");
    };

    return (
        <div className="p-6 bg-slate-100 min-h-screen">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* CỘT TRÁI: FORM SOẠN THẢO */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black flex items-center gap-2">
                                <Edit3 size={24} className="text-blue-600" />
                                {id ? "CHỈNH SỬA BÀI VIẾT" : "SOẠN THẢO BÀI VIẾT"}
                            </h2>
                            {id && (
                                <button onClick={resetForm} className="text-sm text-red-500 font-bold underline">
                                    Hủy sửa / Thêm mới
                                </button>
                            )}
                        </div>

                        <input
                            className="w-full p-4 mb-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none font-bold text-lg transition-all"
                            placeholder="Nhập tiêu đề hấp dẫn..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <div className="mb-4">
                            <ReactQuill
                                ref={quillRef}
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={modules}
                                className="h-[450px] mb-12"
                                placeholder="Viết nội dung bài báo ở đây..."
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                            <Send size={20} />
                            {id ? "CẬP NHẬT NGAY" : "XUẤT BẢN BÀI VIẾT"}
                        </button>
                    </div>
                </div>

                {/* CỘT PHẢI: DANH SÁCH BÀI ĐÃ ĐĂNG */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-6">
                        <h2 className="text-lg font-black mb-4 flex items-center gap-2">
                            <Newspaper size={20} className="text-slate-600" />
                            ĐÃ XUẤT BẢN ({newsList.length})
                        </h2>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            {newsList.map((news) => (
                                <div key={news.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all group">
                                    <h3 className="font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                        {news.title}
                                    </h3>
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleEdit(news)}
                                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(news.id)}
                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {newsList.length === 0 && (
                                <p className="text-slate-400 text-center py-10">Chưa có bài viết nào.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}