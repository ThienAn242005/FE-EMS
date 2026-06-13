import React, { useState, useEffect } from 'react';
import { uploadToCloudinary } from '../../Service/uploadService';
import api from '../../Service/api';
import { alertService } from '../../utils/swalUtils';
import FilePreviewModal from './FilePreviewModal'; 
import { Upload, Loader2, FileText, CheckCircle, ExternalLink, Trash2, Search } from 'lucide-react';

export default function TeacherAssignments() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [materials, setMaterials] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const selectedCourseId = 22;

  const fetchMaterials = async () => {
    try {
      const res = await api.get(`/materials/course/${selectedCourseId}`);
      setMaterials(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchMaterials(); }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const result = await alertService.confirmDelete("Tải lên giáo trình?", `Xác nhận đăng tải: ${file.name}`);
    if (!result.isConfirmed) { e.target.value = null; return; }

    try {
      setUploading(true);
      const cloudRes = await uploadToCloudinary(file, (percent) => setProgress(percent));
      const payload = { title: file.name, fileUrl: cloudRes.secure_url, fileType: cloudRes.format || "file", courseId: selectedCourseId };
      await api.post('/materials/upload-metadata', payload);
      alertService.success("VUST: Tải lên thành công!");
      fetchMaterials();
    } catch (error) {
      alertService.error("Tải lên thất bại!");
    } finally {
      setUploading(false); setProgress(0); e.target.value = null;
    }
  };

  const handleDelete = async (id) => {
    const result = await alertService.confirmDelete("Xóa tài liệu?", "Dữ liệu sẽ bị xóa vĩnh viễn!");
    if (result.isConfirmed) {
      try {
        await api.delete(`/materials/${id}`);
        alertService.success("Đã xóa xong");
        fetchMaterials();
      } catch (err) { alertService.error("Lỗi xóa file!"); }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Quản lý bài tập</h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span> Course ID: #{selectedCourseId}
          </p>
        </div>
      </div>

      <div className={`relative overflow-hidden bg-white border-2 border-dashed rounded-[3.5rem] p-16 text-center transition-all ${uploading ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50'}`}>
        <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} disabled={uploading} />
        <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center gap-6">
          <div className={`p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl transition-all duration-500 ${uploading ? 'scale-75 opacity-0' : 'hover:scale-110 hover:bg-indigo-600'}`}>
            <Upload size={40} />
          </div>
          {!uploading ? (
            <div>
              <p className="text-2xl font-black text-slate-800 tracking-tight">Kéo thả hoặc nhấn để tải lên</p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Hỗ trợ PDF, DOCX, Slide (Max 10MB)</p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in zoom-in-95">
                <div className="relative flex items-center justify-center">
                    <Loader2 className="animate-spin text-indigo-600" size={64} />
                    <span className="absolute font-black text-[10px] text-indigo-600">{progress}%</span>
                </div>
                <div className="w-48 bg-slate-200 h-1 rounded-full overflow-hidden mx-auto"><div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div></div>
                <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">Đang đồng bộ Cloud...</p>
            </div>
          )}
        </label>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 px-2"><CheckCircle size={14}/> Tài liệu lớp học ({materials.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {materials.map((file) => (
            <div key={file.id} className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between hover:border-white hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-500">
              <div className="flex items-center gap-5 cursor-pointer" onClick={() => { setSelectedFile(file); setIsPreviewOpen(true); }}>
                <div className="p-4 bg-slate-50 text-slate-400 rounded-3xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500"><FileText size={24} /></div>
                <div className="max-w-[200px] md:max-w-[280px]">
                  <p className="font-bold text-slate-800 text-base truncate">{file.title}</p>
                  <p className="text-[9px] font-black text-slate-300 uppercase mt-1 tracking-widest">{file.fileType || 'Doc'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => handleDelete(file.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={20} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FilePreviewModal isOpen={isPreviewOpen} file={selectedFile} onClose={() => setIsPreviewOpen(false)} />
    </div>
  );
}