import React, { createContext, useContext, useState, useCallback } from "react";
import { AlertCircleIcon, CheckCircle2Icon, InfoIcon, XIcon } from "lucide-react";

export interface Toast {
    id: string;
    message: string;
    type: "success" | "error" | "info" | "warning";
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (message: string, type?: Toast["type"]) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: Toast["type"] = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove toast after 4 seconds
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}

            {/* Toast Render Overlay */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-in ${toast.type === "success"
                                ? "bg-emerald-50/95 border-emerald-200 text-emerald-800"
                                : toast.type === "error"
                                    ? "bg-rose-50/95 border-rose-200 text-rose-800"
                                    : toast.type === "warning"
                                        ? "bg-amber-50/95 border-amber-200 text-amber-800"
                                        : "bg-slate-900/95 border-slate-800 text-white"
                            }`}
                    >
                        {toast.type === "success" && <CheckCircle2Icon className="w-5 h-5 flex-shrink-0 text-emerald-600" />}
                        {toast.type === "error" && <AlertCircleIcon className="w-5 h-5 flex-shrink-0 text-rose-600" />}
                        {(toast.type === "info" || toast.type === "warning") && <InfoIcon className={`w-5 h-5 flex-shrink-0 ${toast.type === "warning" ? "text-amber-600" : "text-slate-400"}`} />}

                        <div className="flex-1 text-sm font-medium leading-5 break-words">
                            {toast.message}
                        </div>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-slate-100/50 transition-colors"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
