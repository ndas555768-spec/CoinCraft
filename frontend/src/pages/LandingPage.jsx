import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
function LandingPage() {
    return (
        <>
            <Navbar />
            <main className="pt-28">
                <h1 className="text-center text-5xl font-bold">
                    Landing Page
                </h1>
            </main>
            <Hero />
        </>
    );
}

export default LandingPage;