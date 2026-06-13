import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CurriculumTable = () => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    // Gán trực tiếp ID là 10 để test
    const studentId = 10; 

    useEffect(() => {
        const fetchCurriculum = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/students/${studentId}/curriculum`);
                setCourses(response.data);
            } catch (err) {
                console.error("Lỗi fetch data:", err);
                setError("Không thể tải chương trình khung. Kiểm tra ID 10 đã được gán khoa chưa?");
            }
        };

        fetchCurriculum();
    }, []);

    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Chương Trình Khung - Sinh Viên ID: {studentId}</h2>
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f2f2f2' }}>
                    <tr>
                        <th>Mã Môn Học</th>
                        <th>Tên Môn Học</th>
                        <th>Số Tín Chỉ</th>
                        <th>Số Giờ Lý Thuyết</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <tr key={course.id}>
                                <td>{course.courseCode}</td>
                                <td>{course.courseName}</td>
                                <td>{course.credit}</td>
                                <td>{course.lectureHours}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>
                                Chưa có môn học nào trong chương trình này.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CurriculumTable;