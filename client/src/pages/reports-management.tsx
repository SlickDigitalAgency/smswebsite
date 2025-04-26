import { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import {
  LineChart,
  BarChart,
  PieChart,
  FileSpreadsheet,
  FileText,
  Users,
  GraduationCap,
  Calendar,
  DollarSign,
  Download,
  FileDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ReportsManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("attendance");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{from?: Date; to?: Date}>({});

  // Handlers for buttons
  const handleGenerateReport = (reportType: string) => {
    toast({
      title: "Generating Report",
      description: `Generating ${reportType} report. This feature will be available soon.`,
    });
  };

  const handleDownloadReport = (reportType: string, format: string) => {
    toast({
      title: "Downloading Report",
      description: `Downloading ${reportType} report in ${format} format. This feature will be available soon.`,
    });
  };

  // List of available report types
  const reportTypes = [
    {
      id: "attendance",
      name: "Attendance Reports",
      icon: <Calendar className="h-5 w-5" />,
      description: "Generate attendance reports for students and faculty",
      options: [
        "Daily Attendance Summary",
        "Monthly Attendance Report",
        "Student-wise Attendance",
        "Subject-wise Attendance",
        "Faculty Attendance"
      ]
    },
    {
      id: "academic",
      name: "Academic Reports",
      icon: <GraduationCap className="h-5 w-5" />,
      description: "Generate reports for academic performance and results",
      options: [
        "Result Analysis",
        "Subject-wise Performance",
        "Class-wise Analysis",
        "Grade Distribution",
        "Topper List"
      ]
    },
    {
      id: "financial",
      name: "Financial Reports",
      icon: <DollarSign className="h-5 w-5" />,
      description: "Generate reports for fees collection and financial status",
      options: [
        "Fee Collection Summary",
        "Outstanding Payments",
        "Monthly Collection Report",
        "Fee Category Analysis",
        "Defaulter List"
      ]
    },
    {
      id: "student",
      name: "Student Reports",
      icon: <Users className="h-5 w-5" />,
      description: "Generate reports for student details and statistics",
      options: [
        "Student Directory",
        "Class-wise Strength",
        "Gender Distribution",
        "Admission Trends",
        "Student Profile"
      ]
    },
    {
      id: "misc",
      name: "Miscellaneous Reports",
      icon: <FileText className="h-5 w-5" />,
      description: "Other administrative and statistical reports",
      options: [
        "Timetable Report",
        "Faculty Workload",
        "Infrastructure Usage",
        "Event Participation",
        "General Statistics"
      ]
    },
  ];

  // Get current report type details
  const currentReportType = reportTypes.find(r => r.id === activeTab);

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reports Management</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSpreadsheet className="mr-2 h-5 w-5" />
                Reports
              </CardTitle>
              <CardDescription>
                Generate and download various reports for the institution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 mb-6">
                  {reportTypes.map(reportType => (
                    <TabsTrigger key={reportType.id} value={reportType.id} className="flex items-center">
                      {reportType.icon}
                      <span className="ml-2">{reportType.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {reportTypes.map(reportType => (
                  <TabsContent key={reportType.id} value={reportType.id}>
                    <div className="flex flex-col space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="text-lg font-medium">{reportType.name}</h3>
                          <p className="text-sm text-muted-foreground">{reportType.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium">Class</span>
                          <Select
                            value={selectedClass}
                            onValueChange={setSelectedClass}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Classes</SelectItem>
                              <SelectItem value="1">Class 1</SelectItem>
                              <SelectItem value="2">Class 2</SelectItem>
                              <SelectItem value="3">Class 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium">Section</span>
                          <Select
                            value={selectedSection}
                            onValueChange={setSelectedSection}
                            disabled={selectedClass === "all"}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select Section" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Sections</SelectItem>
                              <SelectItem value="1">Section A</SelectItem>
                              <SelectItem value="2">Section B</SelectItem>
                              <SelectItem value="3">Section C</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium">Date Range</span>
                          <DatePicker
                            selected={dateRange.from}
                            onSelect={(date?: Date) => {
                              const current = { ...dateRange };
                              if (current.from && !current.to && date && date > current.from) {
                                setDateRange({ ...current, to: date });
                              } else {
                                setDateRange({ from: date, to: undefined });
                              }
                            }}
                          />
                        </div>

                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium">Report Type</span>
                          <Select>
                            <SelectTrigger className="w-[250px]">
                              <SelectValue placeholder="Select Report Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {reportType.options.map((option, index) => (
                                <SelectItem key={index} value={option.toLowerCase().replace(/ /g, '-')}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 items-center mt-4">
                        <Button onClick={() => handleGenerateReport(reportType.name)}>
                          Generate Report
                        </Button>

                        <div className="space-x-2">
                          <Button 
                            variant="outline"
                            onClick={() => handleDownloadReport(reportType.name, 'PDF')}
                          >
                            <FileDown className="h-4 w-4 mr-2" />
                            PDF
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleDownloadReport(reportType.name, 'Excel')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Excel
                          </Button>
                        </div>
                      </div>

                      <div className="mt-8 p-6 border rounded-md flex flex-col items-center justify-center space-y-4 bg-muted/20">
                        {activeTab === 'attendance' && (
                          <BarChart className="h-16 w-16 text-muted-foreground" />
                        )}
                        {activeTab === 'academic' && (
                          <LineChart className="h-16 w-16 text-muted-foreground" />
                        )}
                        {activeTab === 'financial' && (
                          <PieChart className="h-16 w-16 text-muted-foreground" />
                        )}
                        {activeTab === 'student' && (
                          <Users className="h-16 w-16 text-muted-foreground" />
                        )}
                        {activeTab === 'misc' && (
                          <FileText className="h-16 w-16 text-muted-foreground" />
                        )}

                        <div className="text-center">
                          <h3 className="text-lg font-medium">Generate a Report to Preview</h3>
                          <p className="text-muted-foreground">
                            Select options above and click "Generate Report" to see a preview
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}