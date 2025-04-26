import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { FacultyForm } from "@/components/forms/faculty-form";
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
  GraduationCap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FacultyManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddFacultyForm, setShowAddFacultyForm] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [showEditFacultyForm, setShowEditFacultyForm] = useState(false);

  // Type for Faculty member
  interface Faculty {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    employeeId: string;
    qualification: string;
    specialization: string;
    status: string;
    experience?: string;
    joiningDate?: string;
    department?: string;
    address?: string;
    userId?: number;
  }

  // Fetch faculty with search
  const { data: faculty, isLoading } = useQuery<Faculty[]>({
    queryKey: ["/api/faculty", { search: searchTerm }],
  });

  // Delete faculty mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/faculty/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faculty"] });
      toast({
        title: "Faculty deleted",
        description: "The faculty member has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete faculty member.",
        variant: "destructive",
      });
    },
  });

  // Status badge color mapping
  const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    inactive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    onLeave: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  };

  // Handlers
  const handleAddFaculty = () => {
    setShowAddFacultyForm(true);
  };

  const handleEditFaculty = (member: Faculty) => {
    setEditingFaculty(member);
    setShowEditFacultyForm(true);
  };

  const handleDeleteFaculty = (id: number) => {
    if (window.confirm("Are you sure you want to delete this faculty member? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleImport = () => {
    toast({
      title: "Coming Soon",
      description: "The import functionality will be available soon.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Coming Soon",
      description: "The export functionality will be available soon.",
    });
  };

  const handleViewDetails = (member: Faculty) => {
    toast({
      title: "Faculty Details",
      description: `Viewing details for ${member.fullName}. This feature will be expanded soon.`,
    });
  };

  return (
    <DashboardLayout>
      {/* Add Faculty Form */}
      <FacultyForm
        open={showAddFacultyForm}
        onOpenChange={setShowAddFacultyForm}
        isEditing={false}
      />

      {/* Edit Faculty Form */}
      {editingFaculty && (
        <FacultyForm
          open={showEditFacultyForm}
          onOpenChange={setShowEditFacultyForm}
          initialData={editingFaculty}
          isEditing={true}
        />
      )}

      {/* Page Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Faculty Management</h1>
        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
          <Button className="inline-flex items-center" onClick={handleAddFaculty}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New Faculty
          </Button>
          <Button variant="outline" className="inline-flex items-center" onClick={handleImport}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" className="inline-flex items-center" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Search Faculty</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or ID..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Faculty List */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Faculty Members</CardTitle>
            <p className="text-sm text-muted-foreground">
              Total: {faculty?.length || 0} members
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="spinner h-8 w-8 mx-auto mb-4 animate-spin text-primary"></div>
              <p className="text-muted-foreground">Loading faculty members...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faculty</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Qualification</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faculty && faculty.length > 0 ? (
                    faculty.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-200 mr-3">
                              <GraduationCap className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{member.fullName}</p>
                              <p className="text-xs text-muted-foreground">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{member.employeeId}</TableCell>
                        <TableCell>{member.qualification}</TableCell>
                        <TableCell>{member.specialization}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[member.status]}>
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
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
                              <DropdownMenuItem onClick={() => handleViewDetails(member)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditFaculty(member)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Faculty
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 dark:text-red-400"
                                onClick={() => handleDeleteFaculty(member.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Faculty
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p className="text-muted-foreground">No faculty members found</p>
                        <Button variant="outline" className="mt-4" onClick={handleAddFaculty}>
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Add New Faculty
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