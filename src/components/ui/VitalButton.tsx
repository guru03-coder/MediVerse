import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

interface VitalButtonProps extends HTMLMotionProps<"button"> {
    children: ReactNode;
}

export function VitalButton({ children, className, ...props }: VitalButtonProps) {
    return (
        <motion.button
            className={cn(
                "relative flex items-center justify-center overflow-hidden",
                "bg-medical-blue-600 hover:bg-medical-blue-700 text-white rounded-full font-semibold transition-colors",
                className
            )}
            animate={{
                scale: [1, 1.05, 1],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            {/* Ripple Effect */}
            <motion.div
                className="absolute inset-0 rounded-full border border-white/50"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{
                    scale: 1.5,
                    opacity: 0,
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            <div className="relative z-10 flex items-center gap-2">
                {children}
            </div>
        </motion.button>
    );
}
