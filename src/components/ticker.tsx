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

  const TickerContent = () => (
    <div className="flex items-center flex-shrink-0 px-8 py-2">
      <Megaphone className="h-5 w-5 mr-4 flex-shrink-0" />
      <span className="font-semibold text-md">{text}</span>
    </div>
  );

  return (
    <div className={cn('bg-primary text-primary-foreground relative h-12 w-full overflow-hidden', className)}>
      <Link href={link} className="w-full h-full" aria-label={text}>
        <motion.div
          className="absolute left-0 top-0 flex h-full items-center"
          initial={{ x: '0%' }}
          animate={{ x: '-100%' }}
          transition={{
            ease: 'linear',
            duration: duration,
            repeat: Infinity,
          }}
        >
          {/* This inner flex container holds the duplicated content */}
          <div className="flex">
            <TickerContent />
            <TickerContent />
            <TickerContent />
            <TickerContent />
          </div>
           {/* This is the second block that will scroll in seamlessly */}
          <div className="flex">
            <TickerContent />
            <TickerContent />
            <TickerContent />
            <TickerContent />
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
