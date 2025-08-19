
import { PartyPopper, Flame, Gift, Heart, Ghost, Medal, Paintbrush, Hand, Sun, Palmtree, Users, Landmark, Clover, Rabbit, Star, HardHat, Utensils } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export interface Holiday {
  name: string;
  year?: number; // Optional: for holidays with dates that change year to year
  month: number; // 1-12
  day: number; // 1-31
  message: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

/**
 * This list now only contains holidays with fixed dates that do not change year to year.
 * Variable-date holidays are calculated dynamically by the `calculate-holidays-flow`.
 */
export const fixedHolidays: Holiday[] = [
  { name: "New Year's Day", month: 1, day: 1, message: "Happy New Year!", icon: PartyPopper },
  { name: "Lohri", month: 1, day: 13, message: "Happy Lohri!", icon: Flame },
  { name: "Valentine's Day", month: 2, day: 14, message: "Happy Valentine's Day!", icon: Heart },
  { name: "St. Patrick's Day", month: 3, day: 17, message: "Happy St. Patrick's Day!", icon: Clover },
  { name: "Vaisakhi", month: 4, day: 13, message: "Happy Vaisakhi!", icon: Palmtree },
  { name: "Juneteenth", month: 6, day: 19, message: "Happy Juneteenth!", icon: Star },
  { name: "US Independence Day", month: 7, day: 4, message: "Happy 4th of July!", icon: Flame },
  { name: "Halloween", month: 10, day: 31, message: "Happy Halloween!", icon: Ghost },
  { name: "Veterans Day", month: 11, day: 11, message: "Happy Veterans Day!", icon: Medal },
  { name: "Christmas Day", month: 12, day: 25, message: "Merry Christmas!", icon: Gift },
];

/**
 * This maps the calculated holiday names to their message and icon.
 */
export const variableHolidayDetails: Omit<Holiday, 'year' | 'month' | 'day'>[] = [
  { name: "Martin Luther King Jr. Day", message: "Honor & Remember.", icon: Users },
  { name: "Presidents' Day", message: "Happy Presidents' Day!", icon: Landmark },
  { name: "Holi", message: "Happy Holi!", icon: Paintbrush },
  { name: "Easter", message: "Happy Easter!", icon: Rabbit },
  { name: "Memorial Day", message: "Remember and Honor.", icon: Medal },
  { name: "Raksha Bandhan", message: "Happy Raksha Bandhan!", icon: Hand },
  { name: "Janmashtami", message: "Happy Janmashtami!", icon: Sun },
  { name: "Labor Day", message: "Happy Labor Day!", icon: HardHat },
  { name: "Ganesh Chaturthi", message: "Happy Ganesh Chaturthi!", icon: Flame },
  { name: "Navratri", message: "Happy Navratri!", icon: Paintbrush },
  { name: "Dussehra", message: "Happy Dussehra!", icon: Sun },
  { name: "Karva Chauth", message: "Happy Karva Chauth!", icon: Heart },
  { name: "Diwali", message: "Happy Diwali!", icon: Flame },
  { name: "Guru Nanak Jayanti", message: "Happy Guru Nanak Jayanti!", icon: Sun },
  { name: "Thanksgiving", message: "Happy Thanksgiving!", icon: Utensils },
]
