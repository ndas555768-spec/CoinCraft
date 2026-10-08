import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RecentTransactions({ transactions = [] }) {
  const { formatCurrency } = useAuth();

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-stone-900">
            Recent Activity
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Your latest deposits and expenses
          </p>
        </div>
        <Link
          to="/expenses"
          className="text-xs font-semibold text-[#8C734B] hover:text-[#705b38] flex items-center gap-1 transition"
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-10 text-stone-400 text-sm">
          No transactions recorded yet. Start by logging an income or expense!
        </div>
      ) : (
        <div className="divide-y divide-stone-100">
          {transactions.map((item) => {
            const isIncome = item.type === "income";

            return (
              <div
                key={item.id}
                className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isIncome
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {isIncome ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-stone-900 text-sm truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-stone-400 font-medium">
                        {item.date}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-stone-300" />
                      <span className="text-xs text-stone-500 font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-4">
                  <p
                    className={`font-bold text-sm ${
                      isIncome ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {isIncome ? "+" : "-"}{formatCurrency(item.amount)}
                  </p>
                  <p className="text-[11px] text-stone-400 capitalize">
                    {item.payment_method !== "N/A" ? item.payment_method : "Deposit"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecentTransactions;