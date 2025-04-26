import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Types
interface Program {
  id: number;
  name: string;
}

// Create class form schema
const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  programId: z.string().min(1, "Program is required"),
  semester: z.string().min(1, "Semester is required"),
  status: z.string().min(1, "Status is required"),
});

type ClassFormValues = z.infer<typeof classSchema>;

interface ClassFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<ClassFormValues> & { id?: number };
  isEditing?: boolean;
}

export function ClassForm({
  open,
  onOpenChange,
  initialData,
  isEditing = false,
}: ClassFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch programs for dropdown
  const { data: programs } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
    enabled: open,
  });

  // Initialize form with default values or edit data
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: initialData?.name || "",
      programId: initialData?.programId?.toString() || "",
      semester: initialData?.semester?.toString() || "",
      status: initialData?.status || "active",
    },
  });

  // Create mutation for adding/editing class
  const mutation = useMutation({
    mutationFn: async (values: ClassFormValues) => {
      const payload = {
        ...values,
        programId: parseInt(values.programId),
        semester: parseInt(values.semester),
      };

      if (isEditing && initialData?.id) {
        const res = await apiRequest(
          "PATCH",
          `/api/classes/${initialData.id}`,
          payload
        );
        return await res.json();
      } else {
        const res = await apiRequest("POST", "/api/classes", payload);
        return await res.json();
      }
    },
    onSuccess: () => {
      // Invalidate classes query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/classes"] });
      
      // Show success message
      toast({
        title: `Class ${isEditing ? "updated" : "added"} successfully`,
        description: `The class has been ${isEditing ? "updated" : "added"} to the system.`,
      });
      
      // Close the dialog and reset form
      onOpenChange(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? "update" : "add"} class.`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Form submission handler
  const onSubmit = (values: ClassFormValues) => {
    setIsSubmitting(true);
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Class" : "Add New Class"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the information of an existing class."
              : "Add a new class to the system."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Civil Engineering - Year 1" {...field} />
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
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((semester) => (
                          <SelectItem 
                            key={semester} 
                            value={semester.toString()}
                          >
                            Semester {semester}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⚙️</span>
                    {isEditing ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>{isEditing ? "Update Class" : "Add Class"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}