import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";
import axios from "axios";
import { 
    BookPlus, Search, Trash2, Loader2, 
    ChevronDown, ChevronUp, Calendar, Lock, AlertCircle, CheckCircle2, Users 
} from "lucide-react";
import { alertService } from "../../utils/swalUtils";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";

const API_BASE = "http://localhost:8080/api";

export default function CourseRegistration() {
    const { user, studentData } = useContext(AuthContext);
    const [subjects, setSubjects] = useState([]); 
    const [courses, setCourses] = useState([]);   
    const [enrolled, setEnrolled] = useState([]); 
    const [passedSubjectIds, setPassedSubjectIds] = useState([]); 
    const [regPeriod, setRegPeriod] = useState({ isOpen: false, data: null });
    const [expandedSubject, setExpandedSubject] = useState(null); 
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(null); 
    
    const studentCode = user?.studentCode;
    const MAX_CREDITS = 25;

    const fetchData = useCallback(async () => {
        if (!studentCode) return;
        try {
            setLoading(true);
            const [courseRes, enrollRes, periodRes, gradeRes] = await Promise.all([
                axios.get(`${API_BASE}/courses`),
                axios.get(`${API_BASE}/enrollments/student/${studentCode}`),
                axios.get(`${API_BASE}/registration-periods/check`),
                axios.get(`${API_BASE}/grades/student/code/${studentCode}`)
            ]);
            
            const rawCourses = courseRes.data?.content || courseRes.data || [];
            const rawEnrolled = enrollRes.data?.content || enrollRes.data || [];
            
            const pIds = [];
            if (Array.isArray(gradeRes.data)) {
                gradeRes.data.forEach(semester => {
                    (semester.subjects || []).forEach(s => {
                        if (s.grade >= 4.0) pIds.push(s.subjectId || s.id);
                    });
                });
            }
            setPassedSubjectIds(pIds);

            const allEnrolledSubjectIds = rawEnrolled.map(e => e.course?.subject?.id);

            const activeSemester = periodRes.data.period?.semester?.name;
            const currentSemesterCourses = rawCourses.filter(c => 
                c.semester?.name === activeSemester
            );

            setCourses(currentSemesterCourses);
            setEnrolled(rawEnrolled);
            setRegPeriod({ 
                isOpen: periodRes.data.open, 
                data: periodRes.data.period 
            });

            const uniqueSubjects = [];
            currentSemesterCourses.forEach(c => {
                if (c.subject && !uniqueSubjects.find(s => s.id === c.subject.id)) {
                    const isPassed = pIds.includes(c.subject.id);
                    const isAlreadyEnrolled = allEnrolledSubjectIds.includes(c.subject.id);
                    
                    if (!isPassed && !isAlreadyEnrolled) {
                        uniqueSubjects.push(c.subject);
                    }
                }
            });
            setSubjects(uniqueSubjects);
        } catch (err) {
            alertService.error("Không thể đồng bộ dữ liệu đào tạo");
        } finally {
            setLoading(false);
        }
    }, [studentCode]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const registrationBlocked = useMemo(() => {
        if (!regPeriod.isOpen) return "Hệ thống đang đóng";
        if (studentData?.academicStatus === "DISMISSAL") return "Tài khoản bị khóa học vụ";
        if (studentData?.academic?.isDebt || studentData?.isDebt) return "Vui lòng hoàn thành học phí trước khi đăng ký";
        return null;
    }, [regPeriod, studentData]);

    const checkPrerequisiteSatisfied = useCallback((subject) => {
        if (!subject.prerequisites || subject.prerequisites.length === 0) return { satisfied: true };
        const missing = subject.prerequisites.filter(pre => !passedSubjectIds.includes(pre.id));

        return {
            satisfied: missing.length === 0,
            missingNames: missing.map(m => m.subjectName).join(", ")
        };
    }, [passedSubjectIds]);

    const checkTimeConflict = (newCourse) => {
        const newSchedules = newCourse.schedules || [];
        const currentSem = regPeriod.data?.semester?.name;
        const currentEnrolled = enrolled.filter(e => e.course?.semester?.name === currentSem);

        for (const enrollment of currentEnrolled) {
            const existingSchedules = enrollment.course?.schedules || [];
            for (const nS of newSchedules) {
                for (const eS of existingSchedules) {
                    if (nS.dayOfWeek === eS.dayOfWeek) {
                        if (nS.startTime < eS.endTime && nS.endTime > eS.startTime) {
                            return { isConflict: true, conflictWith: enrollment.course?.subject?.subjectName };
                        }
                    }
                }
            }
        }
        return { isConflict: false };
    };

    const currentCredits = useMemo(() => {
        const currentSem = regPeriod.data?.semester?.name;
        return enrolled
            .filter(e => e.course?.semester?.name === currentSem)
            .reduce((sum, e) => sum + (e.course?.subject?.credit || 0), 0);
    }, [enrolled, regPeriod]);

    const handleRegister = async (course) => {
        if (registrationBlocked) return alertService.error(registrationBlocked);
        if (currentCredits + (course.subject?.credit || 0) > MAX_CREDITS) return alertService.error("Vượt quá số tín chỉ tối đa");

        setSubmitting(course.id);
        try {
            await axios.post(`${API_BASE}/enrollments/enroll`, { 
                studentCode: studentCode, 
                courseId: course.id 
            });
            alertService.success("Đăng ký thành công");
            fetchData(); 
        } catch (err) {
            alertService.error(err.response?.data?.message || "Lỗi đăng ký");
        } finally {
            setSubmitting(null);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
            <p className="text-slate-500 font-medium">Đang tải dữ liệu học kỳ {regPeriod.data?.semester?.name}...</p>
        </div>
    );

    return (
        <div className="p-6 w-full bg-[#f8fafc] min-h-screen font-sans">
            <Toaster position="top-right" />
            
            {registrationBlocked && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-2xl flex items-center gap-3 text-red-700 shadow-sm">
                    <AlertCircle size={20} />
                    <p className="font-bold text-sm uppercase tracking-tight">{registrationBlocked}</p>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg"><BookPlus size={28} /></div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 uppercase italic">Học kỳ: {regPeriod.data?.semester?.name || "N/A"}</h1>
                        <p className="text-slate-400 text-xs font-bold flex items-center gap-1">
                            {regPeriod.isOpen ? <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 size={14}/> Đang mở đăng ký</span> : <span className="text-red-400 flex items-center gap-1"><Lock size={14}/> Hệ thống đã đóng</span>}
                        </p>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tích lũy GPA</p>
                        <p className="text-xl font-black text-indigo-600">{studentData?.gpa || studentData?.academic?.gpa || 0.0}</p>
                    </div>
                    <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tín chỉ học kỳ</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-blue-700">{currentCredits}</span>
                            <span className="text-slate-400 font-bold text-xs">/ {MAX_CREDITS}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            disabled={!!registrationBlocked}
                            placeholder="Tìm tên môn học muốn đăng ký..."
                            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 ring-indigo-500 font-medium disabled:bg-slate-100"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {subjects.filter(s => s.subjectName.toLowerCase().includes(searchTerm.toLowerCase())).map(subject => {
                        const preStatus = checkPrerequisiteSatisfied(subject);
                        const isExpanded = expandedSubject === subject.id;

                        return (
                            <div key={subject.id} className={`bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all ${!preStatus.satisfied ? 'bg-slate-50/50' : 'hover:shadow-md'}`}>
                                <div 
                                    onClick={() => !registrationBlocked && preStatus.satisfied && setExpandedSubject(isExpanded ? null : subject.id)}
                                    className={`p-5 flex justify-between items-center ${(!registrationBlocked && preStatus.satisfied) ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${!preStatus.satisfied ? 'bg-slate-200 text-slate-400' : 'bg-indigo-50 text-indigo-700'}`}>
                                            {subject.credit}
                                        </div>
                                        <div>
                                            <h3 className={`font-black uppercase italic ${!preStatus.satisfied ? 'text-slate-400' : 'text-slate-800'}`}>{subject.subjectName}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold text-slate-400">{subject.subjectCode}</span>
                                                {!preStatus.satisfied && (
                                                    <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1">
                                                        <Lock size={10}/> Thiếu: {preStatus.missingNames}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {preStatus.satisfied && (isExpanded ? <ChevronUp size={20}/> : <ChevronDown size={20}/>)}
                                </div>

                                {isExpanded && preStatus.satisfied && (
                                    <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
                                        {courses.filter(c => c.subject?.id === subject.id).map(course => {
                                            const current = course.currentEnrolled ?? course.enrollmentCount ?? 0;
                                            const max = course.maxCapacity ?? 0;
                                            const isFull = current >= max && max > 0;
                                            const conflict = checkTimeConflict(course);
                                            const isEnrolledInActiveSem = enrolled.some(e => e.course?.id === course.id);

                                            return (
                                                <div key={course.id} className="bg-white p-5 rounded-[2rem] border border-slate-200 flex justify-between items-center shadow-sm group">
                                                    <div>
                                                        <p className="font-black text-slate-700">Mã lớp: {course.sectionCode}</p>
                                                        <div className="flex flex-wrap gap-3 mt-2">
                                                            {course.schedules?.map((sch, i) => (
                                                                <span key={i} className="text-[10px] font-bold flex items-center gap-1 text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">
                                                                    <Calendar size={12}/> Thứ {sch.dayOfWeek} ({sch.startTime.substring(0,5)}-{sch.endTime.substring(0,5)})
                                                                </span>
                                                            ))}
                                                            <span className={`text-[10px] font-bold flex items-center gap-1 px-2 py-1 rounded-lg ${isFull ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                                                                <Users size={12}/> {current}/{max} Sinh viên
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    {isEnrolledInActiveSem ? (
                                                        <span className="text-emerald-500 font-black text-[10px] uppercase flex items-center gap-1 bg-emerald-50 px-4 py-2 rounded-xl">
                                                            <CheckCircle2 size={16}/> Đã đăng ký
                                                        </span>
                                                    ) : (
                                                        <button 
                                                            disabled={!!registrationBlocked || submitting || isFull || conflict.isConflict}
                                                            onClick={() => handleRegister(course)}
                                                            className={`px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                                                                conflict.isConflict ? 'bg-orange-100 text-orange-600' : 
                                                                isFull ? 'bg-slate-100 text-slate-400' : 
                                                                'bg-indigo-600 text-white hover:bg-slate-900 shadow-lg'
                                                            } disabled:opacity-50`}
                                                        >
                                                            {submitting === course.id ? "..." : conflict.isConflict ? `Trùng lịch` : isFull ? "Hết chỗ" : "Đăng ký"}
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden sticky top-24">
                        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                            <div>
                                <h2 className="font-black uppercase italic tracking-tighter">Phiếu đăng ký</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{regPeriod.data?.semester?.name}</p>
                            </div>
                            <div className="bg-indigo-600 px-3 py-1 rounded-lg font-black text-xs">
                                {enrolled.filter(e => e.course?.semester?.name === regPeriod.data?.semester?.name).length} MÔN
                            </div>
                        </div>
                        
                        <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                            {enrolled.filter(e => e.course?.semester?.name === regPeriod.data?.semester?.name).map(e => (
                                <div key={e.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center group animate-in slide-in-from-right-4">
                                    <div className="flex-1">
                                        <p className="font-black text-slate-800 text-sm leading-tight">{e.course?.subject?.subjectName}</p>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">{e.course?.sectionCode}</span>
                                            <span className="text-[9px] font-black text-slate-400 uppercase">{e.course?.subject?.credit} Tín chỉ</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => axios.delete(`${API_BASE}/enrollments/${e.id}`).then(() => fetchData())}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {enrolled.filter(e => e.course?.semester?.name === regPeriod.data?.semester?.name).length === 0 && (
                                <div className="py-10 text-center text-slate-400 italic text-sm">Chưa có môn đăng ký</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}