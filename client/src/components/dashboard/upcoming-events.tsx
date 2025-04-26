import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// This would be the actual type from the API
type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  type: "meeting" | "exam" | "sports" | "results";
};

export default function UpcomingEvents() {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events/upcoming"],
  });

  // Function to determine the color class based on event type
  const getEventColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400";
      case "exam":
        return "bg-amber-50 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400";
      case "sports":
        return "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400";
      case "results":
        return "bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400";
      default:
        return "bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400";
    }
  };

  // Function to format date for display
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const month = format(date, "MMM").toUpperCase();
      const day = format(date, "d");
      return { month, day };
    } catch (error) {
      return { month: "N/A", day: "N/A" };
    }
  };

  // Sample data for display until API is connected
  const sampleEvents = [
    {
      id: 1,
      title: "Faculty Meeting",
      description: "Meeting to discuss curriculum updates",
      date: "2023-11-10T15:00:00.000Z",
      location: "Conference Room",
      type: "meeting"
    },
    {
      id: 2,
      title: "Final Exams Begin",
      description: "Final examinations for all departments",
      date: "2023-11-15T08:00:00.000Z",
      location: "All Departments",
      type: "exam"
    },
    {
      id: 3,
      title: "Annual Sports Day",
      description: "Annual sports competition",
      date: "2023-11-20T09:00:00.000Z",
      location: "Sports Ground",
      type: "sports"
    },
    {
      id: 4,
      title: "Results Announcement",
      description: "Announcement of examination results",
      date: "2023-11-30T14:00:00.000Z",
      location: "Online Portal",
      type: "results"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Upcoming Events</CardTitle>
          <Button variant="link" size="sm">
            View Calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-4 text-center">
              <div className="spinner h-6 w-6 mx-auto mb-2 animate-spin text-primary"></div>
              <p className="text-sm text-muted-foreground">Loading events...</p>
            </div>
          ) : events && events.length > 0 ? (
            events.map(event => {
              const { month, day } = formatEventDate(event.date);
              return (
                <div key={event.id} className="flex items-start">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center ${getEventColor(event.type)}`}>
                    <span className="text-xs font-semibold">{month}</span>
                    <span className="text-lg font-bold">{day}</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">{event.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {format(new Date(event.date), "h:mm a")} - {event.location}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            // Fallback to sample data if API doesn't return results yet
            sampleEvents.map(event => {
              const { month, day } = formatEventDate(event.date);
              return (
                <div key={event.id} className="flex items-start">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center ${getEventColor(event.type)}`}>
                    <span className="text-xs font-semibold">{month}</span>
                    <span className="text-lg font-bold">{day}</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">{event.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {format(new Date(event.date), "h:mm a")} - {event.location}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          {/* Show no events message if there are no events and API has loaded */}
          {!isLoading && (!events || events.length === 0) && !sampleEvents.length && (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">No upcoming events</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
