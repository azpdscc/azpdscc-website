
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { holidays, type Holiday } from '@/lib/holidays';
import { Card, CardContent } from '@/components/ui/card';

export function HolidayBanner() {
  const [currentHoliday, setCurrentHoliday] = useState<Holiday | null>(null);

  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // getMonth() is 0-indexed
    const currentDay = today.getDate();

    const holiday = holidays.find((h) => {
      // If the holiday has a specific year, it must match the current year.
      // Otherwise (for fixed-date holidays), we ignore the year.
      const yearMatches = !h.year || h.year === currentYear;
      return yearMatches && h.month === currentMonth && h.day === currentDay;
    });

    setCurrentHoliday(holiday || null);
  }, []);

  return (
    <AnimatePresence>
      {currentHoliday && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 -mt-12 mb-12 z-20 relative"
        >
          <Card
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-2 border-yellow-500/50 shadow-2xl"
          >
            <CardContent className="p-4 flex items-center justify-center gap-4 text-center">
              <currentHoliday.icon className="h-8 w-8 text-primary-foreground flex-shrink-0" strokeWidth={1.5} />
              <p className="text-xl md:text-2xl font-bold">
                {currentHoliday.message}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
