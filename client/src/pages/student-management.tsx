import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Student } from "@shared/schema";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  UserRound, 
  PlusCircle, 
  Search, 
  Download, 
  Upload, 
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Receipt,
} from "lucide-react";

export default function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [, navigate] = useLocation();

  // Fetch students with filters
  const { data: students, isLoading } = useQuery<Student[]>({
    queryKey: [
      "/api/students", 
      { 
        search: searchTerm, 
        programId: programFilter ? parseInt(programFilter) : undefined,
        sectionId: sectionFilter ? parseInt(sectionFilter) : undefined
      }
    ],
  });

  // Define types for Program and Section
  interface Program {
    id: number;
    name: string;
  }

  interface Section {
    id: number;
    name: string;
  }

  // Fetch programs for filter
  const { data: programs } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  // Fetch sections for filter
  const { data: sections } = useQuery<Section[]>({
    queryKey: ["/api/sections"],
  });

  // Status badge color mapping
  const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    inactive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    graduated: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <DashboardLayout>
      {/* Page Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Student Management</h1>
        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
          <Button className="inline-flex items-center" onClick={() => navigate("/students/new")}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New Student
          </Button>
          <Button variant="outline" className="inline-flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" className="inline-flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_programs">All Programs</SelectItem>
                  {programs?.map((program) => (
                    <SelectItem key={program.id} value={program.id.toString()}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={sectionFilter} onValueChange={setSectionFilter}>
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
            <div>
              <Button variant="outline" className="w-full" onClick={() => {
                setSearchTerm("");
                setProgramFilter("");
                setSectionFilter("");
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Students List</CardTitle>
            <p className="text-sm text-muted-foreground">
              Total: {students?.length || 0} students
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="spinner h-8 w-8 mx-auto mb-4 animate-spin text-primary"></div>
              <p className="text-muted-foreground">Loading students...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Registration No</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students && students.length > 0 ? (
                    students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-200 mr-3">
                              <UserRound className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{student.fullName}</p>
                              <p className="text-xs text-muted-foreground">
                                {student.fatherName}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{student.registrationNo}</TableCell>
                        <TableCell>{student.programId}</TableCell>
                        <TableCell>{student.sectionId}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[student.status]}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/students/${student.id}/edit`)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Student
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Receipt className="h-4 w-4 mr-2" />
                                Fee History
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Student
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p className="text-muted-foreground">No students found</p>
                        <Button variant="outline" className="mt-4" onClick={() => navigate("/students/new")}>
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Add New Student
                        </Button>
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
