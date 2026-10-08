import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useAuth } from "../../context/AuthContext";

const renderTooltip = (props, currencySymbol) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3.5 rounded-xl shadow-lg border border-stone-200 text-xs">
        <p className="font-bold text-stone-900 mb-2">{label}</p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-stone-500 capitalize">{entry.name}:</span>
            <span className="font-semibold text-stone-900">
              {currencySymbol}{entry.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function IncomeExpenseChart({ trend = [] }) {
  const { getCurrencySymbol } = useAuth();
  const currencySymbol = getCurrencySymbol();

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-lg font-bold text-stone-900">
            Cash Flow Trend (6 Months)
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Compare monthly income inflows vs expenditure outflows
          </p>
        </div>
      </div>

      <div className="h-80 w-full">
        {trend.length === 0 ? (
          <div className="h-full flex items-center justify-center text-stone-400 text-sm">
            No transaction trend data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ede6" />
              <XAxis dataKey="month" tick={{ fill: "#78716c", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#78716c", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${currencySymbol}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip content={(props) => renderTooltip(props, currencySymbol)} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: "15px", fontSize: "12px" }}
              />
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#incomeGrad)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="Expenses"
                stroke="#f43f5e"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#expenseGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default IncomeExpenseChart;