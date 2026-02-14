import { motion } from 'framer-motion';

export function ScannerEffect() {
    return (
        <motion.div
            className="fixed inset-x-0 h-[2px] bg-cyan-glow/50 z-40 pointer-events-none shadow-[0_0_20px_2px_rgba(6,182,212,0.5)]"
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 3
            }}
        >
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cyan-glow/10 to-transparent" />
        </motion.div>
    );
}
