import { Search, Bell } from "lucide-react";

function Topbar() {
    return (
        <header className="h-20 bg-white border-b border-stone-200 flex items-center justify-between px-8">

            {/* Left */}
            <div>
                <h2 className="text-2xl font-bold text-stone-900">
                    Dashboard
                </h2>

                <p className="text-sm text-stone-500">
                    Welcome back! Manage your finances with confidence.
                </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-6">

                {/* Search */}
                <div className="hidden lg:flex items-center bg-stone-100 rounded-xl px-4 py-2">
                    <Search size={18} className="text-stone-500" />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent outline-none ml-2 text-sm w-56"
                    />
                </div>

                {/* Notification */}
                <button className="relative p-3 rounded-xl hover:bg-stone-100 transition">
                    <Bell size={20} />

                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#C2A878] flex items-center justify-center text-white font-semibold">
                        N
                    </div>

                    <div className="hidden md:block">
                        <p className="font-semibold">Nandita Das</p>
                        <p className="text-xs text-stone-500">
                            Premium User
                        </p>
                    </div>
                </div>

            </div>

        </header>
    );
}

export default Topbar;