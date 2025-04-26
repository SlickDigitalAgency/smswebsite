import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import StatsCard from "@/components/dashboard/stats-card";
import AttendanceChart from "@/components/dashboard/attendance-chart";
import Announcements from "@/components/dashboard/announcements";
import RecentStudents from "@/components/dashboard/recent-students";
import FeeCollection from "@/components/dashboard/fee-collection";
import UpcomingEvents from "@/components/dashboard/upcoming-events";
import QuickActions from "@/components/dashboard/quick-actions";
import { UserRound, Presentation, Receipt, AlertTriangle, ChevronDown } from "lucide-react";

export default function Dashboard() {
  // Define the expected type for dashboard stats
  interface DashboardStats {
    totalStudents: number;
    totalFaculty: number;
    feeCollection: string;
    feeDefaulters: number;
  }
  
  const { 
    data: dashboardStats, 
    isLoading 
  } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  // Default values if data is loading or not available
  const stats = {
    totalStudents: dashboardStats?.totalStudents || 0,
    totalFaculty: dashboardStats?.totalFaculty || 0,
    feeCollection: dashboardStats?.feeCollection || "0",
    feeDefaulters: dashboardStats?.feeDefaulters || 0
  };

  return (
    <DashboardLayout>
      {/* Page Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
            <UserRound className="w-4 h-4 mr-2" />
            New Student
          </button>
          <div className="relative">
            <select className="appearance-none bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 pr-8 text-sm outline-none text-slate-700 dark:text-slate-200">
              <option>Current Term</option>
              <option>Previous Term</option>
              <option>All Time</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Students"
          value={isLoading ? "Loading..." : stats.totalStudents}
          icon={<UserRound className="h-5 w-5" />}
          iconColor="primary"
          percentageChange={8.2}
        />
        
        <StatsCard
          title="Total Faculty"
          value={isLoading ? "Loading..." : stats.totalFaculty}
          icon={<Presentation className="h-5 w-5" />}
          iconColor="amber"
          percentageChange={2.3}
        />
        
        <StatsCard
          title="Fee Collection"
          value={isLoading ? "Loading..." : `₨${stats.feeCollection}`}
          icon={<Receipt className="h-5 w-5" />}
          iconColor="emerald"
          percentageChange={-3.1}
        />
        
        <StatsCard
          title="Fee Defaulters"
          value={isLoading ? "Loading..." : stats.feeDefaulters}
          icon={<AlertTriangle className="h-5 w-5" />}
          iconColor="red"
          percentageChange={12.5}
        />
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>
        <div>
          <Announcements />
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <RecentStudents />
        </div>
        <div className="lg:col-span-2">
          <FeeCollection />
        </div>
      </div>

      {/* Quick Actions & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingEvents />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  );
}
