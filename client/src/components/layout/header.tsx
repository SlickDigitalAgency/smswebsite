import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "next-themes";
import {
  Search,
  Bell,
  Sun,
  Moon,
  User,
  ChevronDown,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type HeaderProps = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

export default function Header({ mobileOpen, setMobileOpen }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  // Update page title based on current location
  useEffect(() => {
    const getPageTitle = () => {
      if (location === "/" || location === "") return "Dashboard";
      if (location.startsWith("/students")) return "Student Management";
      if (location.startsWith("/faculty")) return "Faculty Management";
      if (location.startsWith("/programs")) return "Classes & Programs";
      if (location.startsWith("/attendance")) return "Attendance Management";
      if (location.startsWith("/fees")) return "Fee & Challan Management";
      if (location.startsWith("/exams")) return "Exams & Results";
      if (location.startsWith("/timetable")) return "Timetable";
      if (location.startsWith("/announcements")) return "Announcements";
      if (location.startsWith("/reports")) return "Reports";
      if (location.startsWith("/settings")) return "Settings";
      if (location.startsWith("/auth")) return "Authentication";
      return "Dashboard";
    };
    
    setPageTitle(getPageTitle());
  }, [location]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          id="mobile-menu-btn"
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Search bar */}
        <div className="hidden md:flex items-center space-x-2 bg-gray-100 dark:bg-slate-700/50 rounded-lg px-3 py-2 flex-1 max-w-lg">
          <Search className="h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none shadow-none focus-visible:ring-0 text-slate-700 dark:text-slate-200"
          />
        </div>
        
        {/* Quick actions */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-gray-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          
          <div className="border-l border-gray-200 dark:border-slate-700 h-6 mx-2"></div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative p-0 flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-200">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden md:block text-sm font-medium">{user?.fullName || "User"}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <p className="text-sm font-medium">{user?.fullName || "User"}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role || "Guest"}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
