import { useState, type ReactNode, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface HeroParallaxProps {
    children: ReactNode;
    className?: string;
}

export function HeroParallax({ children, className }: HeroParallaxProps) {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from center (max 5 degrees tilt)
        const factor = 20; // Lower is more sensitive
        const rY = (e.clientX - centerX) / factor;
        const rX = -(e.clientY - centerY) / factor;

        setRotateY(rY);
        setRotateX(rX);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <motion.div
            className={cn("relative perspective-1000", className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{
                rotateX,
                rotateY,
            }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 0.5
            }}
            style={{
                transformStyle: "preserve-3d",
            }}
        >
            {children}
        </motion.div>
    );
}
