import { Link } from "react-router-dom";
import { ArrowRight, Trophy } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function GoalsProgress({ goals = [] }) {
  const { formatCurrency } = useAuth();

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              Savings Goals
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Track progress toward financial milestones
            </p>
          </div>
          <Link
            to="/goals"
            className="text-xs font-semibold text-[#8C734B] hover:text-[#705b38] flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-sm">
            <p>No active savings goals yet.</p>
            <Link
              to="/goals"
              className="inline-block mt-3 text-xs font-semibold text-[#8C734B] hover:underline"
            >
              + Create a Savings Goal
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.slice(0, 3).map((g) => {
              const percent = Math.min(Number(g.percentage_completed) || 0, 100);
              const isCompleted = g.status === "completed" || percent >= 100;

              return (
                <div key={g.id} className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 text-sm">
                        {g.title}
                      </span>
                      {isCompleted && (
                        <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                          <Trophy size={13} />
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-stone-700">
                      {percent}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? "bg-emerald-500" : "bg-[#C2A878]"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-stone-500">
                    <span>Saved: {formatCurrency(g.saved_amount)}</span>
                    <span>Target: {formatCurrency(g.target_amount)}</span>
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

export default GoalsProgress;