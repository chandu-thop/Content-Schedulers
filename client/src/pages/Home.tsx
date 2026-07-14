import Navbar from "../components/Home/Navbar";
import Hero from "../components/Home/Hero";
import ScrollCanvas from "../components/Home/ScrollCanvas";
import Features from "../components/Home/Features";
import HowItWorks from "../components/Home/HowItWorks";
import Testimonials from "../components/Home/Testimonials";
import Pricing from "../components/Home/Pricing";
import CTA from "../components/Home/CTA";
import Footer from "../components/Home/Footer";

export default function Landing() {
    return (
        <div className="min-h-screen flex flex-col bg-transparent text-slate-900 font-sans relative selection:bg-red-500/10">
            {/* Background Canvas Animation */}
            <ScrollCanvas />

            {/* Foreground content blocks */}
            <div className="relative z-10 w-full flex-1">
                <Navbar />
                <Hero />
                <Features />
                <HowItWorks />
                <Testimonials />
                <Pricing />
                <CTA />
                <Footer />
            </div>
        </div>
    );
}
