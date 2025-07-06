
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { holidays, type Holiday } from '@/lib/holidays';
import { Card, CardContent } from '@/components/ui/card';

export function HolidayBanner() {
  const [currentHoliday, setCurrentHoliday] = useState<Holiday | null>(null);

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() is 0-indexed
    const currentDay = today.getDate();

    const holiday = holidays.find(
      (h) => h.month === currentMonth && h.day === currentDay
    );

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
            className="bg-gradient-to-r from-primary to-accent border-0 shadow-2xl"
            style={
              {
                '--primary': currentHoliday.primaryColor,
                '--accent': currentHoliday.accentColor,
                // Ensure text remains readable against any background
                '--primary-foreground': '0 0% 100%',
              } as React.CSSProperties
            }
          >
            <CardContent className="p-4 flex items-center justify-center gap-4 text-center">
              <currentHoliday.icon className="h-8 w-8 text-primary-foreground flex-shrink-0" strokeWidth={1.5} />
              <p className="text-xl md:text-2xl font-bold text-primary-foreground">
                {currentHoliday.message}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
