import { motion, type HTMLMotionProps } from 'framer-motion';
import { Siren } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PulseButtonProps extends HTMLMotionProps<"button"> {
    label?: string;
}

export function PulseButton({ className, label = "Emergency SOS", ...props }: PulseButtonProps) {
    return (
        <motion.button
            className={cn(
                "relative group flex items-center gap-3 px-8 py-4 rounded-full",
                "bg-emergency-red/10 border border-emergency-red/50 text-emergency-red",
                "font-bold text-lg uppercase tracking-wider backdrop-blur-md",
                "transition-colors hover:bg-emergency-red/20",
                className
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            <motion.div
                className="absolute inset-0 rounded-full bg-emergency-red/20 z-0"
                animate={{
                    scale: [1, 1.5],
                    opacity: [0.5, 0]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                }}
            />
            <div className="relative z-10 flex items-center gap-2">
                <Siren className="w-6 h-6 animate-pulse" />
                {label}
            </div>
        </motion.button>
    );
}
