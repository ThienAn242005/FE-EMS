import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export const notify = {
    // Thông báo nhanh (Kiểu HCMUS Portal)
    success: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg),

    // Modal xác nhận (Dùng cho Hủy môn, Thoát hệ thống)
    confirm: async (title, text) => {
        return await Swal.fire({
            title: title || 'Xác nhận?',
            text: text || 'Hành động này không thể hoàn tác!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1d4ed8', // Màu xanh Primary của bạn
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
            borderRadius: '20px'
        });
    },

    // Modal báo lỗi lớn (Lỗi hệ thống 500)
    alertError: (title, text) => {
        Swal.fire({
            title: title || 'Lỗi hệ thống',
            text: text || 'Vui lòng thử lại sau!',
            icon: 'error',
            confirmButtonColor: '#ef4444'
        });
    }
};