import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import About from "../components/landing/About";
import Features from "../components/landing/Features";
import ProductPreview from "../components/landing/ProductPreview";
import FAQ from "../components/landing/FAQ";
import Footer from "../components/landing/Footer";

function LandingPage() {
    return (
        <>
            <Navbar />
            <Hero />
            <About />
            <Features />
            <ProductPreview />
            <FAQ />
            <Footer />
        </>
    );
}

export default LandingPage;