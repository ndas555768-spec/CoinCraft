import DashboardLayout from "../components/layout/DashboardLayout";
import SummaryCards from "../components/dashboard/SummaryCards";
import IncomeExpenseChart from "../components/dashboard/IncomeExpenseChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import BudgetProgress from "../components/dashboard/BudgetProgress";
import GoalsProgress from "../components/dashboard/GoalsProgress";

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

            <div className="mt-8">
                <RecentTransactions />
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
                <BudgetProgress />
                <GoalsProgress />
            </div>

        </DashboardLayout>
    );
}

export default Dashboard;