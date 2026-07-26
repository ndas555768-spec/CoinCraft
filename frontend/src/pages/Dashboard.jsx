import DashboardLayout from "../components/layout/DashboardLayout";
import SummaryCards from "../components/dashboard/SummaryCards";
import IncomeExpenseChart from "../components/dashboard/IncomeExpenseChart";

function Dashboard() {
    return (
        <DashboardLayout>

            <h1 className="text-4xl font-bold mb-8">
                Welcome back, Nandita 👋
            </h1>

            <SummaryCards />

            <div className="mt-8">
                <IncomeExpenseChart />
            </div>

        </DashboardLayout>
    );
}

export default Dashboard;