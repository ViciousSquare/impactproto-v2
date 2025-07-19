import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const InvitationManager = () => {
  // Placeholder data - would be fetched from API in real implementation
  const invitations = [
    { id: 1, organization: "Health Initiative", email: "contact@healthinitiative.org", status: "pending" },
    { id: 2, organization: "Green Energy Co-op", email: "admin@greenenergy.org", status: "sent" },
    { id: 3, organization: "Youth Education Alliance", email: "info@yealliance.org", status: "expired" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invitation Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="mb-6 btn-gradient btn-gradient-primary">
            Send New Invitation
          </Button>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>{invite.organization}</TableCell>
                  <TableCell>{invite.email}</TableCell>
                  <TableCell>
                    <Badge variant={
                      invite.status === "pending" ? "warning" :
                      invite.status === "sent" ? "success" : "destructive"
                    }>
                      {invite.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Resend</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};