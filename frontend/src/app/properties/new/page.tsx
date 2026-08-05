"use client";

import { PropertyForm } from '@/components/crm/PropertyForm';
import { PublicNavbar } from '@/components/public/navbar';

export default function NewPropertyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <PublicNavbar />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2">List New Property</h1>
            <p className="text-muted-foreground text-lg">
              Add details and upload media for your new property listing.
            </p>
          </div>

          <PropertyForm />
        </div>
      </main>
    </div>
  );
}
