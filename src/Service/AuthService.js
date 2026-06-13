import axios from "axios";

// Đảm bảo đồng nhất dùng /api cho tất cả nếu Backend của bạn cấu hình như vậy
const API_URL = "http://localhost:8080/api";

/**
 * Đăng nhập: Gửi username/password trong Body
 */
export const login = async (username, password) => {
  // Gửi tới: http://localhost:8080/api/login
  // Request Body: { username: "...", password: "..." }
  const res = await axios.post(`${API_URL}/login`, { username, password });
  return res.data; 
};

/**
 * Lấy thông tin sinh viên cụ thể (Ví dụ ID 10)
 */
export const getStudentById = async (id, token) => {
  // Gửi tới: http://localhost:8080/api/students/10
  const res = await axios.get(`${API_URL}/students/${id}`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
};