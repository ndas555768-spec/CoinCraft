import {
    FaWallet,
    FaArrowTrendUp,
    FaArrowTrendDown,
    FaPiggyBank,
} from "react-icons/fa6";

const cards = [
    {
        title: "Total Balance",
        amount: "₹48,650",
        icon: <FaWallet className="text-2xl text-blue-600" />,
    },
    {
        title: "Income",
        amount: "₹50,000",
        icon: <FaArrowTrendUp className="text-2xl text-green-600" />,
    },
    {
        title: "Expenses",
        amount: "₹1,350",
        icon: <FaArrowTrendDown className="text-2xl text-red-600" />,
    },
    {
        title: "Savings",
        amount: "₹48,650",
        icon: <FaPiggyBank className="text-2xl text-yellow-500" />,
    },
];

function SummaryCards() {
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-stone-500">{card.title}</p>

                            <h2 className="text-3xl font-bold mt-2">
                                {card.amount}
                            </h2>
                        </div>

                        <div className="bg-stone-100 p-4 rounded-xl">
                            {card.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SummaryCards;