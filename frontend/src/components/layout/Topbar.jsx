import { useState, useEffect } from "react";
import { Bell, Search, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getNotifications } from "../../services/notifications";

function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchUnread = async () => {
      try {
        const data = await getNotifications({ unread_only: true });
        if (isMounted) {
          setUnreadCount(data.unread_count || 0);
        }
      } catch {
        // silent catch
      }
    };
    fetchUnread();
    // Poll notifications every 45s
    const interval = setInterval(fetchUnread, 45000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/expenses?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "U");
  const displayName = user?.username || (user?.email ? user.email.split("@")[0] : "User");

  return (
    <header className="h-20 bg-white border-b border-stone-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 md:hidden transition"
          aria-label="Open Navigation"
        >
          <Menu size={22} />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-48 sm:w-80 md:w-96">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-[#C2A878] focus:border-transparent transition bg-stone-50/50 focus:bg-white"
          />
        </form>
      </div>

      {/* Right Side: Notifications & Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={() => navigate("/notifications")}
          className="relative p-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
          aria-label="View Notifications"
        >
          <Bell size={21} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 cursor-pointer p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-stone-50 transition border border-transparent hover:border-stone-200"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#C2A878] to-[#8C734B] flex items-center justify-center text-white font-bold text-sm shadow-xs flex-shrink-0">
            {initial}
          </div>

          <div className="hidden sm:block text-left">
            <h4 className="font-semibold text-stone-900 text-sm leading-tight truncate max-w-[130px]">
              {displayName}
            </h4>
            <p className="text-xs text-stone-400 capitalize">
              {user?.currency || "INR"} Wallet
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;