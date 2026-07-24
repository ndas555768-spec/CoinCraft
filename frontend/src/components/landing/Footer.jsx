function Footer() {
    return (
        <footer className="bg-black text-white py-12">
            <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center">

                <div>
                    <h2 className="text-2xl font-bold">
                        CoinCraft
                    </h2>

                    <p className="text-stone-400 mt-2">
                        Smart finance. Better future.
                    </p>
                </div>

                <div className="flex gap-8 mt-6 md:mt-0">
                    <a href="#about" className="hover:text-[#C2A878]">
                        About
                    </a>

                    <a href="#features" className="hover:text-[#C2A878]">
                        Features
                    </a>

                    <a href="#faq" className="hover:text-[#C2A878]">
                        FAQ
                    </a>
                </div>

            </div>

            <div className="text-center mt-10 text-stone-500 text-sm">
                © 2026 CoinCraft. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;