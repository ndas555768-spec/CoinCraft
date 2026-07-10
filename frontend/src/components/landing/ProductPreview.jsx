import SectionHeading from "../common/SectionHeading";
import Card from "../common/Card";

function ProductPreview() {
    return (
        <section className="bg-white py-28 px-8">
            <div className="max-w-7xl mx-auto">

                <SectionHeading
                    title="A Dashboard Built for Clarity"
                    subtitle="Everything important is available in one place, helping you make better financial decisions."
                />

                <Card className="max-w-5xl mx-auto p-10">

                    <div className="grid md:grid-cols-2 gap-10">

                        {/* Left */}

                        <div>

                            <h3 className="text-lg text-stone-500">
                                Total Balance
                            </h3>

                            <h1 className="text-5xl font-bold mt-2 mb-10">
                                ₹48,650
                            </h1>

                            <div className="space-y-6">

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

                        {/* Right */}

                        <div>

                            <h3 className="font-semibold mb-6">
                                Monthly Budget
                            </h3>

                            <div className="w-full h-4 rounded-full bg-stone-200 mb-8">

                                <div className="w-4/5 h-4 rounded-full bg-black"></div>

                            </div>

                            <div className="space-y-5">

                                <div className="flex justify-between">
                                    <span>Food</span>
                                    <span>80%</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Shopping</span>
                                    <span>55%</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Travel</span>
                                    <span>30%</span>
                                </div>

                            </div>

                        </div>

                    </div>

                </Card>

            </div>
        </section>
    );
}

export default ProductPreview;