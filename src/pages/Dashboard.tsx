import { Users, Building2, Target, DollarSign } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PipelineOverview } from "@/components/dashboard/PipelineOverview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TopDeals } from "@/components/dashboard/TopDeals";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, John. Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Contacts"
            value="2,847"
            change={{ value: "12.5%", trend: "up" }}
            icon={<Users className="w-5 h-5" />}
            delay={0}
          />
          <StatsCard
            title="Companies"
            value="482"
            change={{ value: "8.2%", trend: "up" }}
            icon={<Building2 className="w-5 h-5" />}
            delay={0.05}
          />
          <StatsCard
            title="Active Deals"
            value="127"
            change={{ value: "3.1%", trend: "down" }}
            icon={<Target className="w-5 h-5" />}
            delay={0.1}
          />
          <StatsCard
            title="Revenue (MTD)"
            value="$892K"
            change={{ value: "18.7%", trend: "up" }}
            icon={<DollarSign className="w-5 h-5" />}
            delay={0.15}
          />
        </div>

        {/* Pipeline Overview */}
        <PipelineOverview />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          <TopDeals />
        </div>

        {/* Tasks */}
        <UpcomingTasks />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
