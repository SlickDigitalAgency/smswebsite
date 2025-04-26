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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileSpreadsheet,
  FilePlus,
  Search,
  Plus,
  Download,
  Upload,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ExamsManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("exams");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  // Fetch exams
  const { data: exams, isLoading: isLoadingExams } = useQuery<any[]>({
    queryKey: ["/api/exams"],
  });

  // Fetch results
  const { data: results, isLoading: isLoadingResults } = useQuery<any[]>({
    queryKey: ["/api/results"],
  });

  // Handlers for buttons
  const handleAddExam = () => {
    toast({
      title: "Coming Soon",
      description: "The add exam functionality will be available soon.",
    });
  };

  const handleAddResult = () => {
    toast({
      title: "Coming Soon",
      description: "The add result functionality will be available soon.",
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

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Exams & Results Management</h1>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="exams">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Exams
            </TabsTrigger>
            <TabsTrigger value="results">
              <FilePlus className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger>
          </TabsList>

          {/* Exams Tab */}
          <TabsContent value="exams">
            <Card>
              <CardHeader>
                <CardTitle>Exams</CardTitle>
                <CardDescription>
                  Manage and schedule exams for all classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center w-full max-w-md space-x-2">
                      <Input
                        placeholder="Search exams..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                      <Button variant="outline" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
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

                      <Select
                        value={selectedSubject}
                        onValueChange={setSelectedSubject}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subjects</SelectItem>
                          <SelectItem value="1">Mathematics</SelectItem>
                          <SelectItem value="2">Physics</SelectItem>
                          <SelectItem value="3">Chemistry</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button onClick={handleAddExam}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Exam
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Exam ID</TableHead>
                          <TableHead>Exam Title</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Total Marks</TableHead>
                          <TableHead>Duration (min)</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingExams ? (
                          <TableRow>
                            <TableCell
                              colSpan={9}
                              className="text-center py-8"
                            >
                              Loading exams...
                            </TableCell>
                          </TableRow>
                        ) : exams && exams.length > 0 ? (
                          exams.map((exam) => (
                            <TableRow key={exam.id}>
                              <TableCell>{exam.id}</TableCell>
                              <TableCell>{exam.title}</TableCell>
                              <TableCell>{exam.subject}</TableCell>
                              <TableCell>{exam.class}</TableCell>
                              <TableCell>{exam.date}</TableCell>
                              <TableCell>{exam.totalMarks}</TableCell>
                              <TableCell>{exam.duration}</TableCell>
                              <TableCell>{exam.status}</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={9}
                              className="text-center py-8"
                            >
                              <p className="text-muted-foreground">
                                No exams found
                              </p>
                              <Button
                                variant="outline"
                                className="mt-4"
                                onClick={handleAddExam}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Schedule New Exam
                              </Button>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>
                  View and manage student results for exams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center w-full max-w-md space-x-2">
                      <Input
                        placeholder="Search results..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                      <Button variant="outline" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
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

                      <Button onClick={handleAddResult}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Result
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Result ID</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Exam</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Marks Obtained</TableHead>
                          <TableHead>Total Marks</TableHead>
                          <TableHead>Percentage</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingResults ? (
                          <TableRow>
                            <TableCell
                              colSpan={9}
                              className="text-center py-8"
                            >
                              Loading results...
                            </TableCell>
                          </TableRow>
                        ) : results && results.length > 0 ? (
                          results.map((result) => (
                            <TableRow key={result.id}>
                              <TableCell>{result.id}</TableCell>
                              <TableCell>{result.student}</TableCell>
                              <TableCell>{result.exam}</TableCell>
                              <TableCell>{result.subject}</TableCell>
                              <TableCell>{result.marksObtained}</TableCell>
                              <TableCell>{result.totalMarks}</TableCell>
                              <TableCell>{result.percentage}%</TableCell>
                              <TableCell>{result.grade}</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={9}
                              className="text-center py-8"
                            >
                              <p className="text-muted-foreground">
                                No results found
                              </p>
                              <Button
                                variant="outline"
                                className="mt-4"
                                onClick={handleAddResult}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Result
                              </Button>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}