import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { ProgramForm } from "@/components/forms/program-form";
import { ClassForm } from "@/components/forms/class-form";
import { SectionForm } from "@/components/forms/section-form";
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
  School, 
  PlusCircle, 
  Search, 
  Download, 
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Layers,
  Users,
  Upload,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProgramsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("programs");
  
  // Dialog state
  const [showAddProgramForm, setShowAddProgramForm] = useState(false);
  const [showAddClassForm, setShowAddClassForm] = useState(false);
  const [showAddSectionForm, setShowAddSectionForm] = useState(false);
  
  // Edit state
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [showEditProgramForm, setShowEditProgramForm] = useState(false);
  
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [showEditClassForm, setShowEditClassForm] = useState(false);
  
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [showEditSectionForm, setShowEditSectionForm] = useState(false);

  // Types for programs and classes
  interface Program {
    id: number;
    name: string;
    code: string;
    duration: string;
    totalStudents: number;
    status: string;
    description?: string;
  }

  interface Class {
    id: number;
    name: string;
    programId: number;
    programName: string;
    semester: number;
    totalStudents: number;
    status: string;
  }

  interface Section {
    id: number;
    name: string;
    classId: number;
    className: string;
    capacity: number;
    currentStudents: number;
    status: string;
  }

  // Fetch data based on active tab
  const { data: programs, isLoading: programsLoading } = useQuery<Program[]>({
    queryKey: ["/api/programs", { search: searchTerm }],
    enabled: activeTab === "programs",
  });

  const { data: classes, isLoading: classesLoading } = useQuery<Class[]>({
    queryKey: ["/api/classes", { search: searchTerm }],
    enabled: activeTab === "classes",
  });

  const { data: sections, isLoading: sectionsLoading } = useQuery<Section[]>({
    queryKey: ["/api/sections", { search: searchTerm }],
    enabled: activeTab === "sections",
  });
  
  // Delete mutations
  const deleteProgramMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/programs/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      toast({
        title: "Program deleted",
        description: "The program has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete program.",
        variant: "destructive",
      });
    },
  });
  
  const deleteClassMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/classes/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/classes"] });
      toast({
        title: "Class deleted",
        description: "The class has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete class.",
        variant: "destructive",
      });
    },
  });
  
  const deleteSectionMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/sections/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
      toast({
        title: "Section deleted",
        description: "The section has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete section.",
        variant: "destructive",
      });
    },
  });

  // Status badge color mapping
  const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    inactive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  };
  
  // Button handlers
  const handleAddItem = () => {
    if (activeTab === "programs") {
      setShowAddProgramForm(true);
    } else if (activeTab === "classes") {
      setShowAddClassForm(true);
    } else if (activeTab === "sections") {
      setShowAddSectionForm(true);
    }
  };
  
  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setShowEditProgramForm(true);
  };
  
  const handleEditClass = (cls: Class) => {
    setEditingClass(cls);
    setShowEditClassForm(true);
  };
  
  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setShowEditSectionForm(true);
  };
  
  const handleDeleteProgram = (id: number) => {
    if (window.confirm("Are you sure you want to delete this program? This action cannot be undone.")) {
      deleteProgramMutation.mutate(id);
    }
  };
  
  const handleDeleteClass = (id: number) => {
    if (window.confirm("Are you sure you want to delete this class? This action cannot be undone.")) {
      deleteClassMutation.mutate(id);
    }
  };
  
  const handleDeleteSection = (id: number) => {
    if (window.confirm("Are you sure you want to delete this section? This action cannot be undone.")) {
      deleteSectionMutation.mutate(id);
    }
  };
  
  const handleImportExport = (action: 'import' | 'export') => {
    toast({
      title: `${action === 'import' ? 'Import' : 'Export'} Coming Soon`,
      description: `The ${action} functionality will be available soon.`,
    });
  };

  return (
    <DashboardLayout>
      {/* Page Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Programs & Classes</h1>
        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
          <Button 
            className="inline-flex items-center"
            onClick={handleAddItem}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New {activeTab === "programs" ? "Program" : activeTab === "classes" ? "Class" : "Section"}
          </Button>
          <Button 
            variant="outline" 
            className="inline-flex items-center"
            onClick={() => handleImportExport('export')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            className="inline-flex items-center"
            onClick={() => handleImportExport('import')}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="programs" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
        </TabsList>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Programs Tab */}
        <TabsContent value="programs">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Programs List</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Total: {programs?.length || 0} programs
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {programsLoading ? (
                <div className="py-8 text-center">
                  <div className="spinner h-8 w-8 mx-auto mb-4 animate-spin text-primary"></div>
                  <p className="text-muted-foreground">Loading programs...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Program Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {programs && programs.length > 0 ? (
                        programs.map((program) => (
                          <TableRow key={program.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-200 mr-3">
                                  <School className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium">{program.name}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{program.code}</TableCell>
                            <TableCell>{program.duration}</TableCell>
                            <TableCell>{program.totalStudents}</TableCell>
                            <TableCell>
                              <Badge className={statusColors[program.status]}>
                                {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
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
                                  <DropdownMenuItem onClick={() => handleEditProgram(program)}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit Program
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600 dark:text-red-400"
                                    onClick={() => handleDeleteProgram(program.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Program
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <p className="text-muted-foreground">No programs found</p>
                            <Button variant="outline" className="mt-4">
                              <PlusCircle className="w-4 h-4 mr-2" />
                              Add New Program
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

        {/* Classes Tab */}
        <TabsContent value="classes">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Classes List</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Total: {classes?.length || 0} classes
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {classesLoading ? (
                <div className="py-8 text-center">
                  <div className="spinner h-8 w-8 mx-auto mb-4 animate-spin text-primary"></div>
                  <p className="text-muted-foreground">Loading classes...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Class Name</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classes && classes.length > 0 ? (
                        classes.map((cls) => (
                          <TableRow key={cls.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-200 mr-3">
                                  <Layers className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium">{cls.name}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{cls.programName}</TableCell>
                            <TableCell>{cls.semester}</TableCell>
                            <TableCell>{cls.totalStudents}</TableCell>
                            <TableCell>
                              <Badge className={statusColors[cls.status]}>
                                {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
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
                                  <DropdownMenuItem onClick={() => handleEditClass(cls)}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit Class
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600 dark:text-red-400"
                                    onClick={() => handleDeleteClass(cls.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Class
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <p className="text-muted-foreground">No classes found</p>
                            <Button variant="outline" className="mt-4">
                              <PlusCircle className="w-4 h-4 mr-2" />
                              Add New Class
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

        {/* Sections Tab */}
        <TabsContent value="sections">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Sections List</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Total: {sections?.length || 0} sections
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {sectionsLoading ? (
                <div className="py-8 text-center">
                  <div className="spinner h-8 w-8 mx-auto mb-4 animate-spin text-primary"></div>
                  <p className="text-muted-foreground">Loading sections...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Section Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sections && sections.length > 0 ? (
                        sections.map((section) => (
                          <TableRow key={section.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-200 mr-3">
                                  <Users className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium">{section.name}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{section.className}</TableCell>
                            <TableCell>{section.capacity}</TableCell>
                            <TableCell>{section.currentStudents}</TableCell>
                            <TableCell>
                              <Badge className={statusColors[section.status]}>
                                {section.status.charAt(0).toUpperCase() + section.status.slice(1)}
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
                                  <DropdownMenuItem onClick={() => handleEditSection(section)}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit Section
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600 dark:text-red-400"
                                    onClick={() => handleDeleteSection(section.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Section
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <p className="text-muted-foreground">No sections found</p>
                            <Button variant="outline" className="mt-4">
                              <PlusCircle className="w-4 h-4 mr-2" />
                              Add New Section
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
      
      {/* Form Dialogs */}
      {/* Program Form Dialogs */}
      <ProgramForm
        open={showAddProgramForm}
        onOpenChange={setShowAddProgramForm}
        isEditing={false}
      />
      
      <ProgramForm
        open={showEditProgramForm}
        onOpenChange={setShowEditProgramForm}
        initialData={editingProgram || undefined}
        isEditing={true}
      />
      
      {/* Class Form Dialogs */}
      <ClassForm
        open={showAddClassForm}
        onOpenChange={setShowAddClassForm}
        isEditing={false}
      />
      
      <ClassForm
        open={showEditClassForm}
        onOpenChange={setShowEditClassForm}
        initialData={editingClass || undefined}
        isEditing={true}
      />
      
      {/* Section Form Dialogs */}
      <SectionForm
        open={showAddSectionForm}
        onOpenChange={setShowAddSectionForm}
        isEditing={false}
      />
      
      <SectionForm
        open={showEditSectionForm}
        onOpenChange={setShowEditSectionForm}
        initialData={editingSection || undefined}
        isEditing={true}
      />
    </DashboardLayout>
  );
}