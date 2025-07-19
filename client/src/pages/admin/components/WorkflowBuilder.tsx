import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const WorkflowBuilder = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<string[]>([""]);

  const { data: workflows, isLoading } = useQuery({
    queryKey: ["/api/workflows"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const createWorkflowMutation = useMutation({
    mutationFn: async (workflow: any) => {
      return apiRequest("/api/workflows", {
        method: "POST",
        body: JSON.stringify(workflow),
      });
    },
    onSuccess: () => {
      toast({
        title: "Workflow created",
        description: "The workflow has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
      setName("");
      setDescription("");
      setSteps([""]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create workflow. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addStep = () => setSteps([...steps, ""]);
  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };
  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const workflow = {
      name,
      description,
      steps: steps.filter((step) => step.trim() !== ""),
    };
    createWorkflowMutation.mutate(workflow);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Workflow Builder</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Workflow</CardTitle>
            <CardDescription>Define automated process workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workflow Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter workflow name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter workflow description"
                />
              </div>

              <div className="space-y-4">
                <Label>Steps</Label>
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      placeholder={`Step ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeStep(index)}
                    >
                      <span className="material-icons">remove</span>
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addStep}
                  className="w-full"
                >
                  <span className="material-icons mr-2">add</span>
                  Add Step
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full btn-gradient btn-gradient-primary"
                disabled={createWorkflowMutation.isPending}
              >
                {createWorkflowMutation.isPending ? "Creating..." : "Create Workflow"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Workflows</CardTitle>
            <CardDescription>Currently configured workflows</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {workflows?.items.map((workflow: any) => (
                  <div
                    key={workflow.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{workflow.name}</h3>
                      <Badge variant={workflow.isActive ? "default" : "secondary"}>
                        {workflow.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {workflow.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};