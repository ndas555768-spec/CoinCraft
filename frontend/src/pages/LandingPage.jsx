import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import About from "../components/landing/About";
import Features from "../components/landing/Features";
import ProductPreview from "../components/landing/ProductPreview";
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
            <About />
            <Features />
            <ProductPreview />
        </>
    );
}

export default LandingPage;