import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Coins, ArrowRight, Lock, Mail, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Register() {
  const navigate = useNavigate();
  const { register: registerAuth } = useAuth();
  const toast = useToast();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await registerAuth({
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
        confirm_password: data.confirmPassword,
      });

      toast.success("Account created successfully! Welcome to CoinCraft.");
      navigate("/dashboard");
    } catch (error) {
      const backendErrors = error?.response?.data;
      let message = "Registration failed. Please try again.";
      if (backendErrors && typeof backendErrors === "object") {
        message = Object.values(backendErrors).flat().join(" ");
      }
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#A68A56] to-[#C2A878] flex items-center justify-center text-white shadow-md shadow-[#C2A878]/30 mb-4">
            <Coins size={30} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Create an Account
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Start tracking, budgeting, and growing your savings today
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                type="text"
                placeholder="nandita"
                {...register("username", {
                  required: "Username is required",
                  minLength: { value: 3, message: "Username must be at least 3 characters" },
                })}
                className="w-full pl-11 pr-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#C2A878] focus:border-transparent transition"
              />
            </div>
            {errors.username && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className="w-full pl-11 pr-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#C2A878] focus:border-transparent transition"
              />
            </div>
            {errors.email && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                type="password"
                placeholder="At least 8 characters"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className="w-full pl-11 pr-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#C2A878] focus:border-transparent transition"
              />
            </div>
            {errors.password && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                type="password"
                placeholder="Repeat password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === getValues("password") || "Passwords do not match",
                })}
                className="w-full pl-11 pr-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#C2A878] focus:border-transparent transition"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-stone-900 hover:bg-stone-800 active:scale-[0.99] transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-stone-500">
          Already have an account?{" "}
          <Link to="/login" className="text-[#8C734B] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;