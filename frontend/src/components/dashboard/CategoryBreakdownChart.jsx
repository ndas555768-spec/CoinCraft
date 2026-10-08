import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { useAuth } from "../../context/AuthContext";

const COLORS = [
  "#C2A878",
  "#3b82f6",
  "#10b981",
  "#f43f5e",
  "#8b5cf6",
  "#f59e0b",
  "#06b6d4",
  "#ec4899",
];

const renderTooltip = (props, currencySymbol) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-stone-200 text-xs">
        <p className="font-bold text-stone-900">{data.category}</p>
        <p className="text-stone-600 mt-1">
          {currencySymbol}{data.amount?.toLocaleString()} ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

function CategoryBreakdownChart({ categories = [] }) {
  const { getCurrencySymbol } = useAuth();
  const currencySymbol = getCurrencySymbol();

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-bold text-stone-900">
          Spending by Category
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Distribution of your expenditure
        </p>

        <div className="h-64 w-full mt-4">
          {categories.length === 0 ? (
            <div className="h-full flex items-center justify-center text-stone-400 text-sm">
              No expenses recorded yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {categories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={(props) => renderTooltip(props, currencySymbol)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {categories.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-stone-100">
          {categories.slice(0, 4).map((cat, i) => (
            <div key={cat.category} className="flex items-center gap-2 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-stone-600 truncate">{cat.category}</span>
              <span className="font-semibold text-stone-900 ml-auto">
                {cat.percentage}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryBreakdownChart;
