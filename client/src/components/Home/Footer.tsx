import { Link } from "react-router-dom";

const footerLinks = {
    Product: ["Features", "How it works", "Pricing", "Changelog"],
    Company: ["About", "Blog", "Careers", "Press"],
    Legal: ["Privacy", "Terms", "Security", "Cookies"],
};

export default function Footer() {
    return (
        <footer className="bg-transparent border-t border-slate-200/50">
            <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" onClick={() => scrollTo(0, 0)} className="inline-flex items-center gap-2 mb-5">
                            <img src="/logo.svg" alt="logo" className="size-6" />
                            <span className="font-semibold font-serif text-xl text-slate-900">Scheduler</span>
                        </Link>
                        <p className="text-sm text-slate-800 font-medium leading-relaxed max-w-xs">The AI-powered social media scheduler that helps creators and teams grow faster with less effort.</p>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <div className="text-xs font-bold uppercase tracking-widest mb-5 text-slate-900">{category}</div>
                            <ul className="space-y-1">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm text-slate-850 hover:text-red-500 font-bold transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200/50">
                    <p className="text-xs text-slate-700 font-bold">© {new Date().getFullYear()} Scheduler. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-xs text-slate-700 hover:text-slate-900 font-bold transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-xs text-slate-700 hover:text-slate-900 font-bold transition-colors">
                            Terms of Service
                        </a>
                        <Link to="/login" className="text-xs text-slate-700 hover:text-slate-900 font-bold transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
