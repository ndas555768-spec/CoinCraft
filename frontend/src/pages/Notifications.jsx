import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  CheckCheck,
  Check,
  Trash2,
  AlertTriangle,
  AlertOctagon,
  Trophy,
  Target,
  Info,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import EmptyState from "../components/common/EmptyState";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../services/notifications";
import { useToast } from "../context/ToastContext";

function Notifications() {
  const toast = useToast();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const fetchNotificationsList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications(unreadOnly ? { unread_only: true } : {});
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [unreadOnly]);

  useEffect(() => {
    fetchNotificationsList();
  }, [fetchNotificationsList]);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id, true);
      toast.success("Notification marked as read");
      fetchNotificationsList();
    } catch {
      toast.error("Failed to update notification.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      toast.success("All notifications marked as read");
      fetchNotificationsList();
    } catch {
      toast.error("Failed to mark all as read.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      toast.success("Notification removed");
      fetchNotificationsList();
    } catch {
      toast.error("Failed to delete notification.");
    }
  };

  const getIconAndStyle = (type) => {
    switch (type) {
      case "budget_exceeded":
        return {
          icon: AlertOctagon,
          bg: "bg-rose-50 text-rose-600 border-rose-200",
        };
      case "budget_warning":
        return {
          icon: AlertTriangle,
          bg: "bg-amber-50 text-amber-600 border-amber-200",
        };
      case "goal_completed":
        return {
          icon: Trophy,
          bg: "bg-emerald-50 text-emerald-600 border-emerald-200",
        };
      case "goal_progress":
        return {
          icon: Target,
          bg: "bg-[#FAF7F0] text-[#A68A56] border-[#E8DFC8]",
        };
      default:
        return {
          icon: Info,
          bg: "bg-blue-50 text-blue-600 border-blue-200",
        };
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Notifications & Alerts"
        subtitle="Live threshold warnings, goal celebrations, and financial updates"
        action={
          unreadCount > 0 ? (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-sm font-semibold transition shadow-2xs"
            >
              <CheckCheck size={17} className="text-emerald-600" />
              <span>Mark all as read</span>
            </button>
          ) : null
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-stone-200 pb-3">
        <button
          onClick={() => setUnreadOnly(false)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            !unreadOnly
              ? "bg-stone-900 text-white"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setUnreadOnly(true)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
            unreadOnly
              ? "bg-stone-900 text-white"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <span>Unread Only</span>
          {unreadCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-xs font-bold ${
                unreadOnly
                  ? "bg-white text-stone-900"
                  : "bg-rose-500 text-white"
              }`}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl border border-stone-200/80 p-4 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white p-8 rounded-2xl border border-rose-200 text-center">
          <p className="text-rose-600 mb-4">{error}</p>
          <button
            onClick={fetchNotificationsList}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-sm"
          >
            Retry
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="You're all caught up!"
          description={
            unreadOnly
              ? "You have no unread notifications at this time."
              : "Notifications regarding budgets, savings goals, and account activity will appear here."
          }
          actionLabel={unreadOnly ? "View All Notifications" : undefined}
          onAction={unreadOnly ? () => setUnreadOnly(false) : undefined}
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const { icon: TypeIcon, bg } = getIconAndStyle(n.notification_type);

            return (
              <div
                key={n.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                  n.is_read
                    ? "bg-white border-stone-200/80 opacity-80"
                    : "bg-[#FDFAF5] border-[#EADFCB] shadow-2xs"
                }`}
              >
                <div className={`p-3 rounded-xl border flex-shrink-0 ${bg}`}>
                  <TypeIcon size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`text-sm sm:text-base font-bold ${
                        n.is_read ? "text-stone-700" : "text-stone-900"
                      }`}
                    >
                      {n.title}
                    </h3>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 animate-ping" />
                    )}
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed mb-2">
                    {n.message}
                  </p>
                  <span className="text-xs text-stone-400 font-medium">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  {!n.is_read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="p-2 rounded-xl text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 transition"
                      title="Mark as Read"
                    >
                      <Check size={17} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-700 hover:bg-rose-50 transition"
                    title="Delete Notification"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Notifications;