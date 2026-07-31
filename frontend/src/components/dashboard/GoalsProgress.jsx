function GoalsProgress() {
    const saved = 45000;
    const goal = 100000;
    const progress = (saved / goal) * 100;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
            <h2 className="text-xl font-semibold mb-6">
                Savings Goal
            </h2>

            <h3 className="text-3xl font-bold">
                ₹{saved.toLocaleString()}
            </h3>

            <p className="text-stone-500 mb-5">
                Goal: ₹{goal.toLocaleString()}
            </p>

            <div className="w-full h-4 bg-stone-200 rounded-full">
                <div
                    className="h-4 rounded-full bg-green-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <p className="text-sm text-stone-500 mt-4">
                {progress.toFixed(0)}% completed
            </p>
        </div>
    );
}

export default GoalsProgress;