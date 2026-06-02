"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { PageTransition } from "@/components/shared/page-transition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Plus,
  Shield,
  Plane,
  Laptop,
  Car,
  Heart,
  Calendar,
  IndianRupee,
  Target,
} from "lucide-react";
import { useGoalStore } from "@/store/goal-store";
import type { Goal } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Shield,
  Plane,
  Laptop,
  Car,
  Heart,
};

export default function GoalsPage() {
  const { goals, isLoading, fetchGoals, addGoal, updateGoal } = useGoalStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [addAmount, setAddAmount] = useState<{ id: string; amount: string } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
    category: "",
  });

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleSubmit = () => {
    if (!formData.title || !formData.targetAmount || !formData.deadline) return;
    const target = parseFloat(formData.targetAmount);
    const deadlineDate = new Date(formData.deadline);
    const now = new Date();
    const monthsLeft = Math.max(
      1,
      (deadlineDate.getFullYear() - now.getFullYear()) * 12 +
        (deadlineDate.getMonth() - now.getMonth())
    );

    addGoal({
      title: formData.title,
      targetAmount: target,
      currentAmount: 0,
      deadline: formData.deadline,
      category: formData.category || "General",
      icon: "Target",
      color: "#2563EB",
      monthlyTarget: Math.ceil(target / monthsLeft),
    });
    setIsFormOpen(false);
    setFormData({ title: "", targetAmount: "", deadline: "", category: "" });
  };

  const handleAddProgress = () => {
    if (!addAmount) return;
    const goal = goals.find((g) => g.id === addAmount.id);
    if (!goal) return;
    const newAmount = Math.min(
      goal.currentAmount + parseFloat(addAmount.amount || "0"),
      goal.targetAmount
    );
    updateGoal(addAmount.id, { currentAmount: newAmount });
    setAddAmount(null);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Goal Planner"
          description="Set financial goals and track your progress."
        >
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Goal
          </Button>
        </PageHeader>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">Loading goals...</div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal, i) => {
            const Icon = iconMap[goal.icon] || Target;
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const remaining = goal.targetAmount - goal.currentAmount;
            const deadline = new Date(goal.deadline);

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="group relative overflow-hidden p-6 transition-all duration-300 hover:shadow-md">
                  {/* Decorative top bar */}
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ backgroundColor: goal.color }}
                  />

                  <div className="flex items-start justify-between">
                    <div
                      className="rounded-xl p-2.5"
                      style={{
                        backgroundColor: `${goal.color}15`,
                      }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: goal.color }}
                      />
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {goal.category}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold">{goal.title}</h3>

                  <div className="mt-4">
                    <div className="flex items-end justify-between text-sm">
                      <span className="font-bold">
                        ₹{goal.currentAmount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-muted-foreground">
                        ₹{goal.targetAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <Progress value={progress} className="mt-2 h-2" />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {progress.toFixed(1)}% complete
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Remaining
                        </p>
                        <p className="text-xs font-semibold">
                          ₹{remaining.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Deadline
                        </p>
                        <p className="text-xs font-semibold">
                          {deadline.toLocaleDateString("en-IN", {
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-background p-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Monthly target
                      </p>
                      <p className="text-sm font-bold">
                        ₹{goal.monthlyTarget.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setAddAmount({ id: goal.id, amount: "" })
                      }
                    >
                      Add Progress
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
          </>
        )}

        {/* Add Goal Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Set a financial goal to start tracking your progress.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Goal Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Emergency Fund"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Target Amount (₹)</Label>
                  <Input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetAmount: e.target.value,
                      })
                    }
                    placeholder="300000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Deadline</Label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Safety Net, Travel"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Create Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Progress Dialog */}
        <Dialog
          open={addAmount !== null}
          onOpenChange={(open) => !open && setAddAmount(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Progress</DialogTitle>
              <DialogDescription>
                Enter the amount you&apos;d like to add to this goal.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                className="mt-2"
                value={addAmount?.amount || ""}
                onChange={(e) =>
                  setAddAmount(
                    addAmount ? { ...addAmount, amount: e.target.value } : null
                  )
                }
                placeholder="5000"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddAmount(null)}>
                Cancel
              </Button>
              <Button onClick={handleAddProgress}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
