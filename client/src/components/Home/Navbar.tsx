import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

export default function Navbar() {
    const { user } = { user: false };

    return (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
            <nav className="w-full max-w-6xl bg-white/50 backdrop-blur-md border border-white/60 rounded-full px-6 h-14 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)] pointer-events-auto">
                <Link to="/" onClick={() => scrollTo(0, 0)} className="flex items-center gap-2">
                    <img src="/logo.svg" alt="logo" className="size-6" />
                    <span className="text-lg lg:text-xl font-medium font-serif text-slate-800">Scheduler</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm text-slate-500">
                    <a href="#features" className="hover:text-slate-900">
                        Features
                    </a>
                    <a href="#how-it-works" className="hover:text-slate-900">
                        How it works
                    </a>
                    <a href="#pricing" className="hover:text-slate-900">
                        Pricing
                    </a>
                </div>

                {user ? (
                    <Link to="/dashboard" className="flex items-center gap-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full shadow-sm hover:shadow-red-200 hover:shadow-md">
                        Go to Dashboard <ArrowRightIcon className="size-3.5" />
                    </Link>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-sm text-slate-600 hover:text-slate-900 hidden sm:block">
                            Sign In
                        </Link>
                        <Link to="/login" className="flex items-center gap-1.5 text-xs bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full shadow-sm hover:shadow-red-200 hover:shadow-md">
                            Get Started <ArrowRightIcon className="size-3.5" />
                        </Link>
                    </div>
                )}
            </nav>
        </div>
    );
}
