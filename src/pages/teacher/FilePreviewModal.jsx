import React from 'react';
import { X, Download, FileText } from 'lucide-react';

export default function FilePreviewModal({ isOpen, file, onClose }) {
    if (!isOpen || !file) return null;

    const isPDF = file.fileType?.toLowerCase() === 'pdf' || file.filePath?.endsWith('.pdf');
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].some(ext => file.filePath?.toLowerCase().endsWith(ext));

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100"><FileText size={20} /></div>
                        <div>
                            <h3 className="font-black text-slate-800 text-base truncate max-w-md">{file.title}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VUST Document Preview</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href={file.filePath} download className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all">Tải xuống</a>
                        <button onClick={onClose} className="p-2.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all"><X size={24} /></button>
                    </div>
                </div>
                <div className="flex-1 bg-slate-50 p-6 overflow-auto">
                    {isPDF ? (
                        <iframe src={`${file.filePath}#toolbar=0`} className="w-full h-full rounded-3xl" title="PDF" />
                    ) : isImage ? (
                        <div className="flex justify-center"><img src={file.filePath} className="max-w-full rounded-3xl shadow-lg" /></div>
                    ) : (
                        /* ĐÂY LÀ CÁCH XỬ LÝ CHO WORD, EXCEL, PPT */
                        <iframe
                            src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.filePath)}`}
                            className="w-full h-full rounded-3xl border-none shadow-inner"
                            title="Office Preview"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}