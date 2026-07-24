import DashboardLayout from "../components/layout/DashboardLayout";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import SummaryCards from "../components/dashboard/SummaryCards";

function Dashboard() {
    return (
        <DashboardLayout>
            <WelcomeBanner />

            <SummaryCards />
        </DashboardLayout>
    );
}

export default Dashboard;