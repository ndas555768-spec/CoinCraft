import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function BudgetProgress({ budgets = [] }) {
  const { formatCurrency } = useAuth();

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              Monthly Budgets
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Current month category caps & tracking
            </p>
          </div>
          <Link
            to="/budget"
            className="text-xs font-semibold text-[#8C734B] hover:text-[#705b38] flex items-center gap-1 transition"
          >
            <span>Manage</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {budgets.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-sm">
            <p>No budgets configured for this month.</p>
            <Link
              to="/budget"
              className="inline-block mt-3 text-xs font-semibold text-[#8C734B] hover:underline"
            >
              + Create a Monthly Budget
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.slice(0, 4).map((b) => {
              const percent = Math.min(Number(b.percentage_used) || 0, 100);
              const isExceeded = b.status === "exceeded";
              const isWarning = b.status === "warning";

              let barColor = "bg-emerald-500";
              if (isExceeded) barColor = "bg-rose-500";
              else if (isWarning) barColor = "bg-amber-500";

              return (
                <div key={b.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                      {b.category}
                      {isExceeded && (
                        <AlertTriangle size={13} className="text-rose-500" />
                      )}
                    </span>
                    <span className="text-stone-500 font-medium">
                      <strong className={isExceeded ? "text-rose-600 font-bold" : "text-stone-800"}>
                        {formatCurrency(b.spent)}
                      </strong>{" "}
                      / {formatCurrency(b.amount)}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-stone-400">
                    <span>{b.percentage_used}% used</span>
                    <span>{formatCurrency(b.remaining)} left</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default BudgetProgress;