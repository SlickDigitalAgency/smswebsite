import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ClipboardCheck, 
  PlusCircle, 
  Calendar, 
  Download,
  Clock,
  Filter,
  CircleCheck,
  CircleX,
} from "lucide-react";
import { format } from "date-fns";

export default function AttendanceManagement() {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [selectedClass, setSelectedClass] = useState<string>("all_classes");
  const [selectedSection, setSelectedSection] = useState<string>("all_sections");

  // Types for attendance records
  interface Student {
    id: number;
    rollNo: string;
    fullName: string;
    sectionName: string;
    className: string;
  }

  interface AttendanceRecord {
    id: number;
    studentId: number;
    student: Student;
    date: string;
    status: "present" | "absent" | "leave";
    checkInTime?: string;
    checkOutTime?: string;
  }

  // Fetch classes for filter
  const { data: classes } = useQuery<{ id: number, name: string }[]>({
    queryKey: ["/api/classes"],
  });

  // Fetch sections for filter
  const { data: sections } = useQuery<{ id: number, name: string }[]>({
    queryKey: ["/api/sections", { classId: selectedClass !== "all_classes" ? parseInt(selectedClass) : undefined }],
  });

  // Fetch attendance records
  const { data: attendanceRecords, isLoading } = useQuery<AttendanceRecord[]>({
    queryKey: [
      "/api/attendance", 
      { 
        date: selectedDate,
        classId: selectedClass !== "all_classes" ? parseInt(selectedClass) : undefined,
        sectionId: selectedSection !== "all_sections" ? parseInt(selectedSection) : undefined,
      }
    ],
  });

  // Status badge color mapping
  const statusColors: Record<string, string> = {
    present: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    absent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    leave: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  };

  const statusIcons = {
    present: <CircleCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
    absent: <CircleX className="h-4 w-4 text-red-600 dark:text-red-400" />,
    leave: <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
  };

  return (
    <DashboardLayout>
      {/* Page Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Attendance Management</h1>
        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
          <Button className="inline-flex items-center">
            <PlusCircle className="w-4 h-4 mr-2" />
            Take Attendance
          </Button>
          <Button variant="outline" className="inline-flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Attendance Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  className="pl-10"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_classes">All Classes</SelectItem>
                  {classes?.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Section</label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_sections">All Sections</SelectItem>
                  {sections?.map((section) => (
                    <SelectItem key={section.id} value={section.id.toString()}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full" onClick={() => {
                setSelectedDate(format(new Date(), "yyyy-MM-dd"));
                setSelectedClass("all_classes");
                setSelectedSection("all_sections");
              }}>
                <Filter className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Attendance Records</CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedDate !== "" ? format(new Date(selectedDate), "dd MMMM yyyy") : "Today"}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="spinner h-8 w-8 mx-auto mb-4 animate-spin text-primary"></div>
              <p className="text-muted-foreground">Loading attendance records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox id="select-all" />
                    </TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords && attendanceRecords.length > 0 ? (
                    attendanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <Checkbox id={`select-${record.id}`} />
                        </TableCell>
                        <TableCell>{record.student.fullName}</TableCell>
                        <TableCell>{record.student.rollNo}</TableCell>
                        <TableCell>{record.student.className}</TableCell>
                        <TableCell>{record.student.sectionName}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {statusIcons[record.status]}
                            <Badge className={statusColors[record.status]}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{record.checkInTime || "-"}</TableCell>
                        <TableCell>{record.checkOutTime || "-"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <ClipboardCheck className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground mb-2">No attendance records found for this date</p>
                          <Button className="mt-2">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Take Attendance Now
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}