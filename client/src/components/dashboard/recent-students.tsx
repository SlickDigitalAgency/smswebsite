import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Student } from "@shared/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserRound } from "lucide-react";

export default function RecentStudents() {
  const { data: students, isLoading } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  // Get only the 5 most recent students
  const recentStudents = students ? students.slice(0, 5) : [];

  // Status badge mapping
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            Pending
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            {status}
          </Badge>
        );
    }
  };

  // Sample data for demonstration until API is connected
  const sampleStudents = [
    {
      id: 1,
      fullName: "Muhammad Ali",
      registrationNo: "2023-DAE-C-001",
      programName: "DAE Civil",
      sectionName: "1st Year (A)",
      status: "Active"
    },
    {
      id: 2,
      fullName: "Aisha Khan",
      registrationNo: "2023-DAE-E-045",
      programName: "DAE Electrical",
      sectionName: "1st Year (B)",
      status: "Active"
    },
    {
      id: 3,
      fullName: "Usman Ahmed",
      registrationNo: "2023-DAE-CT-078",
      programName: "DAE Computer",
      sectionName: "1st Year (C)",
      status: "Pending"
    },
    {
      id: 4,
      fullName: "Fatima Zahra",
      registrationNo: "2023-DAE-EL-112",
      programName: "DAE Electronics",
      sectionName: "1st Year (A)",
      status: "Active"
    },
    {
      id: 5,
      fullName: "Hamza Malik",
      registrationNo: "2023-DAE-C-143",
      programName: "DAE Civil",
      sectionName: "1st Year (D)",
      status: "Inactive"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Recently Added Students</CardTitle>
          <Button variant="link" size="sm" asChild>
            <Link href="/students">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="py-2 px-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Program</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Section</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    <div className="spinner h-5 w-5 mx-auto animate-spin text-primary"></div>
                  </td>
                </tr>
              ) : recentStudents.length > 0 ? (
                recentStudents.map((student, index) => (
                  <tr key={student.id} className={index % 2 === 0 ? "bg-gray-50 dark:bg-slate-800/50" : ""}>
                    <td className="py-3 px-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-200">
                          <UserRound className="h-4 w-4" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{student.fullName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Reg# {student.registrationNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm text-slate-500 dark:text-slate-400">
                      {/* Would need to join with program data */}
                      Program {student.programId}
                    </td>
                    <td className="py-3 px-3 text-sm text-slate-500 dark:text-slate-400">
                      {/* Would need to join with section data */}
                      Section {student.sectionId}
                    </td>
                    <td className="py-3 px-3">
                      {getStatusBadge(student.status)}
                    </td>
                  </tr>
                ))
              ) : (
                // Fallback to sample data if API doesn't return anything yet
                sampleStudents.map((student, index) => (
                  <tr key={student.id} className={index % 2 === 0 ? "bg-gray-50 dark:bg-slate-800/50" : ""}>
                    <td className="py-3 px-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-200">
                          <UserRound className="h-4 w-4" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{student.fullName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Reg# {student.registrationNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm text-slate-500 dark:text-slate-400">{student.programName}</td>
                    <td className="py-3 px-3 text-sm text-slate-500 dark:text-slate-400">{student.sectionName}</td>
                    <td className="py-3 px-3">
                      {getStatusBadge(student.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
