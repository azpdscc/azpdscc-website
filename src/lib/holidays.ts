
import { PartyPopper, Flame, Gift, Heart, Ghost, Medal, Paintbrush, Hand, Sun, Palmtree } from 'lucide-react';
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
  // New Year's: Gold to Silver
  { name: "New Year's Day", month: 1, day: 1, message: "Happy New Year!", icon: PartyPopper, primaryColor: '45 86% 59%', accentColor: '210 40% 80%' },
  // Lohri
  { name: "Lohri", month: 1, day: 13, message: "Happy Lohri!", icon: Flame, primaryColor: '30 95% 53.1%', accentColor: '45 86% 59%' },
  // Valentine's: Deep Red to Pink
  { name: "Valentine's Day", month: 2, day: 14, message: "Happy Valentine's Day!", icon: Heart, primaryColor: '346.8 77.2% 49.8%', accentColor: '346.8 90% 65%' },
  // Holi: Vibrant Pink to Blue (2025 date)
  { name: "Holi", month: 3, day: 14, message: "Happy Holi!", icon: Paintbrush, primaryColor: '320 86% 59%', accentColor: '210 90% 65%' },
  // Vaisakhi
  { name: "Vaisakhi", month: 4, day: 13, message: "Happy Vaisakhi!", icon: Palmtree, primaryColor: '45 86% 59%', accentColor: '142.1 76.2% 36.3%' },
  // US Independence Day: Blue to Red
  { name: "US Independence Day", month: 7, day: 4, message: "Happy 4th of July!", icon: Flame, primaryColor: '221.2 83.2% 53.3%', accentColor: '0 84.2% 60.2%' },
  // Indian Independence Day: Saffron to Green
  { name: "Indian Independence Day", month: 8, day: 15, message: "Happy Indian Independence Day!", icon: Medal, primaryColor: '30 95% 53.1%', accentColor: '142.1 76.2% 36.3%' },
  // Raksha Bandhan (2024)
  { name: "Raksha Bandhan", month: 8, day: 19, message: "Happy Raksha Bandhan!", icon: Hand, primaryColor: '300 80% 60%', accentColor: '320 90% 80%' },
  // Dussehra (2024)
  { name: "Dussehra", month: 10, day: 12, message: "Happy Dussehra!", icon: Sun, primaryColor: '45 86% 59%', accentColor: '6 79% 57%' },
  // Halloween: Orange to Dark Purple
  { name: "Halloween", month: 10, day: 31, message: "Happy Halloween!", icon: Ghost, primaryColor: '24.6 95% 53.1%', accentColor: '262.1 83.3% 57.8%' },
  // Diwali: Gold to Deep Red (2024 date)
  { name: "Diwali", month: 11, day: 2, message: "Happy Diwali!", icon: Flame, primaryColor: '45 86% 59%', accentColor: '0 75% 45%' },
  // Veterans Day: Navy Blue to Gold
  { name: "Veterans Day", month: 11, day: 11, message: "Happy Veterans Day!", icon: Medal, primaryColor: '217.2 89.2% 47.1%', accentColor: '45 86% 59%' },
  // Christmas: Green to Red
  { name: "Christmas Day", month: 12, day: 25, message: "Merry Christmas!", icon: Gift, primaryColor: '142.1 76.2% 36.3%', accentColor: '0 62.8% 50.4%' },
];
