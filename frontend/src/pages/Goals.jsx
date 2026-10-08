import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Target,
  Edit2,
  Trash2,
  Trophy,
  Calendar,
  AlertCircle,
  Coins,
  ArrowUpCircle,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import { getGoals, createGoal, updateGoal, deleteGoal } from "../services/goals";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Goals() {
  const { formatCurrency } = useAuth();
  const toast = useToast();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Quick deposit modal state
  const [depositGoal, setDepositGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositing, setDepositing] = useState(false);

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

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (err) {
      console.error("Failed to load goals:", err);
      setError("Unable to load savings goals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const openAddModal = () => {
    setEditingGoal(null);
    reset({
      title: "",
      target_amount: "",
      saved_amount: "0.00",
      target_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingGoal(item);
    setValue("title", item.title);
    setValue("target_amount", item.target_amount);
    setValue("saved_amount", item.saved_amount);
    setValue("target_date", item.target_date);
    setIsModalOpen(true);
  };

  const onSubmitForm = async (formData) => {
    try {
      if (editingGoal) {
        await updateGoal(editingGoal.id, formData);
        toast.success("Savings goal updated successfully");
      } else {
        await createGoal(formData);
        toast.success("New savings goal established!");
      }
      setIsModalOpen(false);
      fetchGoals();
    } catch (err) {
      const msg =
        err.response?.data?.target_amount?.[0] ||
        err.response?.data?.saved_amount?.[0] ||
        err.response?.data?.detail ||
        "Failed to save goal.";
      toast.error(msg);
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!depositGoal || !depositAmount || Number(depositAmount) <= 0) return;

    setDepositing(true);
    try {
      const newTotal = (Number(depositGoal.saved_amount) + Number(depositAmount)).toFixed(2);
      await updateGoal(depositGoal.id, { saved_amount: newTotal });
      toast.success(`Deposited ${formatCurrency(depositAmount)} into ${depositGoal.title}!`);
      setDepositGoal(null);
      setDepositAmount("");
      fetchGoals();
    } catch {
      toast.error("Failed to update goal deposit.");
    } finally {
      setDepositing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteGoal(deleteId);
      toast.success("Goal deleted successfully");
      setDeleteId(null);
      fetchGoals();
    } catch {
      toast.error("Failed to delete goal.");
    } finally {
      setDeleting(false);
    }
  };

  const totalTarget = goals.reduce((sum, g) => sum + (Number(g.target_amount) || 0), 0);
  const totalSaved = goals.reduce((sum, g) => sum + (Number(g.saved_amount) || 0), 0);
  const totalCompleted = goals.filter((g) => g.status === "completed").length;

  return (
    <DashboardLayout>
      <PageHeader
        title="Savings Goals & Piggy Bank"
        subtitle="Turn dreams into reality with targeted digital wealth jars"
        action={
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C2A878] hover:bg-[#b09665] text-stone-900 font-bold text-sm transition shadow-sm"
          >
            <Plus size={18} />
            <span>Create New Goal</span>
          </button>
        }
      />

      {/* Aggregate Overview */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Target
          </p>
          <h3 className="text-2xl font-extrabold text-stone-900 mt-1">
            {formatCurrency(totalTarget)}
          </h3>
          <p className="text-xs text-stone-400 mt-1">{goals.length} Active Targets</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Saved
          </p>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
            {formatCurrency(totalSaved)}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}% of combined goals
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Completed Goals
          </p>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
            {totalCompleted} / {goals.length}
          </h3>
          <p className="text-xs text-stone-400 mt-1">Milestones Reached</p>
        </div>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-white rounded-2xl border border-stone-200/80 p-6 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white p-8 rounded-2xl border border-rose-200 text-center">
          <p className="text-rose-600 mb-4">{error}</p>
          <button
            onClick={fetchGoals}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-sm"
          >
            Retry
          </button>
        </div>
      ) : goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No savings goals created yet"
          description="Create your first goal like an Emergency Fund, Travel, Gadget, or Retirement pot to start tracking."
          actionLabel="Create Savings Goal"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((g) => {
            const percent = Math.min(Number(g.percentage_completed) || 0, 100);
            const isCompleted = g.status === "completed" || percent >= 100;
            const isOverdue = g.status === "overdue" && !isCompleted;

            return (
              <div
                key={g.id}
                className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? "bg-amber-100 text-amber-700"
                            : "bg-[#FAF7F0] text-[#A68A56]"
                        }`}
                      >
                        {isCompleted ? <Trophy size={20} /> : <Coins size={20} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 text-base leading-tight">
                          {g.title}
                        </h3>
                        <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                          <Calendar size={12} />
                          Target: {g.target_date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(g)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition"
                        title="Edit Goal"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteId(g.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-50 transition"
                        title="Delete Goal"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Status Banner */}
                  {isCompleted ? (
                    <div className="mb-4 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                      <Trophy size={14} className="text-emerald-600" />
                      <span>Goal Accomplished! Congratulations!</span>
                    </div>
                  ) : isOverdue ? (
                    <div className="mb-4 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-1.5">
                      <AlertCircle size={14} className="text-amber-600" />
                      <span>Target date passed</span>
                    </div>
                  ) : null}

                  {/* Amounts */}
                  <div className="flex justify-between items-baseline mb-2">
                    <div>
                      <p className="text-xs text-stone-400">Saved</p>
                      <p className="text-xl font-extrabold text-stone-900">
                        {formatCurrency(g.saved_amount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-stone-400">Target</p>
                      <p className="text-base font-bold text-stone-600">
                        {formatCurrency(g.target_amount)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? "bg-emerald-500" : "bg-[#C2A878]"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-stone-500 mb-4">
                    <span className="font-semibold">{percent}% complete</span>
                    <span>
                      {isCompleted ? "Goal achieved" : `${formatCurrency(g.remaining_amount)} to go`}
                    </span>
                  </div>
                </div>

                {/* Quick Add Funds Button */}
                <div className="pt-3 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setDepositGoal(g);
                      setDepositAmount("");
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-stone-50 hover:bg-[#FAF7F0] border border-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <ArrowUpCircle size={15} className="text-[#8C734B]" />
                    <span>Deposit into Goal</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGoal ? "Edit Savings Goal" : "Create New Savings Goal"}
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Goal Title
            </label>
            <input
              type="text"
              placeholder="e.g. Vacation, Emergency Fund, Laptop"
              {...register("title", { required: "Goal title is required" })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-[#C2A878]"
            />
            {errors.title && (
              <p className="text-xs text-rose-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Target Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g. 50000"
                {...register("target_amount", {
                  required: "Target amount is required",
                  min: { value: 0.01, message: "Must be greater than 0" },
                })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-[#C2A878]"
              />
              {errors.target_amount && (
                <p className="text-xs text-rose-600 mt-1">{errors.target_amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Already Saved Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register("saved_amount", { min: 0 })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-[#C2A878]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Target Completion Date
            </label>
            <input
              type="date"
              {...register("target_date", { required: "Target date is required" })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-[#C2A878]"
            />
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
              {isSubmitting ? "Saving..." : editingGoal ? "Update Goal" : "Create Goal"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Quick Deposit Modal */}
      <Modal
        isOpen={!!depositGoal}
        onClose={() => setDepositGoal(null)}
        title={`Deposit into ${depositGoal?.title || "Goal"}`}
      >
        <form onSubmit={handleDepositSubmit} className="space-y-4">
          <p className="text-sm text-stone-500">
            Currently saved: <strong>{depositGoal && formatCurrency(depositGoal.saved_amount)}</strong> of{" "}
            <strong>{depositGoal && formatCurrency(depositGoal.target_amount)}</strong>
          </p>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Deposit Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              autoFocus
              placeholder="e.g. 1000"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-[#C2A878]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setDepositGoal(null)}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={depositing || !depositAmount}
              className="px-5 py-2.5 rounded-xl bg-[#C2A878] hover:bg-[#b09665] text-stone-900 text-sm font-bold transition disabled:opacity-60"
            >
              {depositing ? "Adding Deposit..." : "Add to Savings"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Savings Goal?"
        message="Are you sure you want to delete this savings goal? Stored progress will be removed."
        isLoading={deleting}
      />
    </DashboardLayout>
  );
}

export default Goals;