"use client";

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, FileText, Activity, Users, FilePlus } from 'lucide-react';
import { PublicNavbar } from '@/components/public/navbar';
import { apiClient } from '@/lib/api/apiClient';
import Link from 'next/link';

export default function OwnerPortal() {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['broker-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/broker/stats');
      return data.data;
    }
  });

  const stats = statsData || {};

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <PublicNavbar />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Broker Portal</h1>
              <p className="text-muted-foreground text-lg">
                Manage your properties, track leads, and access legal documents.
              </p>
            </div>
            <Link href="/properties/new">
              <Button className="gap-2">
                <Building className="w-4 h-4" />
                List New Property
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Properties</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsLoading ? '...' : (stats.totalProperties ?? 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">{(stats.publishedProperties ?? 0)} Published</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assigned Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsLoading ? '...' : (stats.activeLeads ?? 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">Active Pipeline</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Site Visits (This Week)</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground mt-1">3 scheduled tomorrow</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents Vault</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14 Files</div>
                <p className="text-xs text-muted-foreground mt-1">All verified</p>
              </CardContent>
            </Card>
          </div>

          {/* Properties Performance Table / Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-2xl font-bold">Property Performance</h3>
              
              <div className="bg-card border border-border rounded-xl p-6 flex gap-6 hover:shadow-md transition-shadow">
                <div className="w-48 h-32 bg-muted rounded-lg" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-bold mb-1">Luxury Villa at Palm Meadows</h4>
                    <p className="text-muted-foreground text-sm mb-4">Whitefield, Bangalore</p>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-primary">₹8.5 Cr</span>
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">Active Listing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Vault Preview */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Recent Documents</h3>
                <Button variant="ghost" size="icon"><FilePlus className="w-5 h-5"/></Button>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 divide-y divide-border">
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded"><FileText className="w-4 h-4"/></div>
                    <div>
                      <p className="text-sm font-medium">Sale Deed (Draft).pdf</p>
                      <p className="text-xs text-muted-foreground">Added 2 days ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded"><FileText className="w-4 h-4"/></div>
                    <div>
                      <p className="text-sm font-medium">NOC Clearance.pdf</p>
                      <p className="text-xs text-muted-foreground">Added last week</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
