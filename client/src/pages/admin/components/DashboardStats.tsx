
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatsProps {
  stats: any;
  isLoading: boolean;
}

export const DashboardStats = ({ stats, isLoading }: DashboardStatsProps) => {
  const formatImpactValue = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Organizations</CardTitle>
            <CardDescription>Total registered orgs</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-24" />
            ) : (
              <div className="text-3xl font-bold">
                {stats?.organizationCount || 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Programs</CardTitle>
            <CardDescription>Active programs</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-24" />
            ) : (
              <div className="text-3xl font-bold">
                {stats?.programCount || 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Verified Users</CardTitle>
            <CardDescription>Verified organization users</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-24" />
            ) : (
              <div className="text-3xl font-bold">
                {stats?.verifiedUserCount || 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-white border-teal-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-teal-700">Impact Value</CardTitle>
            <CardDescription>Total measured impact</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-24" />
            ) : (
              <div className="text-3xl font-bold text-teal-700">
                {stats?.impactValue ? formatImpactValue(stats.impactValue) : '$0'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mt-8">Admin Tasks</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Invitations</CardTitle>
            <CardDescription>Invitations awaiting response</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              {isLoading ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats?.pendingInvites || 0}</div>
              )}
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Manage
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Verification Requests</CardTitle>
            <CardDescription>Pending verifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              {isLoading ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats?.pendingVerifications || 0}</div>
              )}
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Review
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Reported Issues</CardTitle>
            <CardDescription>Open reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              {isLoading ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats?.openReports || 0}</div>
              )}
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Urgent
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
