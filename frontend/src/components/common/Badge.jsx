function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-stone-100 text-stone-700 border-stone-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    primary: "bg-[#F7F3ED] text-[#8C734B] border-[#E8DFC8]",
    info: "bg-sky-50 text-sky-700 border-sky-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
