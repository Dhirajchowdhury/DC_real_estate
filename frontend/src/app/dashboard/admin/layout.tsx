"use client";

import { Sidebar } from '@/components/admin/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Dedicated Business OS Floating Sidebar */}
      <Sidebar />

      {/* Standalone Main Operating Content Area */}
      <div className="lg:pl-80 flex-1 transition-all duration-300 min-h-screen">
        <main className="w-full h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
