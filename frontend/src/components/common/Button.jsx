function Button({
    children,
    type = "button",
    variant = "primary",
    onClick,
    className = "",
}) {
    const base =
        "px-6 py-3 rounded-xl font-medium transition-all duration-300";

    const styles = {
        primary:
            "bg-black text-white hover:bg-neutral-800",

        secondary:
            "bg-[#C2A878] text-black hover:bg-[#B3996A]",

        outline:
            "border border-black text-black hover:bg-black hover:text-white",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${base} ${styles[variant]} ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;