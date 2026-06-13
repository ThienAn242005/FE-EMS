import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react'; // Sử dụng icon từ lucide-react

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Kiểm tra vị trí cuộn
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Hiệu ứng cuộn mượt
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        type="button"
        onClick={scrollToTop}
        className={`
          p-3 rounded-full bg-blue-600 text-white shadow-2xl 
          transition-all duration-300 ease-in-out
          hover:bg-blue-700 hover:scale-110 active:scale-95
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
        `}
      >
        <ChevronUp size={24} strokeWidth={3} />
      </button>
    </div>
  );
};

export default BackToTop;