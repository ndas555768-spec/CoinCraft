import { FaWallet, FaChartLine, FaBullseye } from "react-icons/fa";

function Features() {
    const features = [
        {
            icon: <FaWallet className="text-3xl text-[#C2A878]" />,
            title: "Expense Tracking",
            description:
                "Monitor every transaction and understand where your money goes.",
        },
        {
            icon: <FaChartLine className="text-3xl text-[#C2A878]" />,
            title: "Smart Analytics",
            description:
                "Interactive charts and reports help you make better financial decisions.",
        },
        {
            icon: <FaBullseye className="text-3xl text-[#C2A878]" />,
            title: "Goal Planning",
            description:
                "Set savings goals and track your progress with ease.",
        },
    ];

    return (
        <section id="features" className="py-24 bg-[#FAF8F5]">
            <div className="max-w-7xl mx-auto px-8">

                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-4">
                        Everything You Need
                    </h2>

                    <p className="text-stone-600 text-lg">
                        Powerful tools to simplify your financial journey.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition"
                        >
                            {feature.icon}

                            <h3 className="text-2xl font-semibold mt-6 mb-4">
                                {feature.title}
                            </h3>

                            <p className="text-stone-600 leading-7">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default Features;