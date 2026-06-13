import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

// Hệ màu Tailwind chuyên nghiệp
const COLORS = {
    primary: '#1d4ed8', // blue-700
    danger: '#ef4444',  // red-500
    gray: '#64748b',    // slate-500
    success: '#10b981'  // emerald-500
};

export const alertService = {
    // 1. Toast thông báo nhanh - Cấu hình style Tailwind cho gọn
    success: (msg) => toast.success(msg, {
        duration: 3000,
        style: {
            borderRadius: '12px',
            background: '#334155', // slate-800
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
        },
    }),

    error: (msg) => toast.error(msg, {
        duration: 4000,
        style: {
            borderRadius: '12px',
            background: COLORS.danger,
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
        },
    }),

    // 2. SweetAlert2 xác nhận - Cấu hình layout hiện đại
    confirmDelete: async (title, text) => {
        return await Swal.fire({
            title: `<span class="text-xl font-bold text-slate-800">${title || 'Xác nhận hủy?'}</span>`,
            html: `<span class="text-sm text-slate-500 font-medium">${text || 'Hành động này sẽ không thể hoàn tác!'}</span>`,
            icon: 'warning',
            iconColor: COLORS.danger,
            showCancelButton: true,
            confirmButtonText: 'Đồng ý ',
            cancelButtonText: 'Quay lại',
            confirmButtonColor: COLORS.danger,
            cancelButtonColor: COLORS.gray,
            reverseButtons: true, // Nút "Hủy" bên trái, "Đồng ý" bên phải theo chuẩn UX
            borderRadius: '24px', // Bo tròn cực đại kiểu Tailwind 3.x
            padding: '2rem',
            customClass: {
                popup: 'rounded-[2.5rem] border-none shadow-2xl',
                confirmButton: 'rounded-xl px-6 py-3 font-bold text-sm uppercase tracking-wider',
                cancelButton: 'rounded-xl px-6 py-3 font-bold text-sm uppercase tracking-wider'
            }
        });
    },

    // 3. SweetAlert2 báo thành công lớn - Hiệu ứng chuyên nghiệp
    successModal: (title, text) => {
        Swal.fire({
            title: `<span class="text-2xl font-black text-slate-800">${title}</span>`,
            html: `<span class="text-slate-500 font-medium">${text}</span>`,
            icon: 'success',
            iconColor: COLORS.success,
            confirmButtonText: 'TUYỆT VỜI',
            confirmButtonColor: COLORS.primary,
            borderRadius: '24px',
            padding: '2.5rem',
            showClass: {
                popup: 'animate__animated animate__zoomIn animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOut animate__faster'
            },
            customClass: {
                popup: 'rounded-[2.5rem] border-none shadow-2xl',
                confirmButton: 'rounded-xl px-10 py-3 font-black text-xs uppercase tracking-widest'
            }
        });
    }
};