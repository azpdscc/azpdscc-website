
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
      
      // FOR TESTING:
      // if (!holiday) {
      //   setCurrentHoliday(allHolidays.find(h => h.name === "Diwali"));
      // } else {
      //   setCurrentHoliday(holiday);
      // }
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
          className="container mx-auto px-4 -mt-12 mb-12 z-20 relative"
        >
          <Card
            className="p-[2px] text-primary-foreground shadow-2xl relative overflow-hidden bg-primary/20"
          >
             {/* Orbiting Glow Effect */}
             <motion.div
                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
                animate={{
                    rotate: 360,
                }}
                transition={{
                    duration: 8,
                    ease: 'linear',
                    repeat: Infinity,
                }}
             >
                <div 
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `conic-gradient(from 90deg at 50% 50%, hsl(var(--primary)) 0%, hsl(var(--chart-1)) 20%, hsl(var(--chart-2)) 40%, hsl(var(--chart-4)) 60%, hsl(var(--primary)) 100%)`,
                        filter: 'blur(60px) saturate(2)',
                    }}
                />
             </motion.div>

             <div className="bg-primary rounded-[calc(var(--radius)-2px)] relative z-10">
                <CardContent className="p-4 flex items-center justify-center gap-4 text-center">
                <currentHoliday.icon className="h-8 w-8 text-primary-foreground flex-shrink-0" strokeWidth={1.5} />
                <p className="text-xl md:text-2xl font-bold">
                    {currentHoliday.message}
                </p>
                </CardContent>
             </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
