import { useState, useEffect } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface DecodingTextProps extends HTMLMotionProps<"span"> {
    text: string;
    revealDuration?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?";

export function DecodingText({ text, revealDuration = 1500, className, ...props }: DecodingTextProps) {
    const [displayText, setDisplayText] = useState("");
    const [isDecoded, setIsDecoded] = useState(false);

    useEffect(() => {
        let startTime = Date.now();
        let frameId: number;

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / revealDuration, 1);

            if (progress === 1) {
                setDisplayText(text);
                setIsDecoded(true);
                return;
            }

            const scrambled = text.split('').map((char, index) => {
                if (char === ' ') return ' ';
                if (index < text.length * progress) {
                    return text[index];
                }
                return CHARS[Math.floor(Math.random() * CHARS.length)];
            }).join('');

            setDisplayText(scrambled);
            frameId = requestAnimationFrame(animate);
        };

        frameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frameId);
    }, [text, revealDuration]);

    return (
        <motion.span
            className={`${className} ${isDecoded ? '' : 'font-mono'}`}
            {...props}
        >
            {displayText}
        </motion.span>
    );
}
