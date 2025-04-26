import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { School, Lock, User, ClipboardCheck, Receipt } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const { user, loginMutation } = useAuth();
  const [location, navigate] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl lg:h-[600px] bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        {/* Left side - Auth form */}
        <div className="w-full lg:w-1/2 p-8">
          <div className="mb-8 flex justify-center lg:justify-start">
            <div className="flex items-center">
              <School className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-2" />
              <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">DAE SMS</h1>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your credentials to access the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="username" 
                              className="pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="password" 
                              placeholder="********" 
                              className="pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Hero */}
        <div className="hidden lg:block w-1/2 bg-primary-900 text-white p-12 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">DAE School Management System</h2>
            <p className="text-primary-100 mb-8">
              A comprehensive platform to manage students, faculty, attendance, 
              fees, exams, and more for Diploma of Associate Engineering schools.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-800/50 flex items-center justify-center mr-4">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Student & Faculty Management</h3>
                  <p className="text-sm text-primary-200">Complete profiles, assignments & tracking</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-800/50 flex items-center justify-center mr-4">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Attendance & Results</h3>
                  <p className="text-sm text-primary-200">Track attendance & manage exam results</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-800/50 flex items-center justify-center mr-4">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Fee Management</h3>
                  <p className="text-sm text-primary-200">Generate fee challans & track payments</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 opacity-10">
            <School className="h-64 w-64" />
          </div>
        </div>
      </div>
    </div>
  );
}