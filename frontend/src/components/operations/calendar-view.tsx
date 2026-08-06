"use client";

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export function CalendarView() {
  const { data, isLoading } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      const { data } = await apiClient.get('/calendar', {
        params: { start: new Date('2026-01-01'), end: new Date('2026-12-31') }
      }).catch(() => ({ data: { data: { events: [] } } }));
      
      return data.data.events.map((e: any) => ({
        ...e,
        start: new Date(e.startTime),
        end: new Date(e.endTime)
      }));
    }
  });

  if (isLoading) {
    return <div className="h-[600px] flex items-center justify-center">Loading Calendar...</div>;
  }

  return (
    <div className="h-[700px] bg-card p-6 rounded-xl border border-border shadow-sm">
      <Calendar
        localizer={localizer}
        events={data || []}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        className="font-sans"
      />
    </div>
  );
}
