import React from "react";

export default function Footer() {
  return (
    <footer className="mt-10 bg-blue-700 text-white py-6 px-5">
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6">

        {/* LOGO + INTRO */}
        <div>
          <h2 className="text-xl font-bold">VUST – Vietnam University of Science and Technology</h2>
          <p className="text-blue-100 mt-2 text-sm">
            Hệ thống hỗ trợ sinh viên: học tập – tra cứu – đăng ký tín chỉ.
          </p>
        </div>

        {/* NAVIGATION */}
        <div>
          <h3 className="font-semibold mb-2">Điều hướng</h3>
          <ul className="space-y-1 text-blue-100 text-sm">
            <li className="hover:text-white cursor-pointer">Trang chủ</li>
            <li className="hover:text-white cursor-pointer">Khóa học</li>
            <li className="hover:text-white cursor-pointer">Tài chính</li>
            <li className="hover:text-white cursor-pointer">Thông báo</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold mb-2">Liên hệ</h3>
          <p className="text-blue-100 text-sm">227 Nguyễn Văn Cừ, Q.5, TP. HCM</p>
          <p className="text-blue-100 text-sm mt-1">support@vust.edu.vn</p>
          <p className="text-blue-100 text-sm">(+84) 028 3835 2051</p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center mt-6 text-blue-200 text-sm border-t border-blue-500 pt-4">
        © {new Date().getFullYear()} VUST – Faculty of Information Technology.  
        <br /> All rights reserved.
      </div>
    </footer>
  );
}
