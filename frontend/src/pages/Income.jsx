import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Plus, Search, Filter, Edit2, Trash2, ArrowUpRight } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Badge from "../components/common/Badge";
import { getIncomes, createIncome, updateIncome, deleteIncome } from "../services/transactions";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const CATEGORIES = ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"];

function Income() {
  const { formatCurrency } = useAuth();
  const toast = useToast();

  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [ordering, setOrdering] = useState("-date");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

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

  const fetchIncomes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      if (ordering) params.ordering = ordering;

      const data = await getIncomes(params);
      setIncomes(data);
    } catch (err) {
      console.error("Failed to load incomes:", err);
      setError("Unable to load income records.");
    } finally {
      setLoading(false);
    }
  }, [search, category, ordering]);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const openAddModal = () => {
    setEditingIncome(null);
    reset({
      source: "",
      category: "Salary",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingIncome(item);
    setValue("source", item.source);
    setValue("category", item.category);
    setValue("amount", item.amount);
    setValue("date", item.date);
    setValue("description", item.description || "");
    setIsModalOpen(true);
  };

  const onSubmitForm = async (formData) => {
    try {
      if (editingIncome) {
        await updateIncome(editingIncome.id, formData);
        toast.success("Income record updated successfully");
      } else {
        await createIncome(formData);
        toast.success("New income added successfully");
      }
      setIsModalOpen(false);
      fetchIncomes();
    } catch (err) {
      const msg =
        err.response?.data?.amount?.[0] ||
        err.response?.data?.detail ||
        "Failed to save income record.";
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteIncome(deleteId);
      toast.success("Income record deleted successfully");
      setDeleteId(null);
      fetchIncomes();
    } catch {
      toast.error("Failed to delete income record.");
    } finally {
      setDeleting(false);
    }
  };

  const totalFilteredIncome = incomes.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );

  return (
    <DashboardLayout>
      <PageHeader
        title="Income Tracker"
        subtitle="Manage deposits, salaries, and recurring inflows"
        action={
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-sm"
          >
            <Plus size={18} />
            <span>Add Income</span>
          </button>
        }
      />

      {/* Control bar: search, category filter, sorting */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-4 mb-6 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search income source or description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-[#C2A878] focus:border-transparent transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-stone-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="py-2 px-3 rounded-xl border border-stone-200 text-sm bg-white outline-none focus:ring-2 focus:ring-[#C2A878]"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="py-2 px-3 rounded-xl border border-stone-200 text-sm bg-white outline-none focus:ring-2 focus:ring-[#C2A878]"
          >
            <option value="-date">Newest Date</option>
            <option value="date">Oldest Date</option>
            <option value="-amount">Highest Amount</option>
            <option value="amount">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Total Filtered Header */}
      {!loading && incomes.length > 0 && (
        <div className="mb-4 flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider px-1">
          <span>{incomes.length} Entries Found</span>
          <span>Total: <strong className="text-emerald-700 text-sm">{formatCurrency(totalFilteredIncome)}</strong></span>
        </div>
      )}

      {/* Content State */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-stone-200/80 p-8 shadow-2xs space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-stone-100/70 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white p-8 rounded-2xl border border-rose-200 text-center">
          <p className="text-rose-600 mb-4">{error}</p>
          <button
            onClick={fetchIncomes}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-sm"
          >
            Retry
          </button>
        </div>
      ) : incomes.length === 0 ? (
        <EmptyState
          icon={ArrowUpRight}
          title="No income records found"
          description={
            search || category
              ? "No income records matched your current filters. Try clearing filters or search terms."
              : "Track your paychecks, client payments, and investments by adding your first income entry."
          }
          actionLabel={search || category ? "Clear Filters" : "Add Income"}
          onAction={
            search || category
              ? () => {
                  setSearch("");
                  setCategory("");
                }
              : openAddModal
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF7F0] border-b border-stone-200 text-xs uppercase font-bold text-stone-600 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {incomes.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-stone-900">{item.source}</div>
                      {item.description && (
                        <div className="text-xs text-stone-400 mt-0.5 line-clamp-1">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">{item.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-stone-500 font-medium whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600 whitespace-nowrap">
                      +{formatCurrency(item.amount)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Income Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIncome ? "Edit Income Entry" : "Record Income Inflow"}
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Source / Payer
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Corp, Client Project"
              {...register("source", { required: "Source is required" })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-[#C2A878]"
            />
            {errors.source && (
              <p className="text-xs text-rose-600 mt-1">{errors.source.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-white outline-none focus:ring-2 focus:ring-[#C2A878]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 0.01, message: "Must be greater than 0" },
                })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-[#C2A878]"
              />
              {errors.amount && (
                <p className="text-xs text-rose-600 mt-1">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Date
            </label>
            <input
              type="date"
              {...register("date", { required: "Date is required" })}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-[#C2A878]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Notes or references..."
              {...register("description")}
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
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : editingIncome ? "Update Income" : "Add Income"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Income Record?"
        message="Are you sure you want to delete this income entry? This will update your total balance and monthly summaries."
        isLoading={deleting}
      />
    </DashboardLayout>
  );
}

export default Income;