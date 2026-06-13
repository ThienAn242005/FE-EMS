import React from 'react';
import { NavLink } from 'react-router-dom'; // Dùng NavLink để tự đổi màu khi click
import { Home, ListChecks } from 'lucide-react';

export default function Sidebar({ items }) {
  return (
    <div className="w-64 bg-[#003d7c] min-h-screen text-white flex flex-col shadow-lg">
      <div className="p-6 border-b border-blue-900 text-center">
        <p className="font-bold text-sm tracking-widest">HCMUS PORTAL</p>
      </div>
      
      <nav className="p-4 space-y-2">
        {items.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            end // Để không bị highlight trùng khi ở trang chủ
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive 
                ? 'bg-white text-[#003d7c] font-bold shadow-md' 
                : 'hover:bg-blue-800 text-blue-100'
              }`
            }
          >
            {item.label === 'Home' ? <Home size={18} /> : <ListChecks size={18} />}
            <span className="text-sm uppercase tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}