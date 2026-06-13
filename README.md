# 🎓 HỆ THỐNG QUẢN LÝ GIÁO DỤC (EMS) - FRONTEND

## 📖 Giới thiệu

Hệ thống Quản lý Giáo dục (Education Management System - EMS) là ứng dụng web hỗ trợ quản lý và theo dõi các hoạt động học tập, đào tạo và hành chính trong môi trường giáo dục.

Hệ thống được xây dựng bằng ReactJS và Vite, cung cấp giao diện riêng cho nhiều nhóm người dùng như Sinh viên, Giảng viên, Kế toán và Quản trị viên.

---

## 🎯 Mục tiêu

* Số hóa quy trình quản lý giáo dục.
* Hỗ trợ sinh viên tra cứu thông tin học tập.
* Hỗ trợ giảng viên quản lý và theo dõi sinh viên.
* Hỗ trợ kế toán quản lý học phí.
* Hỗ trợ quản trị viên vận hành toàn bộ hệ thống.

---

## ✨ Chức năng chính

### 👨‍🎓 Sinh viên

* Đăng nhập hệ thống
* Xem Dashboard cá nhân
* Quản lý hồ sơ cá nhân
* Xem thẻ sinh viên điện tử
* Theo dõi kết quả học tập
* Cập nhật thông tin tài khoản

### 👨‍🏫 Giảng viên

* Dashboard giảng viên
* Theo dõi thông tin sinh viên
* Quản lý dữ liệu học tập
* Quản lý hồ sơ cá nhân

### 💰 Kế toán

* Quản lý học phí
* Theo dõi các khoản thanh toán
* Quản lý thông tin tài chính

### 🛠️ Quản trị viên

* Dashboard tổng quan
* Quản lý người dùng
* Quản lý dữ liệu hệ thống
* Quản lý hoạt động đào tạo

---

## 🏗️ Kiến trúc giao diện

Hệ thống được thiết kế theo mô hình phân quyền theo vai trò (Role-Based Access Control).

```text
Người dùng
     │
     ▼
Đăng nhập
     │
     ▼
Phân quyền theo vai trò
     │
 ┌───┼───────────┬───────────┐
 ▼   ▼           ▼           ▼
Admin Teacher Student Accountant
```

---

## 🚀 Công nghệ sử dụng

### Frontend

* ReactJS
* Vite
* React Router DOM
* Axios
* Context API
* Tailwind CSS
* Lucide React

### Công cụ phát triển

* ESLint
* npm

---

## 📂 Cấu trúc thư mục

```text
src/
│
├── assets/
├── components/
├── contexts/
├── hooks/
├── layouts/
├── pages/
│   ├── admin/
│   ├── teacher/
│   ├── student/
│   └── accountant/
│
├── services/
├── routes/
└── main.jsx
```

---

## ⚙️ Cài đặt và chạy dự án

### Clone source code

```bash
git clone https://github.com/ThienAn242005/FE-EMS.git
```

### Cài đặt thư viện

```bash
npm install
```

### Chạy môi trường phát triển

```bash
npm run dev
```

Sau khi chạy thành công, truy cập:

```text
http://localhost:5173
```

---

## 🔐 Cấu hình môi trường

Tạo file `.env`

```env
VITE_API_URL=http://localhost:8080
```

Ví dụ:

```env
VITE_API_URL=https://api.your-domain.com
```

---

## 📸 Hình ảnh giao diện

### Dashboard Sinh viên

(Thêm ảnh giao diện tại đây)

### Dashboard Giảng viên

(Thêm ảnh giao diện tại đây)

### Quản lý hồ sơ

(Thêm ảnh giao diện tại đây)

### Theo dõi kết quả học tập

(Thêm ảnh giao diện tại đây)

---

## 🔮 Hướng phát triển

* Quản lý điểm số
* Quản lý môn học
* Quản lý lớp học
* Đăng ký học phần
* Quản lý lịch học
* Quản lý lịch thi
* Thông báo thời gian thực
* Chat nội bộ
* Phân tích học tập bằng AI

---

## 👨‍💻 Tác giả

**Lê Võ Thiên Ân**

GitHub: https://github.com/ThienAn242005

---

## 📄 Giấy phép

Dự án được phát triển phục vụ mục đích học tập, nghiên cứu và xây dựng portfolio cá nhân.
