
'use client';

import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TickerProps {
  text: string;
  link: string;
  className?: string;
  duration?: number;
}

export function Ticker({ text, link, className, duration = 40 }: TickerProps) {
  // This is the content that will be scrolled.
  // We use `flex-shrink-0` to prevent it from shrinking inside the flex container.
  const TickerContent = () => (
    <div className="flex items-center flex-shrink-0 px-8 py-2">
      <Megaphone className="h-5 w-5 mr-4 flex-shrink-0" />
      <span className="font-semibold text-md whitespace-nowrap">{text}</span>
    </div>
  );

  // We render the content multiple times in a block to ensure it's wider than most screens.
  // This prevents a gap in the animation on very wide displays.
  const ContentBlock = () => (
    <>
      <TickerContent />
      <TickerContent />
      <TickerContent />
      <TickerContent />
    </>
  );

  return (
    <div className={cn('bg-primary text-primary-foreground relative h-12 w-full overflow-hidden', className)}>
      <Link href={link} className="w-full h-full" aria-label={text}>
        <motion.div
          className="absolute left-0 top-0 flex h-full" // The container that moves
          initial={{ x: '0%' }}
          animate={{ x: '-50%' }} // Move left by half its width
          transition={{
            ease: 'linear',
            duration: duration,
            repeat: Infinity,
            repeatType: 'loop', // This is crucial for a seamless loop
          }}
        >
          {/* We place two content blocks side-by-side */}
          {/* As the first block moves out, the second one moves in */}
          <div className="flex">
            <ContentBlock />
          </div>
          <div className="flex">
            <ContentBlock />
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
