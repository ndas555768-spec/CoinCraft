import StatCard from "./StatCard";

function SummaryCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            <StatCard
                title="Total Balance"
                amount="₹1,25,000"
                change="+12.4% this month"
                changeType="positive"
            />

            <StatCard
                title="Income"
                amount="₹75,000"
                change="+8.2%"
                changeType="positive"
            />

            <StatCard
                title="Expenses"
                amount="₹28,400"
                change="-5.4%"
                changeType="negative"
            />

            <StatCard
                title="Savings"
                amount="₹46,600"
                change="+15.8%"
                changeType="positive"
            />

        </div>
    );
}

export default SummaryCards;