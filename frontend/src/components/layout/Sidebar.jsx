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

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Income", icon: Wallet },
    { name: "Expenses", icon: Receipt },
    { name: "Budget", icon: PiggyBank },
    { name: "Goals", icon: Target },
    { name: "Notifications", icon: Bell },
    { name: "Profile", icon: User },
];

function Sidebar() {
    return (
        <aside className="w-72 h-screen bg-white border-r border-stone-200 flex flex-col">
            {/* Logo */}
            <div className="px-8 py-8 border-b border-stone-200">
                <h1 className="text-3xl font-bold tracking-wide text-black">
                    CoinCraft
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                    Personal Finance Manager
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.name}
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-stone-700 hover:bg-[#F7F3ED] hover:text-black transition"
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-stone-200">
                <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition">
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;