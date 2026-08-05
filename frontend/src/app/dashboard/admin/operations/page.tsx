"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsDashboard } from '@/components/operations/analytics-dashboard';
import { CalendarView } from '@/components/operations/calendar-view';

export default function OperationsPage() {
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1600px] mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Business Operations</h1>
        <p className="text-muted-foreground mt-1">
          Monitor analytics, manage calendar appointments, and track team tasks.
        </p>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="mb-6 h-12 w-full md:w-auto bg-muted/50 border border-border">
          <TabsTrigger value="analytics" className="px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="calendar" className="px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Calendar
          </TabsTrigger>
          <TabsTrigger value="tasks" className="px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Tasks
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="mt-0">
          <AnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-0">
          <CalendarView />
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-0">
          <div className="h-[400px] flex items-center justify-center border rounded-xl bg-card">
            <p className="text-muted-foreground text-center">
              Task Management Board <br/>(Powered by dnd-kit)
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
