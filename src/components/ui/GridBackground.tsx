import { motion } from 'framer-motion';

export function GridBackground() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <motion.div
                className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"
            />
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    maskImage: 'linear-gradient(to bottom, transparent, 10%, white, 90%, transparent)'
                }}
            />
            <motion.div
                className="absolute inset-0"
                animate={{
                    backgroundPosition: ["0px 0px", "0px 100px"],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }}
            />
            {/* Scanning Beam */}
            <motion.div
                className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-cyan-glow/10 to-transparent"
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </div>
    );
}
