import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// This would come from the API in a real scenario
type FeeStats = {
  collected: number;
  outstanding: number;
  latePayment: number;
};

export default function FeeCollection() {
  const { data: feeStats, isLoading } = useQuery<FeeStats>({
    queryKey: ["/api/fees/stats"],
  });

  // Sample data for rendering
  const sampleData = {
    collected: 2800000, // 2.8M (87%)
    outstanding: 420000, // 420K (13%)
    latePayment: 150000, // 150K (5% of total)
  };

  // Use actual data or fall back to sample data
  const stats = feeStats || sampleData;

  // Prepare data for the chart
  const totalAmount = stats.collected + stats.outstanding;
  const chartData = [
    { name: "Collected", value: stats.collected, color: "#4f46e5" }, // primary
    { name: "Outstanding", value: stats.outstanding, color: "#ef4444" }, // red
    { name: "Late Payment", value: stats.latePayment, color: "#f59e0b" }, // amber
  ];

  // Format numbers
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `₨${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `₨${(value / 1000).toFixed(0)}K`;
    }
    return `₨${value}`;
  };

  // Calculate percentages
  const calculatePercentage = (value: number) => {
    return `${Math.round((value / totalAmount) * 100)}%`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Fee Collection</CardTitle>
          <Button variant="link" size="sm">
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <div className="spinner h-8 w-8 animate-spin text-primary"></div>
          </div>
        ) : (
          <>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), "Amount"]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderColor: '#e5e7eb',
                      borderRadius: '0.375rem',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                  <p className="ml-2 text-sm text-slate-700 dark:text-slate-300">Collected</p>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {formatCurrency(stats.collected)} ({calculatePercentage(stats.collected)})
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <p className="ml-2 text-sm text-slate-700 dark:text-slate-300">Outstanding</p>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {formatCurrency(stats.outstanding)} ({calculatePercentage(stats.outstanding)})
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <p className="ml-2 text-sm text-slate-700 dark:text-slate-300">Late Payment</p>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {formatCurrency(stats.latePayment)} ({Math.round((stats.latePayment / totalAmount) * 100)}%)
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
