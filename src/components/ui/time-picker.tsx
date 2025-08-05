
"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  const minuteRef = React.useRef<HTMLButtonElement>(null);
  const hourRef = React.useRef<HTMLButtonElement>(null);
  const periodRef = React.useRef<HTMLButtonElement>(null);

  const handleHourChange = (value: string) => {
    if (!date) return;
    const newDate = new Date(date);
    newDate.setHours(parseInt(value));
    setDate(newDate);
  };

  const handleMinuteChange = (value: string) => {
    if (!date) return;
    const newDate = new Date(date);
    newDate.setMinutes(parseInt(value));
    setDate(newDate);
  };

  const handlePeriodChange = (value: "am" | "pm") => {
    if (!date) return;
    const newDate = new Date(date);
    const hours = newDate.getHours();
    if (value === "pm" && hours < 12) {
      newDate.setHours(hours + 12);
    } else if (value === "am" && hours >= 12) {
      newDate.setHours(hours - 12);
    }
    setDate(newDate);
  };
  
  const hours = date ? date.getHours() : 0;
  const minutes = date ? date.getMinutes() : 0;
  const period = hours >= 12 ? 'pm' : 'am';
  const displayHours = (hours % 12) || 12;

  return (
    <div className="flex items-center gap-2">
      <div className="grid gap-1 text-center">
        <Select value={String(displayHours)} onValueChange={handleHourChange}>
            <SelectTrigger ref={hourRef} className="w-[70px] focus:ring-0">
                <SelectValue/>
            </SelectTrigger>
            <SelectContent>
                 {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                    <SelectItem key={hour} value={String(hour)}>{String(hour).padStart(2, '0')}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>
      <span>:</span>
      <div className="grid gap-1 text-center">
        <Select value={String(minutes).padStart(2, '0')} onValueChange={handleMinuteChange}>
            <SelectTrigger ref={minuteRef} className="w-[70px] focus:ring-0">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                    <SelectItem key={minute} value={String(minute).padStart(2, '0')}>{String(minute).padStart(2, '0')}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1 text-center">
        <Select value={period} onValueChange={(value: "am" | "pm") => handlePeriodChange(value)}>
            <SelectTrigger ref={periodRef} className="w-[70px] focus:ring-0">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="am">AM</SelectItem>
                <SelectItem value="pm">PM</SelectItem>
            </SelectContent>
        </Select>
      </div>
    </div>
  );
}
