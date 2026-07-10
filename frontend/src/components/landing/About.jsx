import SectionHeading from "../common/SectionHeading";

function About() {
    return (
        <section
            id="about"
            className="bg-white py-28 px-8"
        >
            <div className="max-w-6xl mx-auto">

                <SectionHeading
                    title="Why CoinCraft?"
                    subtitle="Managing money shouldn't be complicated. CoinCraft brings together budgeting, expense tracking, and financial planning into one clean, intuitive platform."
                />

                <div className="grid md:grid-cols-3 gap-8 mt-16">

                    <div className="border border-stone-200 rounded-2xl p-8 hover:shadow-lg transition">

                        <h3 className="text-2xl font-semibold mb-4">
                            Track Every Rupee
                        </h3>

                        <p className="text-stone-600 leading-7">
                            Monitor your daily income and expenses effortlessly so you always know where your money goes.
                        </p>

                    </div>

                    <div className="border border-stone-200 rounded-2xl p-8 hover:shadow-lg transition">

                        <h3 className="text-2xl font-semibold mb-4">
                            Plan With Confidence
                        </h3>

                        <p className="text-stone-600 leading-7">
                            Set monthly budgets and stay in control before overspending becomes a problem.
                        </p>

                    </div>

                    <div className="border border-stone-200 rounded-2xl p-8 hover:shadow-lg transition">

                        <h3 className="text-2xl font-semibold mb-4">
                            Achieve Financial Goals
                        </h3>

                        <p className="text-stone-600 leading-7">
                            Save for the future with clear goals and track your progress every step of the way.
                        </p>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default About;