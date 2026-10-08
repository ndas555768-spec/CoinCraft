import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

function Hero() {
  return (
    <section className="min-h-screen bg-[#FAF8F5] flex items-center pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Side */}
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0DC] border border-[#E8DFC8] text-stone-800 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} className="text-[#A68A56]" />
            <span>Next-Gen Smart Piggy Bank & Wealth Hub</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-stone-900 tracking-tight mb-6">
            Master Your Money. <br />
            <span className="text-[#A68A56]">Build Your Future.</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 mb-8 max-w-lg leading-relaxed">
            CoinCraft empowers you to track incomes, control categorical budgets, and grow your digital piggy-bank savings jars with crystal clarity.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="px-7 py-3.5 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 active:scale-95 transition shadow-md flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/login"
              className="px-7 py-3.5 border border-stone-300 bg-white text-stone-800 rounded-xl font-semibold hover:bg-stone-50 active:scale-95 transition"
            >
              Live Demo Login
            </Link>
          </div>

          <div className="flex items-center gap-6 mt-10 text-xs text-stone-500 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>Strict Data Isolation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={16} className="text-[#A68A56]" />
              <span>Real-Time Analytics</span>
            </div>
          </div>
        </div>

        {/* Right Side Showcase Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-200/80 p-6 sm:p-8 max-w-md mx-auto w-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FAF0DC] flex items-center justify-center text-[#A68A56] font-bold text-xs">
                CC
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  CoinCraft Pulse
                </p>
                <p className="text-xs font-bold text-stone-900">Personal Vault</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              Verified
            </span>
          </div>

          <p className="text-xs text-stone-400 uppercase font-semibold tracking-wider">
            Net Savings & Inflows
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1 mb-6">
            Real-Time Balance
          </h2>

          <div className="space-y-3.5 pt-4 border-t border-stone-100">
            <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="font-medium text-emerald-900">Track Inflows</span>
              <strong className="text-emerald-700">Salary, Freelance, ROI</strong>
            </div>

            <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-rose-50/60 border border-rose-100">
              <span className="font-medium text-rose-900">Control Outflows</span>
              <strong className="text-rose-700">Food, Bills, Shopping</strong>
            </div>

            <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-amber-50/60 border border-amber-100">
              <span className="font-medium text-amber-900">Piggy-Bank Jars</span>
              <strong className="text-amber-800">Emergency, Travel, Tech</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;