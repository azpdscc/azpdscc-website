
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
 * This contains pre-calculated dates for variable holidays to avoid API calls.
 */
export const variableHolidays: Holiday[] = [
    // 2024
    { name: "Martin Luther King Jr. Day", year: 2024, month: 1, day: 15, message: "Honor & Remember.", icon: Users },
    { name: "Presidents' Day", year: 2024, month: 2, day: 19, message: "Happy Presidents' Day!", icon: Landmark },
    { name: "Holi", year: 2024, month: 3, day: 25, message: "Happy Holi!", icon: Paintbrush },
    { name: "Easter", year: 2024, month: 3, day: 31, message: "Happy Easter!", icon: Rabbit },
    { name: "Memorial Day", year: 2024, month: 5, day: 27, message: "Remember and Honor.", icon: Medal },
    { name: "Labor Day", year: 2024, month: 9, day: 2, message: "Happy Labor Day!", icon: HardHat },
    { name: "Thanksgiving", year: 2024, month: 11, day: 28, message: "Happy Thanksgiving!", icon: Utensils },
    { name: "Diwali", year: 2024, month: 11, day: 1, message: "Happy Diwali!", icon: Flame },

    // 2025
    { name: "Martin Luther King Jr. Day", year: 2025, month: 1, day: 20, message: "Honor & Remember.", icon: Users },
    { name: "Presidents' Day", year: 2025, month: 2, day: 17, message: "Happy Presidents' Day!", icon: Landmark },
    { name: "Holi", year: 2025, month: 3, day: 14, message: "Happy Holi!", icon: Paintbrush },
    { name: "Easter", year: 2025, month: 4, day: 20, message: "Happy Easter!", icon: Rabbit },
    { name: "Memorial Day", year: 2025, month: 5, day: 26, message: "Remember and Honor.", icon: Medal },
    { name: "Labor Day", year: 2025, month: 9, day: 1, message: "Happy Labor Day!", icon: HardHat },
    { name: "Thanksgiving", year: 2025, month: 11, day: 27, message: "Happy Thanksgiving!", icon: Utensils },
    { name: "Diwali", year: 2025, month: 10, day: 21, message: "Happy Diwali!", icon: Flame },
    
    // 2026
    { name: "Martin Luther King Jr. Day", year: 2026, month: 1, day: 19, message: "Honor & Remember.", icon: Users },
    { name: "Presidents' Day", year: 2026, month: 2, day: 16, message: "Happy Presidents' Day!", icon: Landmark },
    { name: "Holi", year: 2026, month: 3, day: 4, message: "Happy Holi!", icon: Paintbrush },
    { name: "Easter", year: 2026, month: 4, day: 5, message: "Happy Easter!", icon: Rabbit },
    { name: "Memorial Day", year: 2026, month: 5, day: 25, message: "Remember and Honor.", icon: Medal },
    { name: "Labor Day", year: 2026, month: 9, day: 7, message: "Happy Labor Day!", icon: HardHat },
    { name: "Thanksgiving", year: 2026, month: 11, day: 26, message: "Happy Thanksgiving!", icon: Utensils },
    { name: "Diwali", year: 2026, month: 11, day: 8, message: "Happy Diwali!", icon: Flame },

    // 2027
    { name: "Martin Luther King Jr. Day", year: 2027, month: 1, day: 18, message: "Honor & Remember.", icon: Users },
    { name: "Presidents' Day", year: 2027, month: 2, day: 15, message: "Happy Presidents' Day!", icon: Landmark },
    { name: "Holi", year: 2027, month: 3, day: 22, message: "Happy Holi!", icon: Paintbrush },
    { name: "Easter", year: 2027, month: 3, day: 28, message: "Happy Easter!", icon: Rabbit },
    { name: "Memorial Day", year: 2027, month: 5, day: 31, message: "Remember and Honor.", icon: Medal },
    { name: "Labor Day", year: 2027, month: 9, day: 6, message: "Happy Labor Day!", icon: HardHat },
    { name: "Thanksgiving", year: 2027, month: 11, day: 25, message: "Happy Thanksgiving!", icon: Utensils },
    { name: "Diwali", year: 2027, month: 10, day: 29, message: "Happy Diwali!", icon: Flame },

    // 2028
    { name: "Martin Luther King Jr. Day", year: 2028, month: 1, day: 17, message: "Honor & Remember.", icon: Users },
    { name: "Presidents' Day", year: 2028, month: 2, day: 21, message: "Happy Presidents' Day!", icon: Landmark },
    { name: "Holi", year: 2028, month: 3, day: 10, message: "Happy Holi!", icon: Paintbrush },
    { name: "Easter", year: 2028, month: 4, day: 16, message: "Happy Easter!", icon: Rabbit },
    { name: "Memorial Day", year: 2028, month: 5, day: 29, message: "Remember and Honor.", icon: Medal },
    { name: "Labor Day", year: 2028, month: 9, day: 4, message: "Happy Labor Day!", icon: HardHat },
    { name: "Thanksgiving", year: 2028, month: 11, day: 23, message: "Happy Thanksgiving!", icon: Utensils },
    { name: "Diwali", year: 2028, month: 10, day: 17, message: "Happy Diwali!", icon: Flame },
];
