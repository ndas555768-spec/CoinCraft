import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, DollarSign, Moon, Sun, Shield, Save, Check } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const CURRENCIES = [
  { code: "INR", label: "₹ INR - Indian Rupee" },
  { code: "USD", label: "$ USD - US Dollar" },
  { code: "EUR", label: "€ EUR - Euro" },
  { code: "GBP", label: "£ GBP - British Pound" },
  { code: "JPY", label: "¥ JPY - Japanese Yen" },
  { code: "CAD", label: "CA$ CAD - Canadian Dollar" },
  { code: "AUD", label: "AU$ AUD - Australian Dollar" },
];

function Profile() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [successSaved, setSuccessSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      currency: "INR",
      dark_mode: false,
    },
  });

  const darkModeVal = watch("dark_mode");

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || "",
        email: user.email || "",
        currency: user.currency || "INR",
        dark_mode: Boolean(user.dark_mode),
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setSuccessSaved(false);
    try {
      await updateProfile({
        username: data.username.trim(),
        currency: data.currency,
        dark_mode: data.dark_mode,
      });
      setSuccessSaved(true);
      toast.success("Profile preferences updated successfully!");
      setTimeout(() => setSuccessSaved(false), 3000);
    } catch (err) {
      const msg =
        err.response?.data?.username?.[0] ||
        err.response?.data?.detail ||
        "Failed to update profile.";
      toast.error(msg);
    }
  };

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <DashboardLayout>
      <PageHeader
        title="Account & Preferences"
        subtitle="Manage your profile information, display currency, and settings"
      />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: User Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-8 shadow-xs text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#C2A878] to-[#8C734B] flex items-center justify-center text-white font-extrabold text-4xl shadow-md shadow-[#C2A878]/30 mb-4">
              {initial}
            </div>

            <h2 className="text-xl font-extrabold text-stone-900">
              {user?.username || "CoinCraft User"}
            </h2>
            <p className="text-sm text-stone-400 mt-0.5">{user?.email}</p>

            <div className="w-full mt-6 pt-6 border-t border-stone-100 space-y-3 text-left text-xs">
              <div className="flex justify-between items-center text-stone-500">
                <span>Account Status</span>
                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center text-stone-500">
                <span>Selected Currency</span>
                <span className="font-bold text-stone-800">
                  {user?.currency || "INR"}
                </span>
              </div>
              <div className="flex justify-between items-center text-stone-500">
                <span>Theme Mode</span>
                <span className="font-semibold text-stone-700 capitalize">
                  {user?.dark_mode ? "Dark Mode" : "Light Mode"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF7F0] border border-[#E8DFC8] rounded-2xl p-5 text-xs text-[#8C734B] space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <Shield size={16} className="text-[#8C734B]" />
              <span>Data Protection & Privacy</span>
            </div>
            <p className="leading-relaxed text-stone-600">
              Your financial data is strictly isolated to your authenticated account.
              Every income, expense, budget, and savings goal is verified with strict
              ownership controls.
            </p>
          </div>
        </div>

        {/* Right Column: Settings Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-8 shadow-xs">
            <h3 className="text-lg font-bold text-stone-900 mb-6 pb-4 border-b border-stone-100">
              Profile Settings
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="text"
                    {...register("username", {
                      required: "Username is required",
                      minLength: { value: 3, message: "Must be at least 3 characters" },
                    })}
                    className="w-full pl-11 pr-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#C2A878] transition"
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-rose-600 mt-1">{errors.username.message}</p>
                )}
              </div>

              {/* Email (Readonly for security) */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="email"
                    disabled
                    {...register("email")}
                    className="w-full pl-11 pr-4 py-3 bg-stone-100 border border-stone-200 rounded-xl text-stone-500 text-sm cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Email is your unique login credential and cannot be changed here.
                </p>
              </div>

              {/* Currency Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Base Currency
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <select
                    {...register("currency", { required: true })}
                    className="w-full pl-11 pr-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#C2A878] transition"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  All charts, transactions, and budget calculations display in this currency.
                </p>
              </div>

              {/* Theme Preference */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-700">
                    {darkModeVal ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">
                      Dark Mode Appearance
                    </h4>
                    <p className="text-xs text-stone-500">
                      Toggle dark background styling across CoinCraft
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("dark_mode")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C2A878]" />
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition shadow-sm flex items-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Preferences...</span>
                    </>
                  ) : successSaved ? (
                    <>
                      <Check size={16} className="text-emerald-400" />
                      <span>Changes Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save Preferences</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;
