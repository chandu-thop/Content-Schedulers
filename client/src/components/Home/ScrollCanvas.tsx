import { useEffect, useRef, useState } from "react";

interface ScrollCanvasProps {
    totalFrames?: number;
}

export default function ScrollCanvas({ totalFrames = 300 }: ScrollCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);

    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const targetProgress = useRef(0);
    const easedProgress = useRef(0);
    const animationFrameId = useRef<number | null>(null);
    const lastFrameIndex = useRef<number | null>(null);
    const isLoopRunning = useRef(false);

    // Preload images sequence in controlled parallel batches
    useEffect(() => {
        let loadedCount = 0;
        const tempImages: HTMLImageElement[] = [];
        let isCancelled = false;

        // Initialize the image element list so the array has references
        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image();
            tempImages.push(img);
        }
        imagesRef.current = tempImages;

        const loadFrame = (index: number): Promise<void> => {
            if (isCancelled) return Promise.resolve();
            const img = tempImages[index - 1]; // 1-indexed to 0-indexed
            const frameNum = String(index).padStart(3, "0");

            return new Promise<void>((resolve) => {
                img.src = `/frames_1/ezgif-frame-${frameNum}.png`;

                const onLoaded = () => {
                    if (isCancelled) return resolve();
                    loadedCount++;
                    setImagesLoaded(loadedCount);
                    if (loadedCount === totalFrames) {
                        setIsLoading(false);
                    }
                    resolve();
                };

                // Asynchronously pre-decode image using browser API to avoid main thread stutters
                if (typeof (img as any).decode === "function") {
                    img.decode()
                        .then(onLoaded)
                        .catch(() => {
                            if (img.complete) {
                                onLoaded();
                            } else {
                                img.onload = onLoaded;
                                img.onerror = onLoaded; // continue progress anyway
                            }
                        });
                } else {
                    img.onload = onLoaded;
                    img.onerror = onLoaded;
                }
            });
        };

        const loadAll = async () => {
            const batchSize = 15; // Controlled batch size to avoid browser socket/memory exhaustion
            for (let i = 1; i <= totalFrames; i += batchSize) {
                if (isCancelled) break;
                const promises = [];
                for (let j = 0; j < batchSize && (i + j) <= totalFrames; j++) {
                    promises.push(loadFrame(i + j));
                }
                await Promise.all(promises);
            }
        };

        loadAll();

        return () => {
            isCancelled = true;
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [totalFrames]);

    // Handle scroll progress and rendering
    useEffect(() => {
        if (isLoading) return;

        const renderLoop = () => {
            // Apply smoothing for a continuous Vertical scroll easing details
            const diff = targetProgress.current - easedProgress.current;
            easedProgress.current += diff * 0.06; // Fine-tuned easing factor for fluid transition

            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (canvas && ctx && imagesRef.current.length > 0) {
                const total = imagesRef.current.length;

                // Use Math.round for symmetric stepped frame transition bounds (reduces back-and-forth jitter)
                const frameIndex = Math.min(
                    total - 1,
                    Math.max(0, Math.round(easedProgress.current * (total - 1)))
                );

                // Only draw to canvas if we transitioned to a new frame index
                if (frameIndex !== lastFrameIndex.current) {
                    const img = imagesRef.current[frameIndex];
                    if (img.complete && img.naturalWidth > 0) {
                        if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
                            canvas.width = img.naturalWidth;
                            canvas.height = img.naturalHeight;
                        }
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        lastFrameIndex.current = frameIndex;
                    }
                }
            }

            // Idle the animation loop once easedProgress matches targetProgress to save CPU/GPU resources
            if (Math.abs(targetProgress.current - easedProgress.current) < 0.0001) {
                easedProgress.current = targetProgress.current;
                isLoopRunning.current = false;
                animationFrameId.current = null;
            } else {
                animationFrameId.current = requestAnimationFrame(renderLoop);
            }
        };

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            targetProgress.current = maxScroll > 0 ? Math.max(0, Math.min(1, scrollY / maxScroll)) : 0;

            // Automatically wake up the render loop if not running
            if (!isLoopRunning.current) {
                isLoopRunning.current = true;
                animationFrameId.current = requestAnimationFrame(renderLoop);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll, { passive: true });

        // Initial drawing run
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isLoading]);

    if (isLoading) {
        const percent = Math.round((imagesLoaded / totalFrames) * 100);
        return (
            <div className="fixed inset-0 w-full h-screen z-50 flex flex-col items-center justify-center bg-[#fafafa]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(17,17,17,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.012)_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center space-y-4 max-w-xs w-full px-6">
                    <span className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                        Loading Global Sandbox
                    </span>
                    <div className="w-full h-1 bg-slate-200/60 rounded-full overflow-hidden relative">
                        <div
                            className="h-full bg-red-400 rounded-full transition-all duration-150 ease-out"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                    <span className="text-xs font-mono text-slate-400/80 tabular-nums">
                        {percent}%
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 w-full h-screen z-0 bg-[#fafafa] pointer-events-none flex items-center justify-center overflow-hidden">

            {/* Background Parallax Light-Gray Geometric Grid */}
            <div
                className="absolute inset-0 bg-[linear-gradient(rgba(17,17,17,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.035)_1px,transparent_1px)] bg-size-[64px_64px] pointer-events-none"
                style={{
                    transform: `translateY(${easedProgress.current * -60}px) translateZ(0)`,
                    willChange: "transform"
                }}
            />

            {/* Soft Continuous Volumetric Red Glow Behind Canvas */}
            <div
                className="absolute w-[800px] h-[580px] bg-red-500/8 rounded-full blur-[120px] pointer-events-none transition-transform duration-300"
                style={{
                    transform: `scale(${1 + easedProgress.current * 0.15}) translateZ(0)`,
                    willChange: "transform"
                }}
            />

            {/* Immersive Canvas Dashboard Rendering */}
            <div className="absolute inset-0 w-full h-full select-none overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover relative z-10"
                />

                {/* Clean, Volumetric Studio Lighting Reflective Layer */}
                <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 mix-blend-overlay" />

                {/* Sweeping Specular Glass Highlight */}
                <div
                    className="absolute inset-0 pointer-events-none z-30 mix-blend-overlay opacity-25"
                    style={{
                        background: `linear-gradient(135deg, transparent 38%, rgba(255, 255, 255, 0.75) 50%, transparent 62%)`,
                        backgroundSize: "200% 200%",
                        backgroundPosition: `${(easedProgress.current * 180) - 90}% 50%`,
                        willChange: "background-position"
                    }}
                />
            </div>
        </div>
    );
}
