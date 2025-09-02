
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { fixedHolidays, variableHolidays, type Holiday } from '@/lib/holidays';
import { Card, CardContent } from '@/components/ui/card';

export function HolidayBanner() {
  const [currentHoliday, setCurrentHoliday] = useState<Holiday | null>(null);

  useEffect(() => {
    const findCurrentHoliday = () => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1; // getMonth() is 0-indexed
      const currentDay = today.getDate();
      
      const allHolidays = [...fixedHolidays, ...variableHolidays];

      const holiday = allHolidays.find(h => 
        h.month === currentMonth && 
        h.day === currentDay &&
        (h.year ? h.year === currentYear : true)
      );
      
      if (holiday) {
        setCurrentHoliday(holiday);
      }
    };
    
    findCurrentHoliday();

  }, []);

  return (
    <AnimatePresence>
      {currentHoliday && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            borderColor: ["hsl(var(--primary))", "hsl(var(--primary-foreground))", "hsl(var(--primary))"] // Keyframes for color pulse
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 2.5, // Total duration for one pulse cycle
            repeat: Infinity, // Repeat the animation forever
            repeatType: "loop",
            ease: "easeInOut"
          }}
          className="container mx-auto px-4 -mt-12 mb-12 z-20 relative"
        >
          <Card
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-2 shadow-2xl"
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
