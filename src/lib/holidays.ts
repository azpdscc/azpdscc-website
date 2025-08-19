
import { PartyPopper, Flame, Gift, Heart, Ghost, Medal, Paintbrush, Hand, Sun, Palmtree, Users, Landmark, Clover, Rabbit, Star, HardHat, Utensils } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export interface Holiday {
  name: string;
  month: number; // 1-12
  day: number; // 1-31
  message: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  primaryColor: string; // HSL value like "45 86% 59%"
  accentColor: string; // HSL value like "210 40% 96.1%"
}

// Dates for 2024/2025 for relevance
export const holidays: Holiday[] = [
  // --- 2024 Holidays ---
  { name: "New Year's Day", month: 1, day: 1, message: "Happy New Year!", icon: PartyPopper, primaryColor: '45 86% 59%', accentColor: '210 40% 80%' },
  { name: "Lohri", month: 1, day: 13, message: "Happy Lohri!", icon: Flame, primaryColor: '30 95% 53.1%', accentColor: '45 86% 59%' },
  { name: "Martin Luther King Jr. Day", month: 1, day: 15, message: "Honor & Remember.", icon: Users, primaryColor: '220 13% 28%', accentColor: '210 40% 96.1%' },
  { name: "Valentine's Day", month: 2, day: 14, message: "Happy Valentine's Day!", icon: Heart, primaryColor: '346.8 77.2% 49.8%', accentColor: '346.8 90% 65%' },
  { name: "Presidents' Day", month: 2, day: 19, message: "Happy Presidents' Day!", icon: Landmark, primaryColor: '221.2 83.2% 53.3%', accentColor: '0 84.2% 60.2%' },
  { name: "Holi", month: 3, day: 25, message: "Happy Holi!", icon: Paintbrush, primaryColor: '320 86% 59%', accentColor: '210 90% 65%' },
  { name: "St. Patrick's Day", month: 3, day: 17, message: "Happy St. Patrick's Day!", icon: Clover, primaryColor: '142.1 76.2% 36.3%', accentColor: '142.1 80% 50%' },
  { name: "Vaisakhi", month: 4, day: 13, message: "Happy Vaisakhi!", icon: Palmtree, primaryColor: '45 86% 59%', accentColor: '142.1 76.2% 36.3%' },
  { name: "Easter", month: 3, day: 31, message: "Happy Easter!", icon: Rabbit, primaryColor: '300 80% 70%', accentColor: '280 90% 85%' },
  { name: "Memorial Day", month: 5, day: 27, message: "Remember and Honor.", icon: Medal, primaryColor: '217.2 89.2% 47.1%', accentColor: '0 84.2% 60.2%' },
  { name: "Juneteenth", month: 6, day: 19, message: "Happy Juneteenth!", icon: Star, primaryColor: '0 62.8% 50.4%', accentColor: '142.1 76.2% 36.3%' },
  { name: "US Independence Day", month: 7, day: 4, message: "Happy 4th of July!", icon: Flame, primaryColor: '221.2 83.2% 53.3%', accentColor: '0 84.2% 60.2%' },
  { name: "Raksha Bandhan", month: 8, day: 19, message: "Happy Raksha Bandhan!", icon: Hand, primaryColor: '300 80% 60%', accentColor: '320 90% 80%' },
  { name: "Janmashtami", month: 8, day: 26, message: "Happy Janmashtami!", icon: Sun, primaryColor: '210 90% 65%', accentColor: '45 86% 59%' },
  { name: "Labor Day", month: 9, day: 2, message: "Happy Labor Day!", icon: HardHat, primaryColor: '221.2 83.2% 53.3%', accentColor: '210 40% 96.1%' },
  { name: "Ganesh Chaturthi", month: 9, day: 7, message: "Happy Ganesh Chaturthi!", icon: Flame, primaryColor: '6 79% 57%', accentColor: '45 86% 59%' },
  { name: "Navratri", month: 10, day: 3, message: "Happy Navratri!", icon: Paintbrush, primaryColor: '330 80% 60%', accentColor: '280 90% 75%' },
  { name: "Dussehra", month: 10, day: 12, message: "Happy Dussehra!", icon: Sun, primaryColor: '45 86% 59%', accentColor: '6 79% 57%' },
  { name: "Karva Chauth", month: 10, day: 20, message: "Happy Karva Chauth!", icon: Heart, primaryColor: '0 84.2% 60.2%', accentColor: '0 90% 75%' },
  { name: "Halloween", month: 10, day: 31, message: "Happy Halloween!", icon: Ghost, primaryColor: '24.6 95% 53.1%', accentColor: '262.1 83.3% 57.8%' },
  { name: "Diwali", month: 11, day: 1, message: "Happy Diwali!", icon: Flame, primaryColor: '45 86% 59%', accentColor: '0 75% 45%' },
  { name: "Veterans Day", month: 11, day: 11, message: "Happy Veterans Day!", icon: Medal, primaryColor: '217.2 89.2% 47.1%', accentColor: '45 86% 59%' },
  { name: "Guru Nanak Jayanti", month: 11, day: 15, message: "Happy Guru Nanak Jayanti!", icon: Sun, primaryColor: '210 40% 80%', accentColor: '210 40% 96.1%' },
  { name: "Thanksgiving", month: 11, day: 28, message: "Happy Thanksgiving!", icon: Utensils, primaryColor: '24.6 95% 53.1%', accentColor: '30 95% 53.1%' },
  { name: "Christmas Day", month: 12, day: 25, message: "Merry Christmas!", icon: Gift, primaryColor: '142.1 76.2% 36.3%', accentColor: '0 62.8% 50.4%' },
  
  // --- 2025 Holidays ---
  { name: "New Year's Day", month: 1, day: 1, message: "Happy New Year!", icon: PartyPopper, primaryColor: '45 86% 59%', accentColor: '210 40% 80%' },
  { name: "Lohri", month: 1, day: 13, message: "Happy Lohri!", icon: Flame, primaryColor: '30 95% 53.1%', accentColor: '45 86% 59%' },
  { name: "Martin Luther King Jr. Day", month: 1, day: 20, message: "Honor & Remember.", icon: Users, primaryColor: '220 13% 28%', accentColor: '210 40% 96.1%' },
  { name: "Valentine's Day", month: 2, day: 14, message: "Happy Valentine's Day!", icon: Heart, primaryColor: '346.8 77.2% 49.8%', accentColor: '346.8 90% 65%' },
  { name: "Presidents' Day", month: 2, day: 17, message: "Happy Presidents' Day!", icon: Landmark, primaryColor: '221.2 83.2% 53.3%', accentColor: '0 84.2% 60.2%' },
  { name: "St. Patrick's Day", month: 3, day: 17, message: "Happy St. Patrick's Day!", icon: Clover, primaryColor: '142.1 76.2% 36.3%', accentColor: '142.1 80% 50%' },
  { name: "Holi", month: 3, day: 14, message: "Happy Holi!", icon: Paintbrush, primaryColor: '320 86% 59%', accentColor: '210 90% 65%' },
  { name: "Vaisakhi", month: 4, day: 14, message: "Happy Vaisakhi!", icon: Palmtree, primaryColor: '45 86% 59%', accentColor: '142.1 76.2% 36.3%' },
  { name: "Easter", month: 4, day: 20, message: "Happy Easter!", icon: Rabbit, primaryColor: '300 80% 70%', accentColor: '280 90% 85%' },
  { name: "Memorial Day", month: 5, day: 26, message: "Remember and Honor.", icon: Medal, primaryColor: '217.2 89.2% 47.1%', accentColor: '0 84.2% 60.2%' },
  { name: "Juneteenth", month: 6, day: 19, message: "Happy Juneteenth!", icon: Star, primaryColor: '0 62.8% 50.4%', accentColor: '142.1 76.2% 36.3%' },
  { name: "US Independence Day", month: 7, day: 4, message: "Happy 4th of July!", icon: Flame, primaryColor: '221.2 83.2% 53.3%', accentColor: '0 84.2% 60.2%' },
  { name: "Raksha Bandhan", month: 8, day: 9, message: "Happy Raksha Bandhan!", icon: Hand, primaryColor: '300 80% 60%', accentColor: '320 90% 80%' },
  { name: "Labor Day", month: 9, day: 1, message: "Happy Labor Day!", icon: HardHat, primaryColor: '221.2 83.2% 53.3%', accentColor: '210 40% 96.1%' },
  { name: "Halloween", month: 10, day: 31, message: "Happy Halloween!", icon: Ghost, primaryColor: '24.6 95% 53.1%', accentColor: '262.1 83.3% 57.8%' },
  { name: "Diwali", month: 10, day: 21, message: "Happy Diwali!", icon: Flame, primaryColor: '45 86% 59%', accentColor: '0 75% 45%' },
  { name: "Veterans Day", month: 11, day: 11, message: "Happy Veterans Day!", icon: Medal, primaryColor: '217.2 89.2% 47.1%', accentColor: '45 86% 59%' },
  { name: "Thanksgiving", month: 11, day: 27, message: "Happy Thanksgiving!", icon: Utensils, primaryColor: '24.6 95% 53.1%', accentColor: '30 95% 53.1%' },
  { name: "Christmas Day", month: 12, day: 25, message: "Merry Christmas!", icon: Gift, primaryColor: '142.1 76.2% 36.3%', accentColor: '0 62.8% 50.4%' }
];
