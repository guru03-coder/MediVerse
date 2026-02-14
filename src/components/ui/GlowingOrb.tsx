import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlowingOrbProps {
    className?: string;
    delay?: number;
    color?: string;
}

export function GlowingOrb({ className, delay = 0, color = "bg-medical-blue-400" }: GlowingOrbProps) {
    return (
        <motion.div
            className={cn("absolute rounded-full blur-3xl opacity-20", color, className)}
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay,
            }}
        />
    );
}
