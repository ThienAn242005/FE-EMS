import React from "react";

// 1. Skeleton dạng dòng chữ
export const TextSkeleton = ({ className = "h-4 w-full" }) => (
  <div className={`bg-slate-200 animate-pulse rounded ${className}`}></div>
);

// 2. Skeleton Banner (Cho trang chủ)
export const BannerSkeleton = () => (
  <div className="w-full h-64 md:h-80 bg-slate-200 animate-pulse rounded-2xl shadow-inner" />
);

// 3. Skeleton Card Menu (Cho các nút chức năng Dashboard)
export const MenuCardSkeleton = () => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 animate-pulse shadow-sm">
    <div className="h-4 w-1/2 bg-slate-200 rounded mb-8" />
    <div className="py-8 flex flex-col items-center border-2 border-dashed border-slate-50 rounded-[2rem]">
      <div className="w-12 h-12 bg-slate-100 rounded-2xl mb-4" />
      <div className="h-3 w-24 bg-slate-50 rounded" />
    </div>
  </div>
);

// 4. Skeleton Row (Cho danh sách Môn học/Sinh viên)
export const CardSkeleton = () => (
  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 animate-pulse mb-4 shadow-sm">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
        <div className="space-y-2">
          <TextSkeleton className="h-4 w-48" />
          <TextSkeleton className="h-3 w-24 bg-slate-100" />
        </div>
      </div>
      <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
    </div>
  </div>
);

// 5. Skeleton Table (Cho trang quản lý của Admin)
export const TableRowSkeleton = () => (
  <div className="flex items-center gap-4 p-5 border-b border-slate-50 animate-pulse">
    <div className="w-1/4"><TextSkeleton className="h-4 w-3/4" /></div>
    <div className="w-1/4"><TextSkeleton className="h-4 w-1/2" /></div>
    <div className="w-1/4"><TextSkeleton className="h-4 w-full" /></div>
    <div className="w-1/4 flex justify-end"><div className="w-10 h-10 bg-slate-100 rounded-xl"></div></div>
  </div>
);