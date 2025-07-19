import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ActivityLog = () => {
  const activities = [
    { id: 1, action: "Organization Verified", user: "Admin", time: "2 hours ago" },
    { id: 2, action: "New Report Submitted", user: "Member", time: "4 hours ago" },
    { id: 3, action: "Workflow Updated", user: "Admin", time: "5 hours ago" }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Activity Log</h2>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>System activity history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full p-2 bg-neutral-100">
                    <span className="material-icons text-neutral-600">info</span>
                  </div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">By {activity.user}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};