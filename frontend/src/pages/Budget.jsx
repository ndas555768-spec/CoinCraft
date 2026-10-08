import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  PiggyBank,
  Edit2,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import { getBudgets, createBudget, updateBudget, deleteBudget } from "../services/budgets";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Healthcare",
  "Entertainment",
  "Education",
  "Other",
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function Budget() {
  const { formatCurrency } = useAuth();
  const toast = useToast();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  // Delete dialog state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBudgets({ month: selectedMonth, year: selectedYear });
      setBudgets(data);
    } catch (err) {
      console.error("Failed to load budgets:", err);
      setError("Unable to load budget categories.");
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const openAddModal = () => {
    setEditingBudget(null);
    reset({
      category: "Food",
      amount: "",
      month: selectedMonth,
      year: selectedYear,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingBudget(item);
    setValue("category", item.category);
    setValue("amount", item.amount);
    setValue("month", item.month);
    setValue("year", item.year);
    setIsModalOpen(true);
  };

  const onSubmitForm = async (formData) => {
    try {
      if (editingBudget) {
        await updateBudget(editingBudget.id, formData);
        toast.success("Budget updated successfully");
      } else {
        await createBudget(formData);
        toast.success("Budget created successfully");
      }
      setIsModalOpen(false);
      fetchBudgets();
    } catch (err) {
      const msg =
        err.response?.data?.category?.[0] ||
        err.response?.data?.amount?.[0] ||
        err.response?.data?.detail ||
        "Failed to save budget.";
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteBudget(deleteId);
      toast.success("Budget removed successfully");
      setDeleteId(null);
      fetchBudgets();
    } catch {
      toast.error("Failed to delete budget.");
    } finally {
      setDeleting(false);
    }
  };

  // Aggregates for current month
  const totalBudgeted = budgets.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (Number(b.spent) || 0), 0);
  const totalRemaining = Math.max(totalBudgeted - totalSpent, 0);
  const overallPercentage = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  return (
    <DashboardLayout>
      <PageHeader
        title="Monthly Budgets"
        subtitle="Set spending limits by category and prevent overspending"
        action={
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition shadow-sm"
          >
            <Plus size={18} />
            <span>Create Budget</span>
          </button>
        }
      />

      {/* Month Navigator Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-4 mb-6 shadow-2xs flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-sm font-semibold transition"
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="text-center">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
          </h2>
          <p className="text-xs text-stone-400">Budget Period</p>
        </div>

        <button
          onClick={handleNextMonth}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-sm font-semibold transition"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Monthly Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Budget
          </p>
          <h3 className="text-2xl font-extrabold text-stone-900 mt-1">
            {formatCurrency(totalBudgeted)}
          </h3>
          <p className="text-xs text-stone-400 mt-1">{budgets.length} Category Caps</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Spent
          </p>
          <h3 className="text-2xl font-extrabold text-rose-600 mt-1">
            {formatCurrency(totalSpent)}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            {overallPercentage}% of monthly limit
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Remaining Room
          </p>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
            {formatCurrency(totalRemaining)}
          </h3>
          <p className="text-xs text-stone-400 mt-1">Available to spend safely</p>
        </div>
      </div>

      {/* Budget Items */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-white rounded-2xl border border-stone-200/80 p-6 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white p-8 rounded-2xl border border-rose-200 text-center">
          <p className="text-rose-600 mb-4">{error}</p>
          <button
            onClick={fetchBudgets}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-sm"
          >
            Retry
          </button>
        </div>
      ) : budgets.length === 0 ? (
        <EmptyState
          icon={PiggyBank}
          title={`No budgets set for ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`}
          description="Create budgets for your frequent expense categories to get real-time warnings and stay on track."
          actionLabel="Set Up a Budget"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {budgets.map((b) => {
            const percent = Math.min(Number(b.percentage_used) || 0, 100);
            const isExceeded = b.status === "exceeded";
            const isWarning = b.status === "warning";

            let barBg = "bg-emerald-500";
            let statusBadge = (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                On Track
              </span>
            );

            if (isExceeded) {
              barBg = "bg-rose-500";
              statusBadge = (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Budget Exceeded
                </span>
              );
            } else if (isWarning) {
              barBg = "bg-amber-500";
              statusBadge = (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                  <TrendingDown size={12} />
                  {b.percentage_used}% Used
                </span>
              );
            }

            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-stone-900">
                          {b.category}
                        </h3>
                        {statusBadge}
                      </div>
                      <p className="text-xs text-stone-400">
                        {MONTH_NAMES[b.month - 1]} {b.year}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition"
                        title="Edit Budget"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(b.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-50 transition"
                        title="Delete Budget"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Numbers */}
                  <div className="flex justify-between items-baseline mb-3">
                    <div>
                      <p className="text-xs text-stone-500 font-medium">Spent</p>
                      <p className="text-xl font-extrabold text-stone-900">
                        {formatCurrency(b.spent)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-stone-500 font-medium">Limit</p>
                      <p className="text-xl font-bold text-stone-700">
                        {formatCurrency(b.amount)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-stone-500 pt-3 border-t border-stone-100 mt-2">
                  <span>{b.percentage_used}% consumed</span>
                  <span className={isExceeded ? "text-rose-600 font-bold" : "text-emerald-700 font-semibold"}>
                    {isExceeded
                      ? `Over by ${formatCurrency(Number(b.spent) - Number(b.amount))}`
                      : `${formatCurrency(b.remaining)} remaining`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBudget ? "Edit Category Budget" : "Create Category Budget"}
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Expense Category
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-white outline-none focus:ring-2 focus:ring-[#C2A878]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Monthly Budget Limit
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="e.g. 15000"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 0.01, message: "Budget must be greater than 0" },
              })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-[#C2A878]"
            />
            {errors.amount && (
              <p className="text-xs text-rose-600 mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Month
              </label>
              <select
                {...register("month", { required: true, valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-white outline-none focus:ring-2 focus:ring-[#C2A878]"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Year
              </label>
              <input
                type="number"
                {...register("year", { required: true, valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-[#C2A878]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : editingBudget ? "Update Budget" : "Create Budget"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Remove Budget Limit?"
        message="Are you sure you want to remove this budget? Recorded expenses in this category will not be deleted."
        isLoading={deleting}
      />
    </DashboardLayout>
  );
}

export default Budget;