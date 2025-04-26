import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertStudentSchema, Student } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Loader2,
  Save,
} from "lucide-react";

// Define the student form schema based on the database schema
const studentFormSchema = insertStudentSchema.extend({
  programId: z.coerce.number().min(1, "Program is required"),
  sectionId: z.coerce.number().min(1, "Section is required"),
  // Make sure date fields are properly formatted
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  admissionDate: z.string().min(1, "Admission date is required"),
});

type StudentFormData = z.infer<typeof studentFormSchema>;

export default function StudentForm() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;

  // Fetch student if in edit mode
  const { data: student, isLoading: isLoadingStudent } = useQuery<Student>({
    queryKey: ["/api/students", id],
    enabled: isEditMode,
  });

  // Fetch programs for the dropdown
  const { data: programs } = useQuery<{ id: number; name: string }[]>({
    queryKey: ["/api/programs"],
  });

  // Fetch sections based on selected program
  const [selectedProgramId, setSelectedProgramId] = useState<number | undefined>(
    student?.programId
  );

  const { data: sections } = useQuery<{ id: number; name: string }[]>({
    queryKey: ["/api/sections", { programId: selectedProgramId }],
    enabled: !!selectedProgramId,
  });

  // Form definition
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      fullName: "",
      fatherName: "",
      cnic: "",
      address: "",
      contactNumber: "",
      emergencyContact: "",
      dateOfBirth: "",
      gender: "male",
      enrollmentNo: "",
      registrationNo: "",
      programId: 0,
      sectionId: 0,
      admissionDate: "",
      status: "active",
    },
  });

  // Update form values when student data is loaded
  useEffect(() => {
    if (student && !form.formState.isDirty) {
      form.reset({
        ...student,
        programId: student.programId,
        sectionId: student.sectionId,
      });
      setSelectedProgramId(student.programId);
    }
  }, [student, form]);

  // Handle program change to update available sections
  const handleProgramChange = (value: string) => {
    const programId = parseInt(value);
    setSelectedProgramId(programId);
    form.setValue("programId", programId);
    form.setValue("sectionId", 0);
  };

  // Mutations for creating or updating students
  const createMutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      const res = await apiRequest("POST", "/api/students", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create student");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      toast({
        title: "Success",
        description: "Student created successfully",
      });
      navigate("/students");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      const res = await apiRequest("PATCH", `/api/students/${id}`, data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update student");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
      navigate("/students");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: StudentFormData) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate("/students")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit Student" : "Add New Student"}</CardTitle>
          <CardDescription>
            {isEditMode
              ? "Update the student's information in the form below."
              : "Enter the student's information to add them to the system."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditMode && isLoadingStudent ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter father's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Contact Information */}
                  <FormField
                    control={form.control}
                    name="cnic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNIC</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter CNIC number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter contact number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter emergency contact number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter residential address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Academic Information */}
                  <FormField
                    control={form.control}
                    name="registrationNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter registration number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enrollmentNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enrollment Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter enrollment number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="programId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program</FormLabel>
                        <Select
                          onValueChange={handleProgramChange}
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select program" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0" disabled>
                              Select program
                            </SelectItem>
                            {programs?.map((program) => (
                              <SelectItem
                                key={program.id}
                                value={program.id.toString()}
                              >
                                {program.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sectionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <Select
                          onValueChange={(value) => form.setValue("sectionId", parseInt(value))}
                          value={field.value.toString()}
                          disabled={!selectedProgramId || selectedProgramId <= 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0" disabled>
                              Select section
                            </SelectItem>
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
                        <FormDescription>
                          Select a program first to see available sections
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="admissionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admission Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="graduated">Graduated</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="mr-2"
                    onClick={() => navigate("/students")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Save className="mr-2 h-4 w-4" />
                    {isEditMode ? "Update Student" : "Save Student"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}