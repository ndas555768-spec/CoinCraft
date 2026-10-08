import {
  LayoutDashboard,
  Wallet,
  Receipt,
  PiggyBank,
  Target,
  Bell,
  User as UserIcon,
  LogOut,
  X,
  Coins,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Income", path: "/income", icon: Wallet },
  { name: "Expenses", path: "/expenses", icon: Receipt },
  { name: "Budget", path: "/budget", icon: PiggyBank },
  { name: "Goals", path: "/goals", icon: Target },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Profile", path: "/profile", icon: UserIcon },
];

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast.info("Logged out successfully");
      navigate("/login");
    } catch {
      navigate("/login");
    }
  };

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "U");
  const displayName = user?.username || (user?.email ? user.email.split("@")[0] : "User");

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-72 h-screen bg-white border-r border-stone-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#A68A56] to-[#C2A878] flex items-center justify-center text-white shadow-sm">
              <Coins size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-900 leading-tight">CoinCraft</h1>
              <p className="text-xs text-stone-400 font-medium tracking-wide uppercase">Smart Wealth</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#FAF7F0] text-[#8C734B] shadow-2xs font-semibold"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`
                }
              >
                <Icon size={19} className="flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="border-t border-stone-100 p-4 bg-stone-50/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C2A878] to-[#8C734B] flex items-center justify-center text-white font-bold text-sm shadow-xs flex-shrink-0">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-stone-900 text-sm truncate">{displayName}</p>
              <p className="text-xs text-stone-400 truncate">{user?.email || "Authenticated"}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 rounded-xl transition"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;