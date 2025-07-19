import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SECTOR_OPTIONS, REGION_OPTIONS } from "@/lib/types";

interface OrganizationProfileProps {
  organization: any; // This would be typed properly in a real app
  isLoading: boolean;
}

const OrganizationProfile = ({ organization, isLoading }: OrganizationProfileProps) => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const updateOrgMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/organizations/${organization?.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your organization profile has been successfully updated.",
      });
      setEditMode(false);
      queryClient.invalidateQueries({ queryKey: ['/api/organizations', organization?.id] });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update organization profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEditClick = () => {
    setFormData({
      name: organization?.name || "",
      sector: organization?.sector || "",
      region: organization?.region || "",
      mission: organization?.mission || "",
      established: organization?.established || "",
      website: organization?.website || "",
      contactInfo: organization?.contactInfo || "",
      contactEmail: organization?.contactEmail || "",
    });
    setEditMode(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    updateOrgMutation.mutate(formData);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? "Edit Organization Profile" : "Organization Profile"}</CardTitle>
        <CardDescription>
          {editMode 
            ? "Update your organization's information and impact story" 
            : "View and edit your organization's public profile"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {editMode ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="sector">Sector</Label>
                  <Select
                    value={formData.sector}
                    onValueChange={(value) => handleSelectChange("sector", value)}
                  >
                    <SelectTrigger id="sector">
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTOR_OPTIONS.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Select
                    value={formData.region}
                    onValueChange={(value) => handleSelectChange("region", value)}
                  >
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {REGION_OPTIONS.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="established">Year Established</Label>
                  <Input
                    id="established"
                    name="established"
                    type="number"
                    value={formData.established}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.example.org"
                  />
                </div>
                <div>
                  <Label htmlFor="contactInfo">Contact Information</Label>
                  <Input
                    id="contactInfo"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    placeholder="Phone, address, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="contact@example.org"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="mission">Mission Statement</Label>
              <Textarea
                id="mission"
                name="mission"
                value={formData.mission}
                onChange={handleChange}
                placeholder="Describe your organization's mission and purpose..."
                rows={4}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Organization Name</Label>
                  <div className="text-base mt-1 font-medium">{organization?.name || "N/A"}</div>
                </div>
                <div>
                  <Label>Sector</Label>
                  <div className="text-base mt-1">{organization?.sector || "N/A"}</div>
                </div>
                <div>
                  <Label>Region</Label>
                  <div className="text-base mt-1">{organization?.region || "N/A"}</div>
                </div>
                <div>
                  <Label>Year Established</Label>
                  <div className="text-base mt-1">{organization?.established || "N/A"}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Website</Label>
                  <div className="text-base mt-1">
                    {organization?.website ? (
                      <a 
                        href={organization.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-amber-600 hover:text-amber-700 hover:underline"
                      >
                        {organization.website}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
                <div>
                  <Label>Contact Information</Label>
                  <div className="text-base mt-1">{organization?.contactInfo || "N/A"}</div>
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <div className="text-base mt-1">
                    {organization?.contactEmail ? (
                      <a 
                        href={`mailto:${organization.contactEmail}`}
                        className="text-amber-600 hover:text-amber-700 hover:underline"
                      >
                        {organization.contactEmail}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label>Mission Statement</Label>
              <div className="text-base mt-1 bg-amber-50 p-4 rounded-md border border-amber-100">
                {organization?.mission || "No mission statement provided."}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {editMode ? (
          <>
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateOrgMutation.isPending}
              className="btn-gradient btn-gradient-primary"
            >
              {updateOrgMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </>
        ) : (
          <Button
            onClick={handleEditClick}
            className="btn-gradient btn-gradient-primary"
          >
            <span className="material-icons text-sm mr-1">edit</span>
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OrganizationProfile;