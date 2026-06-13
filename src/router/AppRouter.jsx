import React, { useState, useEffect, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom'
import LoadingBar from 'react-top-loading-bar'
import axios from 'axios'

/* Context */
import { AuthContext } from '../Context/AuthContext'

/* Layouts */
import AdminLayout from '../layouts/AdminLayout'
import StudentLayout from '../layouts/StudentLayout'
import TeacherLayout from '../layouts/TeacherLayout'
import AccountantLayout from '../layouts/AccountantLayout'

/* Pages Import */
import DashboardHome from '../pages/admin/Dashboard'
import Students from '../pages/admin/Students'
import Teachers from '../pages/admin/Teachers'
import Courses from '../pages/admin/Courses'
import AdminNewsCRUD from '../pages/admin/News'
import AdminEnrollmentManager from '../pages/admin/Enrollment'
import AdminBannerPage from '../pages/admin/Banner'
import AdminNotificationPage from '../pages/admin/Notification'
import AdminDepartmentPage from '../pages/admin/Department'
import AdminClassRoom from '../pages/admin/Class'
import AdminSemester from '../pages/admin/Semester'
import AdminUserPage from '../pages/admin/User'
import AdminPaymentPage from '../pages/admin/Payment'
import AdminExamPage from '../pages/admin/Exam'
import AdminScheduleGenerator from '../pages/admin/Schedule'

import StudentHome from '../pages/student/Home'
import StudentProfile from '../pages/student/Profile'
import StudentSchedule from '../pages/student/Schedule'
import StudentCourses from '../pages/student/Courses'
import StudentTuition from '../pages/student/payment/Tutition'
import { Notifications } from '../pages/student/Notification'
import StudentPerformance from '../pages/student/Performance'
import CourseRegistration from '../pages/student/Enrollment'
import NewsList from '../pages/student/NewList'
import NewsDetail from '../pages/student/NewsDetail'
import StudentCard from '../pages/student/StudentCard'
import TrainingPoint from '../pages/student/TrainingPoint'
import ActivityList from '../pages/student/ActivityList'
import SettingsPage from '../pages/student/Setting'
import PaymentLockPage from '../pages/student/payment/PaymentLockPage'
import PaymentHistory from '../pages/student/payment/PaymentHistory'
import PaymentResult from '../pages/student/payment/PaymentResult'
import { Payment } from '../pages/student/payment/StudentTutition'
import VerifyInvoice from '../pages/student/payment/VerifyInvoice'

import TeacherHome from '../pages/teacher/Home'
import ManageClass from '../pages/teacher/ManageClass'
import TeacherGrading from '../pages/teacher/TeacherGrading'
import TeacherProfile from '../pages/teacher/Profile'
import TeacherAssignments from '../pages/teacher/Excercise'
import TeacherSchedule from '../pages/teacher/Schedule'
import AttendancePage from '../pages/teacher/Attendance'
import AdvisorClassPage from '../pages/teacher/AdvisorClass'
import RescheduleFinder from '../pages/teacher/RescheduleFinder'

import AccountantDashboard from '../pages/Accountant/AccountantDashboard'
import Invoices from '../pages/Accountant/Invoices'
import Payments from '../pages/Accountant/Payments'
import Tuition from '../pages/Accountant/Tuition'
import Reports from '../pages/Accountant/Reports'
import Statistics from '../pages/Accountant/Statistics'
import Requests from '../pages/Accountant/Requests'
import Settings from '../pages/Accountant/Setting'

import LoginPage from '../pages/Auth/Login'
import NotFound from '../components/NotFound'
import ScrollToTop from '../components/ScrollToTop'
import BackToTop from '../components/BackToTop'
import VustIntroduction from '../components/Intro'
import PortalHome from '../Portal/PortalHome'
import About from '../Portal/About'
import Home from '../Portal/Home'
import Training from '../Portal/Training'
import StudentPortal from '../Portal/Student'
import Admission from '../Portal/Admission'
import { Toaster } from 'react-hot-toast'
import AdminGradeManager from '../pages/admin/Grade'
import PortalLayout from '../layouts/PortalLayout'
import KhoaBoMon from '../Portal/Department'
import NghienCuu from '../Portal/Scients'
import CongKhaiGiaoDuc from '../Portal/PublicTraining'

// 🛡️ 1. HÀM BẢO VỆ ROLE CHUNG (ADMIN, TEACHER, ACCOUNTANT)
const RoleGuard = ({ allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return null; // Đợi AuthContext load xong

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />; // Hoặc trang 403 Access Denied
    }

    return <Outlet />;
};

// 🛡️ 2. COMPONENT BẢO VỆ RIÊNG CHO SINH VIÊN (Lồng ghép logic nợ/học vụ)
const StudentGuard = () => {
    const { user, studentData, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return null;

    // ⚡ SỬA TẠI ĐÂY: Nếu là ADMIN thì cho đi mọi nơi của Student
    if (user?.role === 'ADMIN') return <Outlet />;

    // Nếu không phải ADMIN thì mới check tiếp các quyền của Student
    if (!user || user.role !== 'STUDENT') {
        return <Navigate to="/login" replace />;
    }

    // Logic chặn nợ/học vụ cho Sinh viên (giữ nguyên)
    const isDismissed = studentData?.academicStatus === 'DISMISSAL' || studentData?.academic_status === 'DISMISSAL';
    const isDebt = studentData?.isDebt === true || studentData?.is_debt === true;

    if (isDebt) {
        const allowedPaths = ["/student/payment-lock", "/student/tuition", "/student/payment-detail", "/student/payment-result"];
        if (!allowedPaths.includes(location.pathname)) {
            return <Navigate to="/student/payment-lock" replace />;
        }
    }
    if (isDismissed && location.pathname !== "/student") {
        return <Navigate to="/student" replace />;
    }

    return <Outlet />;
};

function AppContent() {
    const [progress, setProgress] = useState(0);
    const { user } = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {
        setProgress(30);
        const timer = setTimeout(() => setProgress(100), 600);
        return () => clearTimeout(timer);
    }, [location]);

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use((config) => {
            setProgress(40);
            return config;
        });

        const responseInterceptor = axios.interceptors.response.use(
            (response) => {
                setProgress(100);
                return response;
            },
            (error) => {
                setProgress(100);
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    return (
        <>
            <LoadingBar
                color="linear-gradient(to right, #3b82f6, #2563eb)"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
                height={3}
            />
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{ style: { zIndex: 9999 } }}
            />
            <ScrollToTop />
            <Routes>
                {/* PUBLIC ROUTES */}
                <Route element={<PortalLayout />}>
                <Route path="khoa-bo-mon" element={<KhoaBoMon/>}/>
                <Route path="cong-khai" element={<CongKhaiGiaoDuc/>}/>
                <Route path="nghien-cuu" element={<NghienCuu/>}/>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/introduce" element={<VustIntroduction />} />
                <Route path="/gioi-thieu" element={<About />} />
                <Route path="/trang-chu" element={<Home />} />
                <Route path="/dao-tao" element={<Training />} />
                <Route path="/sinh-vien" element={<StudentPortal />} />
                <Route path="/tuyen-sinh" element={<Admission />} />
                <Route path="/tin-tuc/:id" element={<NewsDetail />} />
                <Route path="/" element={<PortalHome />} />
                </Route>
                {/* 🎓 STUDENT ROUTES */}
                <Route path="/student" element={<StudentLayout />}>
                    <Route element={<StudentGuard />}>
                        <Route index element={<StudentHome />} />
                        <Route path="payment-lock" element={<PaymentLockPage />} />
                        <Route path="schedule" element={<StudentSchedule />} />
                        <Route path="tuition" element={<StudentTuition />} />
                        <Route path="payment-detail" element={<Payment />} />
                        <Route path="curriculum" element={<StudentCourses />} />
                        <Route path="profile" element={<StudentProfile />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="performance" element={<StudentPerformance />} />
                        <Route path="register" element={<CourseRegistration />} />
                        <Route path="news/list" element={<NewsList />} />
                        <Route path="news/details/:id" element={<NewsDetail />} />
                        <Route path="card" element={<StudentCard />} />
                        <Route path="training-points" element={<TrainingPoint />} />
                        <Route path="activities" element={<ActivityList />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="payment-history" element={<PaymentHistory />} />
                        <Route path="payment-result" element={<PaymentResult />} />
                    </Route>
                    <Route path="verify-invoice/:id" element={<VerifyInvoice />} />
                </Route>

                {/* 👨‍🏫 TEACHER ROUTES */}
                <Route element={<RoleGuard allowedRoles={['TEACHER', 'ADMIN']} />}>
                    <Route path="/teacher" element={<TeacherLayout />}>
                        <Route index element={<TeacherHome />} />
                        <Route path="manage-class" element={<ManageClass />} />
                        <Route path="grading" element={<TeacherGrading />} />
                        <Route path="profile" element={<TeacherProfile />} />
                        <Route path="assignments" element={<TeacherAssignments />} />
                        <Route path="schedule" element={<TeacherSchedule />} />
                        <Route path="attendance/:scheduleId" element={<AttendancePage />} />
                        <Route path="advisor" element={<AdvisorClassPage />} />
                        <Route path="reschedule-finder/:id" element={<RescheduleFinder />} />
                    </Route>
                </Route>

                {/* 💰 ACCOUNTANT ROUTES */}
                <Route element={<RoleGuard allowedRoles={['ACCOUNTANT', 'ADMIN']} />}>
                    <Route path="/accountant" element={<AccountantLayout />}>
                        <Route index element={<AccountantDashboard />} />
                        <Route path="invoices" element={<Invoices />} />
                        <Route path="payments" element={<Payments />} />
                        <Route path="tuition" element={<Tuition />} />
                        <Route path="students" element={<Students />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="statistics" element={<Statistics />} />
                        <Route path="requests" element={<Requests />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Route>

                {/* ⚙️ ADMIN ROUTES */}
                <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<DashboardHome />} />
                        <Route path="students" element={<Students />} />
                        <Route path="grades" element={<AdminGradeManager />} />
                        <Route path="news" element={<AdminNewsCRUD />} />
                        <Route path="enrollments" element={<AdminEnrollmentManager />} />
                        <Route path="teachers" element={<Teachers />} />
                        <Route path="courses" element={<Courses />} />
                        <Route path="banners" element={<AdminBannerPage />} />
                        <Route path="notifications" element={<AdminNotificationPage />} />
                        <Route path="departments" element={<AdminDepartmentPage />} />
                        <Route path="classes" element={<AdminClassRoom />} />
                        <Route path="semesters" element={<AdminSemester />} />
                        <Route path="users" element={<AdminUserPage />} />
                        <Route path="payments" element={<AdminPaymentPage />} />
                        <Route path="exams" element={<AdminExamPage />} />
                        <Route path="schedules" element={<AdminScheduleGenerator />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
            <BackToTop />
        </>
    );
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}