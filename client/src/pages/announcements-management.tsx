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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Megaphone,
  Search,
  Plus,
  Download,
  Upload,
  MoreHorizontal,
  Eye,
  Pencil,
  Pin,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function AnnouncementsManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [targetRole, setTargetRole] = useState("all");
  const [isPinned, setIsPinned] = useState<boolean | undefined>(undefined);

  // Fetch announcements
  const { data: announcements, isLoading } = useQuery<any[]>({
    queryKey: [
      "/api/announcements", 
      { 
        targetRole: targetRole !== "all" ? targetRole : undefined,
        isPinned: isPinned
      }
    ],
  });

  // Handlers for buttons
  const handleAddAnnouncement = () => {
    toast({
      title: "Coming Soon",
      description: "The add announcement functionality will be available soon.",
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

  const handleViewAnnouncement = (id: number) => {
    toast({
      title: "View Announcement",
      description: `Viewing announcement ID: ${id}`,
    });
  };

  const handleEditAnnouncement = (id: number) => {
    toast({
      title: "Edit Announcement",
      description: `Editing announcement ID: ${id}`,
    });
  };

  const handlePinAnnouncement = (id: number) => {
    toast({
      title: "Pin Announcement",
      description: `Toggling pin status for announcement ID: ${id}`,
    });
  };

  const handleDeleteAnnouncement = (id: number) => {
    toast({
      title: "Delete Announcement",
      description: `Deleting announcement ID: ${id}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Announcements Management</h1>
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
              <Megaphone className="mr-2 h-5 w-5" />
              Announcements
            </CardTitle>
            <CardDescription>
              Create and manage announcements for students, faculty, and staff
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center w-full max-w-md space-x-2">
                  <Input
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium">Target Audience</span>
                    <Select
                      value={targetRole}
                      onValueChange={setTargetRole}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="student">Students</SelectItem>
                        <SelectItem value="accountant">Accountant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pinned"
                      checked={isPinned} 
                      onCheckedChange={(checked) => {
                        setIsPinned(checked === "indeterminate" ? undefined : checked);
                      }}
                    />
                    <label
                      htmlFor="pinned"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Pinned Only
                    </label>
                  </div>

                  <Button onClick={handleAddAnnouncement}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Announcement
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Target Audience</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8"
                        >
                          Loading announcements...
                        </TableCell>
                      </TableRow>
                    ) : announcements && announcements.length > 0 ? (
                      announcements.map((announcement) => (
                        <TableRow key={announcement.id}>
                          <TableCell>{announcement.id}</TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {announcement.isPinned && (
                                <Pin className="h-3 w-3 mr-2 text-yellow-500" />
                              )}
                              {announcement.title}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {announcement.targetRole}
                            </Badge>
                          </TableCell>
                          <TableCell>{announcement.date}</TableCell>
                          <TableCell>
                            {announcement.isActive ? (
                              <Badge>Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewAnnouncement(announcement.id)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditAnnouncement(announcement.id)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit Announcement
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePinAnnouncement(announcement.id)}>
                                  <Pin className="h-4 w-4 mr-2" />
                                  {announcement.isPinned ? "Unpin" : "Pin"} Announcement
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 dark:text-red-400"
                                  onClick={() => handleDeleteAnnouncement(announcement.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Announcement
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8"
                        >
                          <p className="text-muted-foreground">
                            No announcements found
                          </p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={handleAddAnnouncement}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Announcement
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
      </div>
    </DashboardLayout>
  );
}