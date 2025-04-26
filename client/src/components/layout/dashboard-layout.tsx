import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import Sidebar from "./sidebar";
import Header from "./header";
import { Home, ChevronRight } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ label: string; href: string }>>([]);

  // Generate breadcrumbs based on current location
  useEffect(() => {
    const generateBreadcrumbs = () => {
      const pathSegments = location.split('/').filter(Boolean);
      const crumbs = [{ label: 'Home', href: '/' }];

      // If we're on the home page, just return home
      if (pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === '')) {
        return crumbs;
      }

      // Add additional breadcrumbs based on path segments
      let currentPath = '';
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        let label = segment.charAt(0).toUpperCase() + segment.slice(1);
        
        // Handle IDs in the URL by replacing with a better label
        if (/^\d+$/.test(segment)) {
          if (pathSegments[index - 1] === 'students') label = 'Student Details';
          else if (pathSegments[index - 1] === 'faculty') label = 'Faculty Details';
          else if (pathSegments[index - 1] === 'programs') label = 'Program Details';
        }
        
        crumbs.push({ label, href: currentPath });
      });

      return crumbs;
    };

    setBreadcrumbs(generateBreadcrumbs());
  }, [location]);

  // Close sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex h-screen overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="inline-flex items-center">
                      {index === 0 ? (
                        <a 
                          href={crumb.href} 
                          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                        >
                          <Home className="w-4 h-4 mr-2" />
                          {crumb.label}
                        </a>
                      ) : (
                        <div className="flex items-center">
                          <ChevronRight className="w-4 h-4 text-slate-400 mx-1" />
                          {index === breadcrumbs.length - 1 ? (
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {crumb.label}
                            </span>
                          ) : (
                            <a 
                              href={crumb.href} 
                              className="text-sm font-medium text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                            >
                              {crumb.label}
                            </a>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
            
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
