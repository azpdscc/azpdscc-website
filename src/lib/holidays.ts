import { PartyPopper, Flame, Gift, Heart, Ghost, Medal } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export interface Holiday {
  name: string;
  month: number; // 1-12
  day: number; // 1-31
  message: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

export const usHolidays: Holiday[] = [
  { name: "New Year's Day", month: 1, day: 1, message: "Happy New Year!", icon: PartyPopper },
  { name: "Valentine's Day", month: 2, day: 14, message: "Happy Valentine's Day!", icon: Heart },
  { name: "Independence Day", month: 7, day: 4, message: "Happy 4th of July!", icon: Flame },
  { name: "Halloween", month: 10, day: 31, message: "Happy Halloween!", icon: Ghost },
  { name: "Veterans Day", month: 11, day: 11, message: "Happy Veterans Day!", icon: Medal },
  { name: "Christmas Day", month: 12, day: 25, message: "Merry Christmas!", icon: Gift },
];
