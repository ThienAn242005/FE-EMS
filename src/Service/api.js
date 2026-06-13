import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // đổi nếu backend khác port
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Sửa lại Interceptor trong file api.js của bạn
api.interceptors.request.use(
  (config) => {
    // 1. Lấy chuỗi JSON từ key "user"
    const savedUser = localStorage.getItem("user");
    
    if (savedUser) {
      try {
        // 2. Parse nó ra thành Object
        const parsedUser = JSON.parse(savedUser);
        const token = parsedUser.token; // Trích xuất token từ Object

        if (token && token !== "dummy_token") {
          config.headers.Authorization = `Bearer ${token}`;
          // Console log để bạn kiểm tra xem token có thực sự được gắn vào không
          console.log("Token sent:", token.substring(0, 15) + "..."); 
        }
      } catch (error) {
        console.error("Lỗi parse user từ localStorage:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚫 Xử lý khi bị block học phí / hết hạn token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 &&
        error.response?.data?.code === "TUITION_UNPAID") {
      window.location.href = "/tuition-payment";
    }

    // if (error.response?.status === 401) {
    //   localStorage.clear();
    //   window.location.href = "/login";
    // }

    return Promise.reject(error);
  }
);

export default api;
