import { Bell, Search } from "lucide-react";

function Topbar() {
    return (
        <header className="h-20 bg-white border-b border-stone-200 flex items-center justify-between px-8">

            {/* Search */}
            <div className="relative w-96">

                <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                />

                <input
                    type="text"
                    placeholder="Search transactions..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#C2A878]"
                />

            </div>

            {/* Right Side */}

            <div className="flex items-center gap-6">

                <button className="relative">
                    <Bell size={24} />

                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        3
                    </span>

                </button>

                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-full bg-[#C2A878] flex items-center justify-center text-white font-bold">
                        N
                    </div>

                    <div>
                        <h4 className="font-semibold">
                            Nandita Das
                        </h4>

                        <p className="text-sm text-stone-500">
                            Premium User
                        </p>
                    </div>

                </div>

            </div>

        </header>
    );
}

export default Topbar;