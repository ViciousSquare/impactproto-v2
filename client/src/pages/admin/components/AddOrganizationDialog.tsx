
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface AddOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddOrganizationDialog = ({ open, onOpenChange }: AddOrganizationDialogProps) => {
  const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Organization</DialogTitle>
          <DialogDescription>
            Please use the Data Input tool to add new organizations.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            onOpenChange(false);
            window.location.href = '/admin?tab=data-input';
          }}>
            Go to Data Input
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
