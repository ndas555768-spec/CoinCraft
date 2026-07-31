function BudgetProgress() {
    const used = 6800;
    const total = 10000;
    const percent = (used / total) * 100;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
            <h2 className="text-xl font-semibold mb-6">
                Monthly Budget
            </h2>

            <div className="flex justify-between mb-3">
                <span>₹{used.toLocaleString()}</span>
                <span>₹{total.toLocaleString()}</span>
            </div>

            <div className="w-full h-4 bg-stone-200 rounded-full">
                <div
                    className="h-4 rounded-full bg-[#C2A878]"
                    style={{ width: `${percent}%` }}
                />
            </div>

            <p className="text-sm text-stone-500 mt-4">
                {percent.toFixed(0)}% of your monthly budget has been used.
            </p>
        </div>
    );
}

export default BudgetProgress;