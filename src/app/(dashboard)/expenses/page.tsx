"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { PageTransition } from "@/components/shared/page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useExpenseStore } from "@/store/expense-store";
import { EXPENSE_CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";
import type { Expense, ExpenseCategory } from "@/types";
import { ReceiptScanner } from "@/components/dashboard/receipt-scanner";
import { SkeletonRow } from "@/components/ui/skeleton-loaders";

const ITEMS_PER_PAGE = 8;

export default function ExpensesPage() {
  const { expenses, loadingState, fetchExpenses, addExpense, updateExpense, deleteExpense } =
    useExpenseStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "" as ExpenseCategory | "",
    amount: "",
    date: "",
    notes: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const filtered = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.notes?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const groupedExpenses = paginated.reduce((acc, expense) => {
    const d = new Date(expense.date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    if (!acc[d]) acc[d] = [];
    acc[d].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  const openAdd = () => {
    setEditingExpense(null);
    setFormData({ title: "", category: "", amount: "", date: "", notes: "" });
    setIsFormOpen(true);
  };

  const openEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      category: expense.category,
      amount: expense.amount.toString(),
      date: expense.date,
      notes: expense.notes || "",
    });
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.category || !formData.amount || !formData.date)
      return;

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        title: formData.title,
        category: formData.category as ExpenseCategory,
        amount: parseFloat(formData.amount),
        date: formData.date,
        notes: formData.notes || undefined,
      });
    } else {
      addExpense({
        title: formData.title,
        category: formData.category as ExpenseCategory,
        amount: parseFloat(formData.amount),
        date: formData.date,
        notes: formData.notes || undefined,
      });
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteExpense(deleteTarget);
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleScanComplete = (data: { amount: string; merchant: string; date: string }) => {
    setFormData({
      ...formData,
      amount: data.amount,
      title: data.merchant,
      date: data.date,
      category: formData.category || "Other" as ExpenseCategory,
    });
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Expense Ledger" description="Manage and track all your expenses.">
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </PageHeader>

        {loadingState.status === "loading" ? (
          <div className="flex flex-col gap-3">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : (
          <>
            {/* Filters */}
            <Card className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search expenses..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={categoryFilter}
                    onValueChange={(v) => {
                      setCategoryFilter(v || "all");
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {[...EXPENSE_CATEGORIES].sort().map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Timeline View */}
            <div className="relative border-l-2 border-border/50 ml-4 pl-6 sm:ml-6 sm:pl-8 py-2 mt-6">
              {Object.entries(groupedExpenses).map(([dateStr, dayExpenses], index) => (
                <div key={dateStr} className="mb-10 relative">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 rounded-full bg-primary ring-4 ring-background shadow-sm" />
                  <h3 className="font-bold text-lg mb-4 text-foreground/90">{dateStr}</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {dayExpenses.map((expense) => (
                      <Card
                        key={expense.id}
                        className="p-4 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                        onClick={() => openEdit(expense)}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-foreground group-hover:text-primary transition-colors">{expense.title}</span>
                            <span className={`font-bold ${expense.amount > 0 ? "text-emerald-500" : "text-red-500"}`}>
                              ₹{expense.amount.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="secondary"
                              className="font-medium px-2 py-0.5 rounded-md border-0"
                              style={{
                                backgroundColor: `${CATEGORY_COLORS[expense.category]}15`,
                                color: CATEGORY_COLORS[expense.category],
                              }}
                            >
                              {expense.category}
                            </Badge>
                          </div>
                          {expense.notes && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {expense.notes}
                            </p>
                          )}
                        </div>
                        <div className="mt-4 flex gap-2 opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <Button variant="outline" size="sm" className="h-7 px-2" onClick={(e) => { e.stopPropagation(); openEdit(expense); }}>
                            <Pencil className="h-3 w-3 mr-1" /> Edit
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteTarget(expense.id); setIsDeleteOpen(true); }}>
                            <Trash2 className="h-3 w-3 mr-1" /> Delete
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
              {paginated.length === 0 && (
                <div className="py-10 text-center text-muted-foreground">
                  No expenses found for this month.
                </div>
              )}
            </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
                    {filtered.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i}
                        variant={page === i + 1 ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            {/* Add/Edit Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingExpense ? "Edit Expense" : "Add Expense"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingExpense
                      ? "Update the expense details below."
                      : "Fill in the details to add a new expense."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {!editingExpense && (
                    <div className="mb-2">
                      <ReceiptScanner onScanComplete={handleScanComplete} />
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g., Swiggy Order"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(v) =>
                          setFormData({ ...formData, category: v as ExpenseCategory })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...EXPENSE_CATEGORIES].sort().map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Add any notes..."
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingExpense ? "Save Changes" : "Add Expense"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Expense</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this expense? This action cannot
                    be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </PageTransition>
  );
}
