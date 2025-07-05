
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export function TopBar() {
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    // This function runs only on the client side
    const updateDateTime = () => {
      setDateTime(format(new Date(), 'eeee, MMMM do, yyyy | h:mm:ss a'));
    };

    updateDateTime(); // Set initial value
    const timer = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, []);

  return (
    <div className="bg-secondary/50 text-secondary-foreground">
      <div className="container mx-auto px-4 flex items-center justify-between text-xs h-8">
        <div className="font-medium">
          {dateTime || 'Loading date and time...'}
        </div>
        <div />
      </div>
    </div>
  );
}
