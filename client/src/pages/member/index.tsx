import { useState } from "react";
import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

// Member dashboard components - using placeholder while developing
import {
  OrganizationProfile,
  ReportManager,
  Recommendations,
  Notifications,
  Rankings,
  Resources
} from "./components/placeholder";

const MemberDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();

  // Placeholder organization ID - in a real app this would come from auth context
  const organizationId = 1;

  // Get organization data
  const { data: organization, isLoading: orgLoading } = useQuery({
    queryKey: ['/api/organizations', organizationId],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-heading gradient-heading-secondary">
              Member Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your organization's profile and impact data
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/">
                <span className="material-icons text-sm mr-1">home</span>
                View Site
              </Link>
            </Button>
            <Button className="btn-gradient btn-gradient-primary">
              <span className="material-icons text-sm mr-1">help_outline</span>
              Help
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Organization</CardTitle>
              {!orgLoading && organization && (
                <div className="flex flex-col">
                  <span className="font-semibold">{organization.name}</span>
                  <span className="text-sm text-muted-foreground">{organization.sector}</span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <Tabs orientation="vertical" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex flex-col items-start w-full">
                  <TabsTrigger value="profile" className="w-full justify-start">
                    <span className="material-icons text-sm mr-2">account_circle</span>
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="reports" className="w-full justify-start">
                    <span className="material-icons text-sm mr-2">description</span>
                    Reports
                  </TabsTrigger>
                  <TabsTrigger value="rankings" className="w-full justify-start">
                    <span className="material-icons text-sm mr-2">leaderboard</span>
                    Rankings
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className="w-full justify-start">
                    <span className="material-icons text-sm mr-2">trending_up</span>
                    Recommendations
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="w-full justify-start">
                    <span className="material-icons text-sm mr-2">menu_book</span>
                    Resources
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="w-full justify-start">
                    <span className="material-icons text-sm mr-2">notifications</span>
                    Notifications
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              {!orgLoading && organization ? (
                <div className="flex items-center">
                  <span className="material-icons text-amber-500 mr-2">
                    {organization.verificationType === 'verified' || organization.verificationType === 'audited' 
                      ? 'verified' 
                      : 'pending'}
                  </span>
                  <span className="capitalize">{organization.verificationType || 'Self-reported'}</span>
                </div>
              ) : (
                <div className="animate-pulse h-6 bg-gray-200 rounded"></div>
              )}
              
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  Request Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="profile" className="m-0">
              <OrganizationProfile organization={organization} isLoading={orgLoading} />
            </TabsContent>
            
            <TabsContent value="reports" className="m-0">
              <ReportManager organizationId={organizationId} />
            </TabsContent>
          </Tabs>
          
          <TabsContent value="rankings" className="m-0">
            <Rankings organizationId={organizationId} />
          </TabsContent>
          
          <TabsContent value="recommendations" className="m-0">
            <Recommendations organizationId={organizationId} />
          </TabsContent>
          
          <TabsContent value="resources" className="m-0">
            <Resources organizationId={organizationId} />
          </TabsContent>
          
          <TabsContent value="notifications" className="m-0">
            <Notifications />
          </TabsContent>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;