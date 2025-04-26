import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Announcement } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function Announcements() {
  const { data: announcements, isLoading, error } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });

  // Color mapping for announcement types
  const getColorClasses = (index: number) => {
    const colors = [
      "bg-red-500", // urgent
      "bg-primary-500", // information
      "bg-emerald-500", // success
      "bg-amber-500", // warning
    ];
    return colors[index % colors.length];
  };

  // Function to get a relative time string
  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return "recently";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Recent Announcements</CardTitle>
          <Button variant="link" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            Failed to load announcements. Please try again.
          </div>
        ) : announcements && announcements.length > 0 ? (
          <div className="space-y-0">
            {announcements.slice(0, 4).map((announcement, index) => (
              <div key={announcement.id} className="mb-4 pb-4 border-b border-gray-200 dark:border-slate-700 last:border-b-0 last:pb-0">
                <div className="flex items-start">
                  <span className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${getColorClasses(index)}`}></span>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">{announcement.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {announcement.content}
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {getRelativeTime(announcement.createdAt)} • {announcement.userId === -1 ? "Admin" : "User"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // If no announcements are available
          <div className="text-center py-6 text-slate-500 dark:text-slate-400">
            <p>No announcements available.</p>
          </div>
        )}

        {/* Fallback data until API is connected */}
        {(!announcements || announcements.length === 0) && !isLoading && !error && (
          <div className="space-y-0">
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-red-500"></span>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">Exam Schedule Announced</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Final exams for all departments will start from 15th November 2023. Detailed schedule available in Results section.
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">2 hours ago • Admin</p>
                </div>
              </div>
            </div>
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-500"></span>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">Faculty Meeting</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    All faculty members are requested to attend a meeting on 10th November at 3:00 PM in the conference room.
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">1 day ago • Admin</p>
                </div>
              </div>
            </div>
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-emerald-500"></span>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">Fee Submission Deadline</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Last date for fee submission is 5th November. Late fee will be charged after the deadline.
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">2 days ago • Accountant</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-amber-500"></span>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">Sports Day</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Annual sports day will be held on 20th November. All students are encouraged to participate.
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">3 days ago • Faculty</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
