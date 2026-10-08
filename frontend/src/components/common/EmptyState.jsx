import Button from "./Button";

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-stone-300 ${className}`}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-[#F7F3ED] flex items-center justify-center text-[#A68A56] mb-4">
          <Icon size={32} />
        </div>
      )}
      <h3 className="text-xl font-bold text-stone-800 mb-2">{title}</h3>
      <p className="text-stone-500 max-w-md mb-6 text-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="secondary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
