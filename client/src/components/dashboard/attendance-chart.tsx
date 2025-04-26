import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AttendanceData = {
  program: string;
  percentage: number;
  color: string;
};

// Placeholder data - in a real app, this would come from the API
const weeklyAttendanceData: AttendanceData[] = [
  { program: "DAE Civil", percentage: 89, color: "#818cf8" },
  { program: "DAE Electrical", percentage: 92, color: "#6366f1" },
  { program: "DAE Electronics", percentage: 85, color: "#4f46e5" },
  { program: "DAE Computer", percentage: 91, color: "#4338ca" },
];

const monthlyAttendanceData: AttendanceData[] = [
  { program: "DAE Civil", percentage: 84, color: "#818cf8" },
  { program: "DAE Electrical", percentage: 88, color: "#6366f1" },
  { program: "DAE Electronics", percentage: 82, color: "#4f46e5" },
  { program: "DAE Computer", percentage: 87, color: "#4338ca" },
];

type TimeRange = "weekly" | "monthly";

export default function AttendanceChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  const data = timeRange === "weekly" ? weeklyAttendanceData : monthlyAttendanceData;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Attendance Overview</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant={timeRange === "weekly" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setTimeRange("weekly")}
              className="px-3 py-1 text-xs font-medium rounded-md"
            >
              Weekly
            </Button>
            <Button 
              variant={timeRange === "monthly" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setTimeRange("monthly")}
              className="px-3 py-1 text-xs font-medium rounded-md"
            >
              Monthly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="program" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                className="text-xs text-gray-500 dark:text-gray-400" 
              />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                domain={[0, 100]}
                className="text-xs text-gray-500 dark:text-gray-400" 
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, "Attendance"]}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderColor: '#e5e7eb',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
              />
              <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {data.map((program, index) => (
            <div key={index} className="text-center">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{program.program}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{program.percentage}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
