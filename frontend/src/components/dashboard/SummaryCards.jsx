import {
  FaWallet,
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaPiggyBank,
} from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";

function SummaryCards({ summary }) {
  const { formatCurrency } = useAuth();

  const cards = [
    {
      title: "Total Balance",
      amount: formatCurrency(summary?.balance || 0),
      subtitle: "Current Net Balance",
      icon: <FaWallet className="text-xl text-blue-600" />,
      bg: "bg-blue-50/50",
    },
    {
      title: "Total Income",
      amount: formatCurrency(summary?.total_income || 0),
      subtitle: "Cumulative Inflow",
      icon: <FaArrowTrendUp className="text-xl text-emerald-600" />,
      bg: "bg-emerald-50/50",
    },
    {
      title: "Total Expenses",
      amount: formatCurrency(summary?.total_expense || 0),
      subtitle: "Cumulative Spending",
      icon: <FaArrowTrendDown className="text-xl text-rose-600" />,
      bg: "bg-rose-50/50",
    },
    {
      title: "Total Savings",
      amount: formatCurrency(summary?.total_savings || 0),
      subtitle: "Stored in Active Goals",
      icon: <FaPiggyBank className="text-xl text-amber-600" />,
      bg: "bg-amber-50/50",
    },
  ];

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-2xl shadow-xs border border-stone-200/80 p-6 hover:shadow-md hover:border-stone-300 transition-all duration-200 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                {card.title}
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 tracking-tight">
                {card.amount}
              </h2>
            </div>
            <div className={`p-3.5 rounded-2xl ${card.bg} border border-stone-100 flex-shrink-0`}>
              {card.icon}
            </div>
          </div>
          <p className="text-xs text-stone-400 font-medium">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;