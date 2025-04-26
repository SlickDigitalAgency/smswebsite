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
interface Class {
  id: number;
  name: string;
  programId: number;
  programName: string;
}

// Create section form schema
const sectionSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  classId: z.string().min(1, "Class is required"),
  capacity: z.string().min(1, "Capacity is required"),
  status: z.string().min(1, "Status is required"),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

interface SectionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<SectionFormValues> & { id?: number };
  isEditing?: boolean;
}

export function SectionForm({
  open,
  onOpenChange,
  initialData,
  isEditing = false,
}: SectionFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch classes for dropdown
  const { data: classes } = useQuery<Class[]>({
    queryKey: ["/api/classes"],
    enabled: open,
  });

  // Initialize form with default values or edit data
  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: initialData?.name || "",
      classId: initialData?.classId?.toString() || "",
      capacity: initialData?.capacity?.toString() || "",
      status: initialData?.status || "active",
    },
  });

  // Create mutation for adding/editing section
  const mutation = useMutation({
    mutationFn: async (values: SectionFormValues) => {
      const payload = {
        ...values,
        classId: parseInt(values.classId),
        capacity: parseInt(values.capacity),
      };

      if (isEditing && initialData?.id) {
        const res = await apiRequest(
          "PATCH",
          `/api/sections/${initialData.id}`,
          payload
        );
        return await res.json();
      } else {
        const res = await apiRequest("POST", "/api/sections", payload);
        return await res.json();
      }
    },
    onSuccess: () => {
      // Invalidate sections query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
      
      // Show success message
      toast({
        title: `Section ${isEditing ? "updated" : "added"} successfully`,
        description: `The section has been ${isEditing ? "updated" : "added"} to the system.`,
      });
      
      // Close the dialog and reset form
      onOpenChange(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? "update" : "add"} section.`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Form submission handler
  const onSubmit = (values: SectionFormValues) => {
    setIsSubmitting(true);
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Section" : "Add New Section"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the information of an existing section."
              : "Add a new section to the system."}
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
                    <FormLabel>Section Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Section A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes?.map((cls) => (
                          <SelectItem 
                            key={cls.id} 
                            value={cls.id.toString()}
                          >
                            {cls.name} - {cls.programName}
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
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="40" 
                        {...field} 
                      />
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
                  <>{isEditing ? "Update Section" : "Add Section"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}