import { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import SummaryCards from "../components/dashboard/SummaryCards";
import IncomeExpenseChart from "../components/dashboard/IncomeExpenseChart";
import CategoryBreakdownChart from "../components/dashboard/CategoryBreakdownChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import BudgetProgress from "../components/dashboard/BudgetProgress";
import GoalsProgress from "../components/dashboard/GoalsProgress";
import { getDashboardData } from "../services/dashboard";
import { useAuth } from "../context/AuthContext";
import { RefreshCw, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Link } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardData();
      setData(res);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Unable to load your financial dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const displayName = user?.username || (user?.email ? user.email.split("@")[0] : "Investor");

  return (
    <DashboardLayout>
      {/* Welcome Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Welcome back, {displayName} 👋
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Here is your financial pulse and piggy-bank overview for this month.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="p-2.5 rounded-xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition shadow-2xs"
            title="Refresh dashboard"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          </button>
          <Link
            to="/income"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition shadow-2xs"
          >
            <ArrowUpRight size={17} />
            <span>Add Income</span>
          </Link>
          <Link
            to="/expenses"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition shadow-2xs"
          >
            <ArrowDownRight size={17} />
            <span>Add Expense</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-white rounded-2xl border border-stone-200/80 p-6 animate-pulse"
              />
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-white rounded-2xl border border-stone-200/80 p-6 animate-pulse" />
            <div className="h-96 bg-white rounded-2xl border border-stone-200/80 p-6 animate-pulse" />
          </div>
        </div>
      ) : error ? (
        <div className="p-8 bg-white rounded-2xl border border-rose-200 text-center max-w-lg mx-auto my-12 shadow-sm">
          <p className="text-rose-600 font-semibold mb-4">{error}</p>
          <button
            onClick={fetchDashboard}
            className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition"
          >
            Retry Loading
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Metric Cards */}
          <SummaryCards summary={data?.summary} />

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <IncomeExpenseChart trend={data?.monthly_trend} />
            </div>
            <div>
              <CategoryBreakdownChart categories={data?.category_breakdown} />
            </div>
          </div>

          {/* Activity & Planning Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <RecentTransactions transactions={data?.recent_transactions} />
            </div>
            <div className="lg:col-span-1">
              <BudgetProgress budgets={data?.budget_summary} />
            </div>
            <div className="lg:col-span-1">
              <GoalsProgress goals={data?.goals} />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;