import Button from "../common/Button";
import Card from "../common/Card";

function Hero() {
    return (
        <section className="min-h-screen bg-[#FAF8F5] flex items-center">
            <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-20 items-center">

                {/* Left Content */}
                <div>

                    <p className="uppercase tracking-[4px] text-sm text-stone-500 mb-6">
                        Personal Finance Platform
                    </p>

                    <h1 className="text-6xl font-bold leading-tight mb-8">
                        Master Your
                        <br />
                        Money.
                        <br />
                        Build Your Future.
                    </h1>

                    <p className="text-stone-600 text-lg leading-8 mb-10">
                        CoinCraft helps you track expenses,
                        manage budgets,
                        and achieve financial goals
                        through one elegant dashboard.
                    </p>

                    <div className="flex gap-5">

                        <Button>
                            Get Started
                        </Button>

                        <Button variant="outline">
                            View Demo
                        </Button>

                    </div>

                </div>

                {/* Right Side */}

                <Card className="max-w-md mx-auto">

                    <p className="text-stone-500 mb-3">
                        Total Balance
                    </p>

                    <h2 className="text-5xl font-bold mb-10">
                        ₹48,650
                    </h2>

                    <div className="space-y-6">

                        <div className="flex justify-between">
                            <span>Income</span>
                            <strong>₹50,000</strong>
                        </div>

                        <div className="flex justify-between">
                            <span>Expense</span>
                            <strong>₹1,350</strong>
                        </div>

                        <div className="flex justify-between">
                            <span>Savings</span>
                            <strong>₹48,650</strong>
                        </div>

                    </div>

                </Card>

            </div>
        </section>
    );
}

export default Hero;