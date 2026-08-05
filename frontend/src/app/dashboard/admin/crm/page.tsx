"use client";

import { useState } from 'react';
import { KanbanBoard } from '@/components/crm/kanban-board';
import { ClientTable } from '@/components/crm/client-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { getClients } from '@/lib/api/crm';

export default function CRMPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['clients', 'all-for-kanban'],
    queryFn: () => getClients({ limit: 100 }), // Get recent 100 for Kanban
  });

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">CRM Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage leads, track deals, and schedule follow-ups.</p>
        </div>
      </div>

      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="mb-6 h-12 w-full md:w-auto bg-muted/50 border border-border">
          <TabsTrigger value="pipeline" className="px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Pipeline (Kanban)
          </TabsTrigger>
          <TabsTrigger value="list" className="px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            List View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pipeline" className="mt-0">
          {isLoading ? (
            <div className="h-[600px] flex items-center justify-center text-muted-foreground">
              Loading Pipeline...
            </div>
          ) : (
            <KanbanBoard initialClients={data?.clients || []} />
          )}
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <ClientTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
