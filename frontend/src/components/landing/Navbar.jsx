import Button from "../common/Button";

function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

                {/* Logo */}
                <div>
                    <h1 className="text-2xl font-bold tracking-wide text-black">
                        CoinCraft
                    </h1>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-10">
                    <a href="#about" className="hover:text-[#C2A878] transition">
                        About
                    </a>

                    <a href="#features" className="hover:text-[#C2A878] transition">
                        Features
                    </a>

                    <a href="#faq" className="hover:text-[#C2A878] transition">
                        FAQ
                    </a>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                    <Button variant="outline">
                        Login
                    </Button>

                    <Button>
                        Get Started
                    </Button>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;