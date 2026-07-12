import { CheckCircleIcon } from "lucide-react";

const steps = [
    { step: "01", title: "Connect Your Accounts", description: "Link your social profiles in seconds. We support Twitter, LinkedIn, Facebook, and Instagram." },
    { step: "02", title: "Create or Generate Content", description: "Write your own post or let our AI craft a caption and image based on your prompt." },
    { step: "03", title: "Schedule & Publish", description: "Pick a time, select your platforms, and hit schedule. We handle publishing automatically." },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-transparent">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <div className="mb-6 inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/15 text-red-500 text-[11px] font-medium tracking-[0.06em] uppercase px-3.5 py-1.5 rounded-full">
                        <CheckCircleIcon className="size-3" />
                        Simple setup
                    </div>
                    <h2 className="font-serif font-medium text-4xl sm:text-5xl leading-tight text-gray-900">
                        Up and running in <span className="text-red-400 italic">minutes</span>
                    </h2>
                    <p className="mt-5 text-gray-500 max-w-lg mx-auto leading-relaxed">No complicated onboarding, no steep learning curve. Just connect, create, and grow.</p>
                </div>

                <div className="space-y-8">
                    {steps.map((s, i) => {
                        const isEven = i % 2 === 0;

                        return (
                            <div key={s.step} className="grid grid-cols-1 lg:grid-cols-[1fr_320px_1fr] gap-6">
                                {/* Left element */}
                                {isEven ? (
                                    <div className="bg-white/55 border border-white/60 p-6 rounded-2xl backdrop-blur-md hover:bg-white/70 transition-all duration-300 flex gap-6 items-start shadow-sm">
                                        <div className="shrink-0 size-12 rounded-2xl bg-red-50/80 border border-red-100/50 flex items-center justify-center">
                                            <span className="text-sm font-medium text-red-500">{s.step}</span>
                                        </div>
                                        <div className="pt-1">
                                            <h3 className="text-slate-900 mb-1">{s.title}</h3>
                                            <p className="text-slate-500 text-sm leading-relaxed">{s.description}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="hidden lg:block pointer-events-none" />
                                )}

                                {/* Center element (always spacer for dashboard visibility) */}
                                <div className="hidden lg:block pointer-events-none" />

                                {/* Right element */}
                                {!isEven ? (
                                    <div className="bg-white/55 border border-white/60 p-6 rounded-2xl backdrop-blur-md hover:bg-white/70 transition-all duration-300 flex gap-6 items-start shadow-sm">
                                        <div className="shrink-0 size-12 rounded-2xl bg-red-50/80 border border-red-100/50 flex items-center justify-center">
                                            <span className="text-sm font-medium text-red-500">{s.step}</span>
                                        </div>
                                        <div className="pt-1">
                                            <h3 className="text-slate-900 mb-1">{s.title}</h3>
                                            <p className="text-slate-500 text-sm leading-relaxed">{s.description}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="hidden lg:block pointer-events-none" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
