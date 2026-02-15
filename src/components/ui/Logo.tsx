import { Activity } from 'lucide-react';

export function Logo({ className = "", textClassName = "text-slate-900" }: { className?: string, textClassName?: string }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="w-10 h-10 bg-[#0ea5e9] rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Activity className="w-6 h-6 text-white stroke-[3px]" />
            </div>
            <span className={`font-bold text-2xl tracking-tight ${textClassName}`}>
                MediVerse
            </span>
        </div>
    );
}
