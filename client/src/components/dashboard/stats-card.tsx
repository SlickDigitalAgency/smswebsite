import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: "primary" | "amber" | "emerald" | "red";
  percentageChange?: number;
  periodLabel?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  iconColor,
  percentageChange,
  periodLabel = "Since last month"
}: StatsCardProps) {
  const colorClasses = {
    primary: {
      bg: "bg-primary-50 dark:bg-primary-900/50",
      text: "text-primary-600 dark:text-primary-400"
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-900/30",
      text: "text-amber-600 dark:text-amber-400"
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-900/30",
      text: "text-emerald-600 dark:text-emerald-400"
    },
    red: {
      bg: "bg-red-50 dark:bg-red-900/30",
      text: "text-red-600 dark:text-red-400"
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", colorClasses[iconColor].bg, colorClasses[iconColor].text)}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
      </div>
      {percentageChange !== undefined && (
        <div className="mt-4 flex items-center text-sm">
          <span className={cn(
            "flex items-center",
            percentageChange >= 0 ? "text-emerald-500" : "text-red-500"
          )}>
            {percentageChange >= 0 ? (
              <ArrowUp className="mr-1 h-3 w-3" />
            ) : (
              <ArrowDown className="mr-1 h-3 w-3" />
            )}
            {Math.abs(percentageChange)}%
          </span>
          <span className="ml-2 text-slate-500 dark:text-slate-400">{periodLabel}</span>
        </div>
      )}
    </div>
  );
}
