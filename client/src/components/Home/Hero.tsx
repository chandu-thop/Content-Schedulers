import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-transparent">
            <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-12 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-red-50/80 border border-red-100/50 text-red-500 text-sm px-3.5 py-1.5 rounded-full mb-8">
                    <span className="size-1.5 bg-red-400 rounded-full" />
                    AI-Powered Social Media Automation
                </div>

                {/* Headline */}
                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-slate-900">
                    Schedule smarter.
                    <br />
                    <span className="text-red-400 italic">Grow faster.</span>
                </h1>

                {/* Subheadline */}
                <p className="mt-7 text-gray-500 max-w-2xl mx-auto">Scheduler lets you create, schedule, and auto-engage across all your social platforms — powered by AI that writes your captions and replies for you.</p>

                {/* CTAs */}
                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link to="/login" className="bg-red-500 text-white rounded-full font-medium hover:bg-red-600 hover:shadow-[0_8px_24px_rgba(239,68,68,0.35)] inline-flex items-center gap-2 text-[15px] px-8 py-3.5 w-full sm:w-auto justify-center transition-all bg-red-500">
                        Start for free <ArrowRightIcon className="size-4" />
                    </Link>
                    <a href="#how-it-works" className="bg-white/80 text-[#333] border border-black/10 rounded-full font-medium hover:bg-black/5 hover:border-black/20 inline-flex items-center gap-2 text-[15px] px-8 py-3.5 w-full sm:w-auto backdrop-blur justify-center transition-all">
                        See how it works
                    </a>
                </div>

                <p className="mt-5 text-xs text-gray-400">No credit card required · Free forever plan available</p>
            </div>

            {/* Transparent Spacer to show background dashboard mockup */}
            <div className="w-full h-[55vh] pointer-events-none" />
        </section>
    );
}
