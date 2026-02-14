import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true }: GlassCardProps) {
    return (
        <motion.div
            className={cn(
                "glass rounded-2xl p-6 relative overflow-hidden group",
                "bg-white/10 backdrop-blur-lg border border-white/20 shadow-glass",
                className
            )}
            whileHover={hoverEffect ? {
                y: -5,
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                borderColor: "rgba(255, 255, 255, 0.4)"
            } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Noise Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
