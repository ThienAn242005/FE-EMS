export default function Card({ title, children, blue, isHover }) {
  return (
    <div className={`p-4 bg-white rounded-xl shadow-sm border 
        ${blue ? "border-blue-200" : "border-slate-200"}
        ${isHover ? "hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer" : ""}
      `}
    >
      <h2 className="text-lg font-semibold mb-3 text-blue-700">{title}</h2>
      {children}
    </div>
  );
}
