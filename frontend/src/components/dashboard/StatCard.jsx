function StatCard({
    title,
    amount,
    change,
    changeType = "positive",
}) {
    return (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">

            <div className="flex items-center justify-between">

                <div>
                    <p className="text-sm text-stone-500">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-stone-900">
                        {amount}
                    </h2>

                    <p
                        className={`mt-3 text-sm font-medium ${changeType === "positive"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                    >
                        {change}
                    </p>
                </div>

            </div>
        </div>
    );
}

export default StatCard;