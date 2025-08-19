
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { fixedHolidays, variableHolidayDetails, type Holiday } from '@/lib/holidays';
import { calculateHolidaysForYear } from '@/ai/flows/calculate-holidays-flow';
import { Card, CardContent } from '@/components/ui/card';

export function HolidayBanner() {
  const [currentHoliday, setCurrentHoliday] = useState<Holiday | null>(null);

  useEffect(() => {
    const findCurrentHoliday = async () => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1; // getMonth() is 0-indexed
      const currentDay = today.getDate();

      // 1. Check for a fixed holiday first
      const fixedHoliday = fixedHolidays.find(h => h.month === currentMonth && h.day === currentDay);
      if (fixedHoliday) {
        setCurrentHoliday(fixedHoliday);
        return;
      }
      
      try {
        // 2. If no fixed holiday, fetch the variable holidays for the current year
        const { holidays: calculatedHolidays } = await calculateHolidaysForYear({ year: currentYear });
        
        // 3. Find if today is a calculated holiday
        const calculatedHoliday = calculatedHolidays.find(h => h.month === currentMonth && h.day === currentDay);

        if (calculatedHoliday) {
          // 4. Find the matching message and icon for the holiday
          const details = variableHolidayDetails.find(d => d.name === calculatedHoliday.name);
          if (details) {
            setCurrentHoliday({
              ...calculatedHoliday,
              message: details.message,
              icon: details.icon,
            });
          }
        }
      } catch (error) {
          console.error("Failed to fetch or process variable holidays:", error);
          // Don't display a banner if the AI call fails.
          setCurrentHoliday(null);
      }
    };
    
    findCurrentHoliday();

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
