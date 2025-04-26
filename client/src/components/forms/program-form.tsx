import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Create program form schema
const programSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  code: z.string().min(1, "Program code is required"),
  duration: z.string().min(1, "Duration is required"),
  description: z.string().optional(),
  status: z.string().min(1, "Status is required"),
});

type ProgramFormValues = z.infer<typeof programSchema>;

interface ProgramFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ProgramFormValues & { id?: number };
  isEditing?: boolean;
}

export function ProgramForm({
  open,
  onOpenChange,
  initialData,
  isEditing = false,
}: ProgramFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values or edit data
  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: initialData || {
      name: "",
      code: "",
      duration: "",
      description: "",
      status: "active",
    },
  });

  // Create mutation for adding/editing program
  const mutation = useMutation({
    mutationFn: async (values: ProgramFormValues) => {
      if (isEditing && initialData?.id) {
        const res = await apiRequest(
          "PATCH",
          `/api/programs/${initialData.id}`,
          values
        );
        return await res.json();
      } else {
        const res = await apiRequest("POST", "/api/programs", values);
        return await res.json();
      }
    },
    onSuccess: () => {
      // Invalidate programs query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      
      // Show success message
      toast({
        title: `Program ${isEditing ? "updated" : "added"} successfully`,
        description: `The program has been ${isEditing ? "updated" : "added"} to the system.`,
      });
      
      // Close the dialog and reset form
      onOpenChange(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? "update" : "add"} program.`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Form submission handler
  const onSubmit = (values: ProgramFormValues) => {
    setIsSubmitting(true);
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Program" : "Add New Program"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the information of an existing program."
              : "Add a new program to the system."}
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
                    <FormLabel>Program Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Diploma in Civil Engineering" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Code</FormLabel>
                    <FormControl>
                      <Input placeholder="DCE-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="3 Years" {...field} />
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Program description and other details..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <>{isEditing ? "Update Program" : "Add Program"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}