import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

const data = [
    { month: "Jan", income: 42000, expense: 18000 },
    { month: "Feb", income: 45000, expense: 22000 },
    { month: "Mar", income: 50000, expense: 25000 },
    { month: "Apr", income: 47000, expense: 20000 },
    { month: "May", income: 52000, expense: 26000 },
    { month: "Jun", income: 50000, expense: 24000 },
];

function IncomeExpenseChart() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
            <h2 className="text-xl font-semibold mb-6">
                Income vs Expenses
            </h2>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#16a34a"
                            strokeWidth={3}
                        />

                        <Line
                            type="monotone"
                            dataKey="expense"
                            stroke="#dc2626"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default IncomeExpenseChart;