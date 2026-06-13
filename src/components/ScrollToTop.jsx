import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuộn lên đầu trang với hiệu ứng mượt mà (smooth) hoặc tức thì (auto)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Dùng "smooth" nếu muốn thấy thanh cuộn chạy lên
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;