import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Coins, ArrowRight, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const from = location.state?.from?.pathname || "/dashboard";

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await login({
        email: data.email.trim(),
        password: data.password,
      });
      toast.success("Welcome back to CoinCraft!");
      navigate(from, { replace: true });
    } catch (error) {
      const errorMsg =
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.detail ||
        (typeof error.response?.data === "object"
          ? Object.values(error.response.data).flat().join(" ")
          : null) ||
        "Invalid email or password. Please try again.";
      setServerError(errorMsg);
      toast.error(errorMsg);
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
            Sign in to CoinCraft
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Access your wealth dashboard and smart piggy-bank
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    message: "Please enter a valid email",
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
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
                className="w-full pl-11 pr-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#C2A878] focus:border-transparent transition"
              />
            </div>
            {errors.password && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-stone-900 hover:bg-stone-800 active:scale-[0.99] transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-stone-500">
          Don't have an account yet?{" "}
          <Link to="/register" className="text-[#8C734B] font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;