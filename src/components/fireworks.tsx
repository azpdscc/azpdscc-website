
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const particleVariants = {
  initial: {
    opacity: 1,
    scale: 1,
  },
  animate: (i: number) => ({
    x: Math.random() * 200 - 100,
    y: Math.random() * 200 - 100,
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.5 + Math.random() * 0.5,
      ease: 'easeOut',
      delay: i * 0.01,
    },
  }),
};

const Firework = ({ x, y, hue }: { x: number; y: number; hue: number }) => {
  const count = 50; // Number of particles per firework
  return (
    <motion.div
      className="absolute"
      initial={{ x, y }}
      animate={{}}
      style={{ top: y, left: x }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          custom={i}
          variants={particleVariants}
          initial="initial"
          animate="animate"
          style={{
            backgroundColor: `hsl(${hue + (i * 20)}, 100%, 50%)`,
          }}
        />
      ))}
    </motion.div>
  );
};

export const Fireworks = () => {
    const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number; hue: number }>>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newBurst = {
                id: Date.now(),
                x: Math.random() * 100,
                y: Math.random() * 100,
                hue: Math.random() * 360,
            };
            setBursts(current => [...current, newBurst].slice(-5)); // Limit to 5 bursts
        }, 400); // New burst every 400ms

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {bursts.map(burst => (
                <Firework key={burst.id} x={burst.x} y={burst.y} hue={burst.hue} />
            ))}
        </div>
    );
};

