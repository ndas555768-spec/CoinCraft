import Navbar from "../components/landing/Navbar";

function LandingPage() {
    return (
        <>
            <Navbar />

            <main className="pt-28 min-h-screen bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-8">

                    <h1 className="text-6xl font-bold text-black">
                        CoinCraft
                    </h1>

                    <p className="mt-6 text-xl text-stone-600">
                        Smart personal finance management.
                    </p>

                </div>
            </main>
        </>
    );
}

export default LandingPage;