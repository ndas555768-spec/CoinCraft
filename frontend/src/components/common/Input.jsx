function Input({
    type = "text",
    placeholder,
    register,
    name,
}) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            {...register(name)}
            className="
      w-full
      rounded-xl
      border
      border-stone-300
      bg-white
      px-4
      py-3
      outline-none
      focus:border-black
      transition
      "
        />
    );
}

export default Input;