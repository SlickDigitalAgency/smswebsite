import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Clock,
  Download,
  Upload,
  Plus,
  FileEdit,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TimetableManagement() {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSection, setSelectedSection] = useState<string>("all");

  // Fetch timetable data
  const { data: timetable, isLoading: isLoadingTimetable } = useQuery<any[]>({
    queryKey: ["/api/timetable", { classId: selectedClass, sectionId: selectedSection }],
  });

  // Fetch classes for the dropdown
  const { data: classes } = useQuery<{ id: number; name: string }[]>({
    queryKey: ["/api/classes"],
  });

  // Fetch sections for the dropdown
  const { data: sections } = useQuery<{ id: number; name: string }[]>({
    queryKey: ["/api/sections", { classId: selectedClass !== "all" ? selectedClass : undefined }],
    enabled: selectedClass !== "all",
  });

  // Handlers for buttons
  const handleAddEntry = () => {
    toast({
      title: "Coming Soon",
      description: "The add timetable entry functionality will be available soon.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Coming Soon",
      description: "The export functionality will be available soon.",
    });
  };

  const handleImport = () => {
    toast({
      title: "Coming Soon",
      description: "The import functionality will be available soon.",
    });
  };

  // Create days of the week array
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Create periods/time slots array
  const periods = [
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Timetable Management</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" /> 
              Timetable
            </CardTitle>
            <CardDescription>
              View and manage class schedules and timetables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
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
                        {classes?.map((classItem) => (
                          <SelectItem 
                            key={classItem.id} 
                            value={classItem.id.toString()}
                          >
                            {classItem.name}
                          </SelectItem>
                        ))}
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
                        {sections?.map((section) => (
                          <SelectItem 
                            key={section.id} 
                            value={section.id.toString()}
                          >
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleAddEntry}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </div>

              <div className="rounded-md border">
                {isLoadingTimetable ? (
                  <div className="flex justify-center items-center py-8">
                    <p>Loading timetable...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[100px] bg-muted">Time / Day</TableHead>
                          {days.map((day) => (
                            <TableHead key={day} className="min-w-[150px]">{day}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {periods.map((period, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium bg-muted">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                                {period}
                              </div>
                            </TableCell>
                            {days.map((day) => (
                              <TableCell key={`${day}-${index}`} className="p-2">
                                {/* Placeholder for timetable data */}
                                <div className="p-2 bg-primary/5 rounded-md border border-border hover:bg-primary/10 cursor-pointer transition-colors">
                                  <div className="font-medium text-sm">Mathematics</div>
                                  <div className="text-muted-foreground text-xs">Mr. John Smith</div>
                                  <div className="text-muted-foreground text-xs">Room 101</div>
                                  <div className="flex mt-1 space-x-1">
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                      <FileEdit className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive">
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}