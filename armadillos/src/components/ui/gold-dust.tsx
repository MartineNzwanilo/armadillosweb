"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function GoldDust() {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        setParticles(
            Array.from({ length: 20 }).map((_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 4 + 1,
                duration: Math.random() * 5 + 3,
                delay: Math.random() * 2,
                targetY: Math.random() * -100
            }))
        );
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-amber-400 blur-[1px]"
                    initial={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        opacity: 0,
                        scale: 0,
                    }}
                    animate={{
                        top: [null, `${particle.y + particle.targetY}%`],
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                    }}
                    style={{
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                    }}
                />
            ))}
        </div>
    );
}
