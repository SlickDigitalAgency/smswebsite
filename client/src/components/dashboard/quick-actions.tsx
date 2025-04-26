import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import {
  UserPlus,
  ClipboardCheck,
  Receipt,
  Download,
} from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Add New Student",
      description: "Register a new student in the system",
      icon: <UserPlus className="h-5 w-5" />,
      color: "bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400",
      href: "/students/new"
    },
    {
      title: "Take Attendance",
      description: "Mark daily attendance for classes",
      icon: <ClipboardCheck className="h-5 w-5" />,
      color: "bg-amber-50 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
      href: "/attendance/new"
    },
    {
      title: "Generate Challans",
      description: "Create fee challans for students",
      icon: <Receipt className="h-5 w-5" />,
      color: "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
      href: "/fees/challans/new"
    },
    {
      title: "Export Reports",
      description: "Download various system reports",
      icon: <Download className="h-5 w-5" />,
      color: "bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400",
      href: "/reports/export"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="block p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                    {action.icon}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">{action.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
