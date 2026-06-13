import React, { useEffect, useState, useMemo, useContext } from 'react';
import axios from 'axios';
import {
    BookOpen, GraduationCap, ChevronDown, ChevronUp,
    CheckCircle2, HelpCircle, Award, Clock, AlertCircle
} from 'lucide-react';
import { AuthContext } from "../../Context/AuthContext";

const CurriculumPage = () => {
    const { user } = useContext(AuthContext);
    const [curriculum, setCurriculum] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedSemesters, setExpandedSemesters] = useState({});
    
    const studentCode = user?.studentCode;

    useEffect(() => {
        const fetchCurriculum = async () => {
            if (!studentCode) return;
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/api/students/${studentCode}/curriculum`);
                setCurriculum(response.data);
            } catch (err) {
                setError("Không thể tải chương trình đào tạo. Vui lòng kiểm tra kết nối.");
            } finally {
                setLoading(false);
            }
        };
        fetchCurriculum();
    }, [studentCode]);

    const sortedSemesters = useMemo(() => {
        const getVal = (name) => {
            if (!name || typeof name !== 'string') return 0;
            const roman = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8 };
            const match = name.match(/\d+|[IVXLCDM]+$/i);
            if (!match) return 0;
            const val = match[0].toUpperCase();
            return roman[val] || parseInt(val) || 0;
        };
        return Object.entries(curriculum).sort(([a], [b]) => getVal(a) - getVal(b));
    }, [curriculum]);

    const programRequiredCredits = useMemo(() => {
        const firstSem = Object.values(curriculum)[0];
        return firstSem?.[0]?.programRequiredCredits || 0;
    }, [curriculum]);

    const processSemester = (subjects) => {
        const optional = subjects.filter(s => s.courseType === "OPTIONAL");
        const mandatory = subjects.filter(s => s.courseType === "MANDATORY");
        const mandatoryCredits = mandatory.reduce((sum, s) => sum + s.credit, 0);
        const minOpt = subjects[0]?.minOptionalCredits || 0;

        return {
            mandatory,
            optional,
            mandatoryCredits,
            minOpt,
            totalHK: mandatoryCredits + (optional.length > 0 ? minOpt : 0)
        };
    };

    const toggleSemester = (name) => {
        setExpandedSemesters(prev => ({ ...prev, [name]: !prev[name] }));
    };

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorScreen message={error} />;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
            <div className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-30 shadow-sm">
                <div className="w-full px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
                            <GraduationCap size={28} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Chương trình đào tạo</h1>
                            <p className="text-slate-500 text-[10px] font-bold uppercase flex items-center gap-1.5">
                                <BookOpen size={12} className="text-blue-500" /> Ngành Công nghệ thông tin
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 bg-slate-50 border border-slate-200 px-6 py-2 rounded-2xl">
                        <div className="text-center">
                            <p className="text-[9px] text-slate-400 uppercase font-black">Tổng tín chỉ yêu cầu</p>
                            <p className="text-xl font-black text-blue-600">{programRequiredCredits} <span className="text-[10px] text-slate-400 font-normal">TC</span></p>
                        </div>
                        <div className="h-8 w-px bg-slate-200" />
                        <div className="text-center">
                            <p className="text-[9px] text-slate-400 uppercase font-black">Mã Sinh Viên</p>
                            <p className="text-xl font-black text-slate-700">{studentCode}</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="w-full px-6 mt-10 space-y-4">
                {sortedSemesters.map(([name, subjects]) => {
                    const { mandatory, optional, mandatoryCredits, minOpt, totalHK } = processSemester(subjects);
                    const isExpanded = expandedSemesters[name];

                    return (
                        <div key={name} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:border-blue-200 transition-all">
                            <button
                                onClick={() => toggleSemester(name)}
                                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${isExpanded ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400'}`}>
                                        {name.match(/\d+|[IVXLCDM]+$/i)?.[0] || '?'}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{name}</h3>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase">
                                            {mandatoryCredits} TC Bắt buộc •  {minOpt} TC Tự chọn
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="hidden md:block text-right">
                                        <p className="text-[9px] text-slate-400 uppercase font-black">Tổng HK</p>
                                        <p className="text-lg font-black text-slate-700">{totalHK} TC</p>
                                    </div>
                                    {isExpanded ? <ChevronUp className="text-blue-600" /> : <ChevronDown className="text-slate-300" />}
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="p-8 pt-0 border-t border-slate-50 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="mt-6">
                                        <div className="flex items-center gap-2 mb-4 text-blue-600">
                                            <CheckCircle2 size={16} />
                                            <h4 className="text-[11px] font-black uppercase tracking-widest">Học phần bắt buộc ({mandatoryCredits} TC)</h4>
                                        </div>
                                        <div className="grid gap-3">
                                            {mandatory.map(s => <SubjectRow key={s.subjectId} subject={s} />)}
                                        </div>
                                    </div>

                                    {optional.length > 0 && (
                                        <div className="mt-10 pt-8 border-t border-dashed border-slate-100">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2 text-amber-600">
                                                    <HelpCircle size={16} />
                                                    <h4 className="text-[11px] font-black uppercase tracking-widest">Học phần tự chọn</h4>
                                                </div>
                                                <div className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full border border-amber-100">
                                                    Yêu cầu: Tích lũy tối thiểu {minOpt} Tín chỉ
                                                </div>
                                            </div>
                                            <div className="grid gap-3">
                                                {optional.map(s => <SubjectRow key={s.subjectId} subject={s} isOptional />)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </main>
        </div>
    );
};

const SubjectRow = ({ subject, isOptional = false }) => (
    <div className={`flex flex-col md:flex-row md:items-center justify-between p-4 px-5 rounded-2xl border transition-all ${isOptional ? 'bg-slate-50/50 border-slate-100' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'}`}>
        <div className="flex items-center gap-5">
            <div className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl min-w-[80px] text-center">
                {subject.subjectCode}
            </div>
            <div>
                <p className="text-sm font-bold text-slate-700">{subject.subjectName}</p>
                <span className="text-[9px] px-2 py-0.5 rounded-md font-black uppercase border bg-blue-50 text-blue-600 border-blue-100 mt-1 inline-block">
                    {subject.knowledgeBlockName}
                </span>
            </div>
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0 ml-14 md:ml-0">
            <div className="flex gap-4 text-[10px] font-bold text-slate-400">
                <span className="flex items-center gap-1"><Clock size={12} /> {subject.lectureHours} LT</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {subject.practiceHours} TH</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black border ${isOptional ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                <Award size={14} /> {subject.credit} TC
            </div>
        </div>
    </div>
);

const LoadingScreen = () => (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mb-4" />
        <p className="text-slate-500 font-bold">Đang tải chương trình học...</p>
    </div>
);

const ErrorScreen = ({ message }) => (
    <div className="flex flex-col justify-center items-center h-screen">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <p className="text-red-700 font-bold">{message}</p>
    </div>
);

export default CurriculumPage;