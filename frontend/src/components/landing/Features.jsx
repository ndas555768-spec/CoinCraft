import SectionHeading from "../common/SectionHeading";
import Card from "../common/Card";

const features = [
    {
        title: "Expense Tracking",
        description:
            "Record every expense in seconds and understand where your money goes.",
    },
    {
        title: "Smart Budgeting",
        description:
            "Create monthly budgets and receive alerts before you overspend.",
    },
    {
        title: "Savings Goals",
        description:
            "Set personal financial goals and monitor your progress over time.",
    },
    {
        title: "Financial Dashboard",
        description:
            "View your income, expenses, balance, and insights from one place.",
    },
];

function Features() {
    return (
        <section
            id="features"
            className="py-28 px-8 bg-[#FAF8F5]"
        >
            <div className="max-w-7xl mx-auto">

                <SectionHeading
                    title="Everything You Need"
                    subtitle="Simple tools that help you manage your finances with confidence."
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {features.map((feature) => (
                        <Card
                            key={feature.title}
                            className="hover:-translate-y-2 transition duration-300"
                        >
                            <h3 className="text-xl font-semibold mb-4">
                                {feature.title}
                            </h3>

                            <p className="text-stone-600 leading-7">
                                {feature.description}
                            </p>
                        </Card>
                    ))}

                </div>
            </div>
        </section>
    );
}

export default Features;