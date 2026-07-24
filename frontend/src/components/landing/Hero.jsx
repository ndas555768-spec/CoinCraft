function Hero() {
    return (
        <section className="min-h-screen bg-[#FAF8F5] flex items-center">
            <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">

                {/* Left Side */}
                <div>
                    <p className="uppercase tracking-[4px] text-sm text-stone-500 mb-4">
                        Personal Finance Platform
                    </p>

                    <h1 className="text-6xl font-bold leading-tight mb-6">
                        Master Your <br />
                        Money. <br />
                        Build Your Future.
                    </h1>

                    <p className="text-lg text-stone-600 mb-8">
                        CoinCraft helps you track expenses, manage budgets,
                        and achieve your financial goals from one elegant dashboard.
                    </p>

                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800">
                            Get Started
                        </button>

                        <button className="px-6 py-3 border border-black rounded-lg hover:bg-gray-100">
                            View Demo
                        </button>
                    </div>
                </div>

                {/* Right Side */}
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                    <p className="text-gray-500 mb-3">
                        Total Balance
                    </p>

                    <h2 className="text-5xl font-bold mb-8">
                        ₹48,650
                    </h2>

                    <div className="space-y-5">
                        <div className="flex justify-between">
                            <span>Income</span>
                            <strong>₹50,000</strong>
                        </div>

                        <div className="flex justify-between">
                            <span>Expenses</span>
                            <strong>₹1,350</strong>
                        </div>

                        <div className="flex justify-between">
                            <span>Savings</span>
                            <strong>₹48,650</strong>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default Hero;