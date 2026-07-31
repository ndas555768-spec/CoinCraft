const transactions = [
    {
        id: 1,
        title: "Salary",
        amount: "+₹50,000",
        date: "24 Jul 2026",
        color: "text-green-600",
    },
    {
        id: 2,
        title: "Netflix",
        amount: "-₹649",
        date: "23 Jul 2026",
        color: "text-red-500",
    },
    {
        id: 3,
        title: "Groceries",
        amount: "-₹2,300",
        date: "22 Jul 2026",
        color: "text-red-500",
    },
    {
        id: 4,
        title: "Freelance",
        amount: "+₹8,000",
        date: "20 Jul 2026",
        color: "text-green-600",
    },
];

function RecentTransactions() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
            <h2 className="text-2xl font-semibold mb-6">
                Recent Transactions
            </h2>

            <div className="space-y-4">
                {transactions.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center border-b border-stone-100 pb-4"
                    >
                        <div>
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-stone-500">{item.date}</p>
                        </div>

                        <p className={`font-bold ${item.color}`}>
                            {item.amount}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentTransactions;