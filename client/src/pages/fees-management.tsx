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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Receipt, 
  PlusCircle, 
  Search, 
  Download, 
  MoreVertical,
  Pencil,
  Eye,
  FileText,
  UserRound,
  CreditCard,
  Banknote,
  CheckSquare,
  AlertCircle,
  ClockIcon,
} from "lucide-react";
import { format } from "date-fns";

export default function FeesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<string>("fees");

  // Types for fees and fee structures
  interface Fee {
    id: number;
    studentId: number;
    studentName: string;
    studentRollNo: string;
    amount: number;
    dueDate: string;
    paidAmount: number;
    paidDate?: string;
    remainingAmount: number;
    status: "paid" | "unpaid" | "partial" | "overdue";
    paymentMethod?: string;
    challanNo: string;
  }

  interface FeeStructure {
    id: number;
    programId: number;
    programName: string;
    classId?: number;
    className?: string;
    feeType: string;
    amount: number;
    frequency: "monthly" | "quarterly" | "annually" | "one-time";
    academicYear: string;
    status: "active" | "inactive";
  }

  // Fetch fees data
  const { data: fees, isLoading: feesLoading } = useQuery<Fee[]>({
    queryKey: [
      "/api/fees", 
      { 
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : undefined,
      }
    ],
    enabled: activeTab === "fees",
  });

  // Fetch fee structures
  const { data: feeStructures, isLoading: feeStructuresLoading } = useQuery<FeeStructure[]>({
    queryKey: [
      "/api/fees/structures", 
      { 
        search: searchTerm,
      }
    ],
    enabled: activeTab === "structures",
  });

  // Status badge color mapping
  const statusColors: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    unpaid: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    partial: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    inactive: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
  };

  const statusIcons = {
    paid: <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
    unpaid: <ClockIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
    partial: <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
    overdue: <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />,
  };

  return (
    <DashboardLayout>
      {/* Page Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fee Management</h1>
        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
          <Button className="inline-flex items-center">
            <PlusCircle className="w-4 h-4 mr-2" />
            {activeTab === "fees" ? "Generate Fee Challan" : "Add Fee Structure"}
          </Button>
          <Button variant="outline" className="inline-flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="fees" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="fees">Fee Records</TabsTrigger>
          <TabsTrigger value="structures">Fee Structures</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {activeTab === "fees" && (
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="partial">Partially Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Button variant="outline" className="w-full" onClick={() => {
                  setSearchTerm("");
                  if (activeTab === "fees") {
                    setStatusFilter("all");
                  }
                }}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fee Records Tab */}
        <TabsContent value="fees">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Fee Records</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Total: {fees?.length || 0} records
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {feesLoading ? (
                <div className="py-8 text-center">
                  <div className="spinner h-8 w-8 mx-auto mb-4 animate-spin text-primary"></div>
                  <p className="text-muted-foreground">Loading fee records...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Challan No</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Remaining</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fees && fees.length > 0 ? (
                        fees.map((fee) => (
                          <TableRow key={fee.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-200 mr-3">
                                  <Receipt className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium">{fee.challanNo}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <div>
                                  <p className="font-medium">{fee.studentName}</p>
                                  <p className="text-xs text-muted-foreground">{fee.studentRollNo}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">₨{fee.amount.toLocaleString()}</p>
                            </TableCell>
                            <TableCell>{format(new Date(fee.dueDate), "MMM dd, yyyy")}</TableCell>
                            <TableCell>
                              {fee.paidAmount > 0 ? (
                                <div>
                                  <p className="font-medium">₨{fee.paidAmount.toLocaleString()}</p>
                                  {fee.paidDate && (
                                    <p className="text-xs text-muted-foreground">
                                      {format(new Date(fee.paidDate), "MMM dd, yyyy")}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              {fee.remainingAmount > 0 ? (
                                <p className="font-medium">₨{fee.remainingAmount.toLocaleString()}</p>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {statusIcons[fee.status]}
                                <Badge className={statusColors[fee.status]}>
                                  {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                                </Badge>
                              </div>
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
                                  <DropdownMenuItem>
                                    <Banknote className="h-4 w-4 mr-2" />
                                    Record Payment
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Print Challan
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit Fee Record
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <p className="text-muted-foreground">No fee records found</p>
                            <Button variant="outline" className="mt-4">
                              <PlusCircle className="w-4 h-4 mr-2" />
                              Generate Fee Challan
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
        </TabsContent>

        {/* Fee Structures Tab */}
        <TabsContent value="structures">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Fee Structures</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Total: {feeStructures?.length || 0} structures
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {feeStructuresLoading ? (
                <div className="py-8 text-center">
                  <div className="spinner h-8 w-8 mx-auto mb-4 animate-spin text-primary"></div>
                  <p className="text-muted-foreground">Loading fee structures...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fee Type</TableHead>
                        <TableHead>Program/Class</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Academic Year</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feeStructures && feeStructures.length > 0 ? (
                        feeStructures.map((structure) => (
                          <TableRow key={structure.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-200 mr-3">
                                  <FileText className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium">{structure.feeType}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{structure.programName}</p>
                                {structure.className && (
                                  <p className="text-xs text-muted-foreground">{structure.className}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">₨{structure.amount.toLocaleString()}</p>
                            </TableCell>
                            <TableCell>
                              <p className="capitalize">{structure.frequency}</p>
                            </TableCell>
                            <TableCell>{structure.academicYear}</TableCell>
                            <TableCell>
                              <Badge className={statusColors[structure.status]}>
                                {structure.status.charAt(0).toUpperCase() + structure.status.slice(1)}
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
                                  <DropdownMenuItem>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit Structure
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Generate Challans
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-muted-foreground">No fee structures found</p>
                            <Button variant="outline" className="mt-4">
                              <PlusCircle className="w-4 h-4 mr-2" />
                              Add Fee Structure
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
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}