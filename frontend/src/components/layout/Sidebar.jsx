import {
    LayoutDashboard,
    Wallet,
    Receipt,
    PiggyBank,
    Target,
    Bell,
    User,
    LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Income", path: "/income", icon: Wallet },
    { name: "Expenses", path: "/expenses", icon: Receipt },
    { name: "Budget", path: "/budget", icon: PiggyBank },
    { name: "Goals", path: "/goals", icon: Target },
    { name: "Notifications", path: "/notifications", icon: Bell },
    { name: "Profile", path: "/profile", icon: User },
];

function Sidebar() {
    return (
        <aside className="w-72 h-screen bg-white border-r border-stone-200 flex flex-col">

            {/* Logo */}
            <div className="px-8 py-8 border-b border-stone-200">
                <h1 className="text-3xl font-bold">CoinCraft</h1>
                <p className="text-sm text-stone-500">
                    Personal Finance
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3 rounded-xl transition ${isActive
                                    ? "bg-[#F7F3ED] text-black font-semibold"
                                    : "text-stone-600 hover:bg-stone-100"
                                }`
                            }
                        >
                            <Icon size={20} />
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>

            {/* User */}
            <div className="border-t border-stone-200 p-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#C2A878] flex items-center justify-center text-white font-bold">
                        N
                    </div>

                    <div>
                        <p className="font-semibold">Nandita</p>
                        <p className="text-xs text-stone-500">
                            Premium User
                        </p>
                    </div>
                </div>

                <button className="flex items-center gap-3 text-red-600 hover:text-red-700">
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;