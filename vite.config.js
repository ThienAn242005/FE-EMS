import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  define: {
    // Định nghĩa global là window
    global: 'window',
  },
  // THÊM ĐOẠN NÀY VÀO:
  server: {
    host: '0.0.0.0', // Cho phép truy cập từ mọi thiết bị trong cùng mạng WiFi
    port: 5173      // Đảm bảo đúng port ông đang dùng
  }
})