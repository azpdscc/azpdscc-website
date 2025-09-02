
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="container mx-auto px-4 -mt-8 mb-12 z-20 relative"
        >
          <motion.div
            animate={{
                y: [0, -5, 0],
            }}
            transition={{
                duration: 3,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
            }}
            style={{ transform: 'translateZ(0)' }}
          >
             <Card
                className="p-0 text-primary-foreground shadow-2xl relative overflow-hidden bg-primary rounded-lg"
             >
                <CardContent className="p-4 flex items-center justify-center gap-4 text-center">
                    <currentHoliday.icon className="h-8 w-8 text-primary-foreground flex-shrink-0" strokeWidth={1.5} />
                    <p className="text-xl md:text-2xl font-bold">
                        {currentHoliday.message}
                    </p>
                </CardContent>
             </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
