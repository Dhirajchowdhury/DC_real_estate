"use client";

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { updateClientStage } from '@/lib/api/crm';

// Mock Lead Stages based on our DB enum
const LEAD_STAGES = [
  'NEW_LEAD',
  'CONTACTED',
  'INTERESTED',
  'PROPERTY_SHARED',
  'SITE_VISIT_SCHEDULED',
  'SITE_VISIT_COMPLETED',
  'NEGOTIATION',
];

interface ClientLead {
  id: string;
  name: string;
  phone: string;
  stage: string;
  score: string;
}

const SortableClientCard = ({ client }: { client: ClientLead }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: client.id, data: client });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 cursor-grab active:cursor-grabbing">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-sm text-foreground">{client.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{client.phone}</p>
            </div>
            <Badge variant={client.score === 'HOT' ? 'destructive' : 'secondary'} className="text-[10px]">
              {client.score}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const KanbanColumn = ({ stage, clients }: { stage: string; clients: ClientLead[] }) => {
  const { setNodeRef } = useDroppable({
    id: stage,
  });

  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-80 bg-muted/30 p-4 rounded-xl border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-foreground capitalize">
          {stage.replace(/_/g, ' ')}
        </h3>
        <Badge variant="outline">{clients.length}</Badge>
      </div>
      
      <SortableContext items={clients.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div className="min-h-[200px]">
          {clients.map(client => (
            <SortableClientCard key={client.id} client={client} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export const KanbanBoard = ({ initialClients }: { initialClients: ClientLead[] }) => {
  const [clients, setClients] = useState<ClientLead[]>(initialClients);
  const [activeClient, setActiveClient] = useState<ClientLead | null>(null);

  useEffect(() => {
    setClients(initialClients);
  }, [initialClients]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    const client = clients.find(c => c.id === active.id);
    if (client) setActiveClient(client);
  };

  const handleDragEnd = async (event: any) => {
    setActiveClient(null);
    const { active, over } = event;

    if (!over) return;

    const activeClient = clients.find(c => c.id === active.id);
    const overStage = over.id; // Usually requires Droppable implementation for columns, simplified here

    if (activeClient && activeClient.stage !== overStage) {
      // Optimistic update
      setClients(prev => 
        prev.map(c => c.id === active.id ? { ...c, stage: overStage } : c)
      );

      try {
        await updateClientStage(activeClient.id, overStage);
      } catch (error) {
        // Revert on error
        setClients(initialClients);
      }
    }
  };

  const getClientsByStage = (stage: string) => clients.filter(c => c.stage === stage);

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
        {LEAD_STAGES.map(stage => (
          <KanbanColumn 
            key={stage} 
            stage={stage} 
            clients={getClientsByStage(stage)} 
          />
        ))}
      </div>
      
      <DragOverlay>
        {activeClient ? <SortableClientCard client={activeClient} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
