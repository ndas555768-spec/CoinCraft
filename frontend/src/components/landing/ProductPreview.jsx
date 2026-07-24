function ProductPreview() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-8">

                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-4">
                        A Dashboard You'll Love
                    </h2>

                    <p className="text-lg text-stone-600">
                        Clean, fast and designed to help you stay in control of your finances.
                    </p>
                </div>

                <div className="bg-[#F8F6F2] rounded-3xl shadow-xl p-10">

                    <div className="grid md:grid-cols-3 gap-8">

                        <div className="bg-white rounded-2xl p-6 shadow">
                            <p className="text-stone-500">Balance</p>
                            <h3 className="text-4xl font-bold mt-2">
                                ₹48,650
                            </h3>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow">
                            <p className="text-stone-500">Monthly Income</p>
                            <h3 className="text-4xl font-bold mt-2 text-green-600">
                                ₹50,000
                            </h3>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow">
                            <p className="text-stone-500">Monthly Expense</p>
                            <h3 className="text-4xl font-bold mt-2 text-red-500">
                                ₹1,350
                            </h3>
                        </div>

                    </div>

                    <div className="mt-10 bg-white rounded-2xl p-8 shadow">
                        <h3 className="text-2xl font-semibold mb-4">
                            Spending Overview
                        </h3>

                        <div className="w-full h-56 rounded-xl bg-gradient-to-r from-[#C2A878] to-[#E9DDC7] flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">
                                📊 Charts Coming Soon
                            </span>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}

export default ProductPreview;