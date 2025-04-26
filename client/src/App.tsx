import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import StudentManagement from "@/pages/student-management";
import StudentForm from "@/pages/student-form";
import FacultyManagement from "@/pages/faculty-management";
import ProgramsManagement from "@/pages/programs-management";
import AttendanceManagement from "@/pages/attendance-management";
import FeesManagement from "@/pages/fees-management";
import ExamsManagement from "@/pages/exams-management";
import TimetableManagement from "@/pages/timetable-management";
import AnnouncementsManagement from "@/pages/announcements-management";
import ReportsManagement from "@/pages/reports-management";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/students" component={StudentManagement} />
      <ProtectedRoute path="/students/new" component={StudentForm} />
      <ProtectedRoute path="/students/:id/edit" component={StudentForm} />
      <ProtectedRoute path="/faculty" component={FacultyManagement} />
      <ProtectedRoute path="/programs" component={ProgramsManagement} />
      <ProtectedRoute path="/attendance" component={AttendanceManagement} />
      <ProtectedRoute path="/fees" component={FeesManagement} />
      <ProtectedRoute path="/exams" component={ExamsManagement} />
      <ProtectedRoute path="/timetable" component={TimetableManagement} />
      <ProtectedRoute path="/announcements" component={AnnouncementsManagement} />
      <ProtectedRoute path="/reports" component={ReportsManagement} />
      <ProtectedRoute path="/settings" component={NotFound} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
