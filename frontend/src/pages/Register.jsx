import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";

function Register() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {
        try {
            await registerUser({
                username: data.username.trim(),
                email: data.email.trim(),
                password: data.password,
            });

            alert("Registration successful! Please log in.");
            navigate("/login");
        } catch (error) {
            const backendErrors = error?.response?.data;
            const message =
                backendErrors && typeof backendErrors === "object"
                    ? Object.values(backendErrors)
                          .flat()
                          .join(" ")
                    : "Registration failed. Please try again.";

            alert(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Create account</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        {...register("username", { required: "Username is required" })}
                        className="w-full border p-3 rounded-lg"
                    />
                    {errors.username && (
                        <p className="text-red-600 text-sm">{errors.username.message}</p>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email address",
                            },
                        })}
                        className="w-full border p-3 rounded-lg"
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm">{errors.email.message}</p>
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters",
                            },
                        })}
                        className="w-full border p-3 rounded-lg"
                    />
                    {errors.password && (
                        <p className="text-red-600 text-sm">{errors.password.message}</p>
                    )}

                    <input
                        type="password"
                        placeholder="Confirm password"
                        {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) => value === password || "Passwords do not match",
                        })}
                        className="w-full border p-3 rounded-lg"
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-70"
                    >
                        {isSubmitting ? "Creating account..." : "Register"}
                    </button>
                </form>

                <p className="text-center mt-4 text-sm text-stone-600">
                    Already have an account? {" "}
                    <Link to="/login" className="text-blue-600 font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;