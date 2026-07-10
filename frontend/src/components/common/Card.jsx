function Card({ children, className = "" }) {
    return (
        <div
            className={`
      bg-white
      rounded-2xl
      shadow-sm
      border
      border-stone-200
      p-6
      ${className}
      `}
        >
            {children}
        </div>
    );
}

export default Card;