function FAQ() {
    const faqs = [
        {
            question: "Is CoinCraft free to use?",
            answer:
                "Yes. You can start managing your finances for free and upgrade later for premium features.",
        },
        {
            question: "Can I track multiple bank accounts?",
            answer:
                "Yes. CoinCraft allows you to manage multiple accounts in one dashboard.",
        },
        {
            question: "Is my financial data secure?",
            answer:
                "Absolutely. Your data is encrypted and securely stored using modern security practices.",
        },
    ];

    return (
        <section id="faq" className="py-24 bg-[#FAF8F5]">
            <div className="max-w-5xl mx-auto px-8">

                <div className="text-center mb-14">
                    <h2 className="text-5xl font-bold mb-4">
                        Frequently Asked Questions
                    </h2>

                    <p className="text-stone-600 text-lg">
                        Everything you need to know before getting started.
                    </p>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq) => (
                        <div
                            key={faq.question}
                            className="bg-white rounded-2xl shadow-md p-6"
                        >
                            <h3 className="text-xl font-semibold mb-3">
                                {faq.question}
                            </h3>

                            <p className="text-stone-600 leading-7">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default FAQ;