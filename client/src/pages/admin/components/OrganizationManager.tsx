import { useState } from "react";
import { AddOrganizationDialog } from "./AddOrganizationDialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Link } from 'wouter'; // Added for linking to organization profiles

const SECTOR_OPTIONS = [
  { value: "Food Security", label: "Food Security" },
  { value: "Housing", label: "Housing" },
  { value: "Education", label: "Education" },
  { value: "Environment", label: "Environment" }
];

const REGION_OPTIONS = [
  { value: "North America", label: "North America" },
  { value: "Europe", label: "Europe" },
  { value: "Asia", label: "Asia" },
  { value: "Africa", label: "Africa" }
];

const SIZE_OPTIONS = [
  { value: "all", label: "All Sizes" },
  { value: "small (1-10)", label: "Small (1-10)" },
  { value: "medium (11-50)", label: "Medium (11-50)" },
  { value: "large (51-200)", label: "Large (51-200)" },
];


export const OrganizationManager = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedVerificationType, setSelectedVerificationType] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all"); // Added size filter
  const [page, setPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

  const { data: organizationsData, isLoading, refetch } = useQuery({
    queryKey: ['/api/organizations'],
    queryFn: getQueryFn('/api/organizations'),
    refetchInterval: 3000, // Refresh every 3 seconds
    staleTime: 0, // Consider data immediately stale
    cacheTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2 // Retry failed requests twice
  });

  const addOrganizationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create organization');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/organizations'] });
      toast({
        title: "Success",
        description: "Organization has been successfully added",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error: Error) => {
      console.error('Failed to create organization:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleDeleteOrganization = (id: number) => {
    setSelectedOrgId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteOrganization = () => {
    if (selectedOrgId) {
      toast({
        title: "Organization deleted",
        description: "The organization has been successfully deleted.",
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const filteredOrganizations = (organizationsData?.organizations || []).filter(org => {
    return (selectedSector === 'all' || org.sector === selectedSector) &&
           (selectedRegion === 'all' || org.region === selectedRegion) &&
           (selectedVerificationType === 'all' || org.verificationType === selectedVerificationType) &&
           (selectedSize === 'all' || org.size === selectedSize);
  });


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Organization Management</h2>
        <Button className="btn-gradient btn-gradient-primary" onClick={() => setIsAddDialogOpen(true)}>
          <span className="material-icons text-sm mr-1">add</span>
          Add Organization
        </Button>

        <AddOrganizationDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={addOrganizationMutation.mutate}
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Organizations</CardTitle>
          <CardDescription>
            Manage all organizations in the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={selectedSector}
                onValueChange={setSelectedSector}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {SECTOR_OPTIONS.map((sector) => (
                    <SelectItem key={sector.value} value={sector.value}>
                      {sector.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedRegion}
                onValueChange={setSelectedRegion}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {REGION_OPTIONS.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedVerificationType}
                onValueChange={setSelectedVerificationType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Verification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="self-reported">Self-Reported</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="audited">Audited</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSize} onValueChange={setSelectedSize}> {/* Added Size filter */}
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  {SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Impact Score</TableHead>
                  <TableHead>Size</TableHead> {/* Added Size column */}
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <>
                    <TableRow>
                      <TableCell colSpan={8}><Skeleton /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={8}><Skeleton /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={8}><Skeleton /></TableCell>
                    </TableRow>
                  </>
                ) : filteredOrganizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>{org.sector}</TableCell>
                    <TableCell>{org.region}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          org.verificationType === "audited"
                            ? "default"
                            : org.verificationType === "verified"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {org.verificationType}
                      </Badge>
                    </TableCell>
                    <TableCell>{org.impactScore}</TableCell>
                    <TableCell>{org.size}</TableCell> {/* Added Size cell */}
                    <TableCell>
                      {org.isPublished ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-amber-500">⊘</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <span className="material-icons">more_vert</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/organization/${org.id}`}>
                              <span className="material-icons text-sm mr-2">visibility</span>
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span className="material-icons text-sm mr-2">edit</span>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteOrganization(org.id)}
                            className="text-red-600"
                          >
                            <span className="material-icons text-sm mr-2">delete</span>
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem> {/* Added Member Preview */}
                            <Link href={`/member/preview/${org.id}`}>
                              <span className="material-icons text-sm mr-2">preview</span>
                              Member Preview
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Organization</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this organization? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteOrganization}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};