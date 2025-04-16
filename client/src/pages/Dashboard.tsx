import DashboardCards from "@/components/dashboard/DashboardCards";
import MonthlyPaymentsTable from "@/components/dashboard/MonthlyPaymentsTable";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function Dashboard() {
  return (
    <>
      <DashboardCards />
      <MonthlyPaymentsTable />
      <RecentActivity />
    </>
  );
}
