import Modal from "./Modal";
import Button from "./Button";
import { AlertTriangle } from "lucide-react";

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl flex-shrink-0">
          <AlertTriangle size={24} />
        </div>
        <p className="text-stone-600 text-sm leading-relaxed mt-1">{message}</p>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="px-6 py-3 rounded-xl font-medium bg-rose-600 hover:bg-rose-700 text-white transition disabled:opacity-50"
        >
          {isLoading ? "Deleting..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
