import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UserRound,
  Users,
  School,
  ClipboardCheck,
  Receipt,
  FileText,
  Calendar,
  Megaphone,
  BarChart4,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type SidebarProps = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  onClick?: () => void;
};

const NavItem = ({ icon, label, href, active, onClick }: NavItemProps) => {
  return (
    <li>
      <Link href={href}>
        <div
          onClick={onClick}
          className={cn(
            "flex items-center space-x-2 px-4 py-2.5 rounded-lg cursor-pointer",
            active
              ? "bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-100"
              : "hover:bg-gray-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200"
          )}
        >
          {icon}
          <span>{label}</span>
        </div>
      </Link>
    </li>
  );
};

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Close sidebar on mobile when clicking a link
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen(false);
    }
  };

  // Handle escape key to close the sidebar on mobile
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [mobileOpen, setMobileOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const menuBtn = document.getElementById('mobile-menu-btn');
      if (
        mobileOpen &&
        sidebar &&
        !sidebar.contains(e.target as Node) &&
        menuBtn &&
        !menuBtn.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileOpen, setMobileOpen]);

  return (
    <aside
      id="sidebar"
      className={cn(
        "sidebar fixed lg:relative z-10 w-64 lg:w-72 h-screen bg-white dark:bg-slate-800 shadow-md transition-transform",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="h-full flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-slate-700">
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">DAE SMS</h1>
          </div>
          
          {/* User info */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-200">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{user?.fullName || "User"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role || "Guest"}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <ScrollArea className="flex-1" style={{ height: "calc(100vh - 180px)" }}>
            <nav className="p-2">
              <ul className="space-y-1">
                <NavItem
                  icon={<LayoutDashboard className="w-5 h-5" />}
                  label="Dashboard"
                  href="/"
                  active={location === "/" || location === ""}
                  onClick={handleNavClick}
                />
                <NavItem
                  icon={<UserRound className="w-5 h-5" />}
                  label="Students"
                  href="/students"
                  active={location.startsWith("/students")}
                  onClick={handleNavClick}
                />
                <NavItem
                  icon={<Users className="w-5 h-5" />}
                  label="Faculty"
                  href="/faculty"
                  active={location.startsWith("/faculty")}
                  onClick={handleNavClick}
                />
                <NavItem
                  icon={<School className="w-5 h-5" />}
                  label="Classes & Programs"
                  href="/programs"
                  active={location.startsWith("/programs")}
                  onClick={handleNavClick}
                />
                <NavItem
                  icon={<ClipboardCheck className="w-5 h-5" />}
                  label="Attendance"
                  href="/attendance"
                  active={location.startsWith("/attendance")}
                  onClick={handleNavClick}
                />
                <NavItem
                  icon={<Receipt className="w-5 h-5" />}
                  label="Fee & Challans"
                  href="/fees"
                  active={location.startsWith("/fees")}
                  onClick={handleNavClick}
                />
                <NavItem
                  icon={<FileText className="w-5 h-5" />}
                  label="Exams & Results"
                  href="/exams"
                  active={location.startsWith("/exams")}
                  onClick={handleNavClick}
                />
                <NavItem
                  icon={<Calendar className="w-5 h-5" />}
                  label="Timetable"
                  href="/timetable"
                  active={location.startsWith("/timetable")}
                  onClick={handleNavClick}
                />
                <NavItem
                  icon={<Megaphone className="w-5 h-5" />}
                  label="Announcements"
                  href="/announcements"
                  active={location.startsWith("/announcements")}
                  onClick={handleNavClick}
                />
                <NavItem
                  icon={<BarChart4 className="w-5 h-5" />}
                  label="Reports"
                  href="/reports"
                  active={location.startsWith("/reports")}
                  onClick={handleNavClick}
                />
              </ul>
            </nav>
          </ScrollArea>
        </div>
        
        {/* Bottom section */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <NavItem
            icon={<Settings className="w-5 h-5" />}
            label="Settings"
            href="/settings"
            active={location.startsWith("/settings")}
            onClick={handleNavClick}
          />
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700/50"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
