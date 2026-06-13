import { Link } from "react-router-dom";

export default function HeroBanner() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      
      {/* Background Image */}
      <img
        src="/images/uni.jpg"
        alt="VUST Campus"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
          VUST <span className="text-blue-400">Portal</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
          Empowering Academic Excellence
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Đăng nhập
          </Link>

          <Link
            to="/about"
            className="px-8 py-3 rounded-lg border border-white/40 text-white hover:bg-white/10 transition"
          >
            Giới thiệu
          </Link>
        </div>
      </div>
    </section>
  );
}
