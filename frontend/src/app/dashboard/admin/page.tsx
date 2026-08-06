"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PublicNavbar } from '@/components/public/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Building, Users, FileText, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api/apiClient';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const [actionMsg, setActionMsg] = useState('');

  // Fetch admin dashboard stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/stats');
      return data.data;
    }
  });

  // Fetch pending broker requests
  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-brokers'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/broker-requests');
      return data.data;
    }
  });

  // Approve broker mutation
  const approveMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { data } = await apiClient.post(`/admin/broker-requests/${requestId}/approve`);
      return data;
    },
    onSuccess: (data) => {
      setActionMsg(data.message || 'Broker approved successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pending-brokers'] });
    }
  });

  const stats = statsData || {};
  const requests = pendingData?.requests || [];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <PublicNavbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" /> Super Admin Portal
              </div>
              <h1 className="text-4xl font-bold tracking-tight">System Overview</h1>
              <p className="text-muted-foreground text-lg mt-1">
                Monitor platform analytics, approve broker applications, and manage system operations.
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/dashboard/admin/crm">
                <Button variant="outline" className="gap-2">
                  <Users className="w-4 h-4" /> Go to CRM
                </Button>
              </Link>
              <Link href="/dashboard/admin/operations">
                <Button className="gap-2">
                  <Building className="w-4 h-4" /> Operations & Analytics
                </Button>
              </Link>
            </div>
          </div>

          {actionMsg && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-700 dark:text-green-400 rounded-xl text-sm font-medium">
              {actionMsg}
            </div>
          )}

          {/* Stats KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsLoading ? '...' : (stats.totalProperties ?? 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">{(stats.publishedProperties ?? 0)} Published</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{statsLoading ? '...' : (stats.pendingApprovals ?? stats.pendingBrokers ?? 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">Broker Applications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Brokers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsLoading ? '...' : (stats.activeBrokers ?? stats.totalBrokers ?? 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">Verified Agents</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unassigned Leads</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsLoading ? '...' : (stats.unassignedLeads ?? 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">Requires Allocation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-green-600">Operational</div>
                <p className="text-xs text-muted-foreground mt-1">All services online</p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Broker Approval Table */}
          <Card className="shadow-lg border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Pending Broker Registrations</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Review and approve new broker partner applications to grant platform access.
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {pendingLoading ? (
                <div className="py-12 text-center text-muted-foreground">Loading pending registrations...</div>
              ) : requests.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground border border-dashed rounded-xl">
                  <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-30 text-green-500" />
                  <p className="font-semibold text-lg">No pending applications</p>
                  <p className="text-sm">All broker registration requests have been reviewed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((req: any) => (
                    <div key={req.id} className="p-4 border rounded-xl flex items-center justify-between bg-card hover:bg-muted/30 transition-colors">
                      <div>
                        <h4 className="font-bold text-lg">{req.user?.firstName} {req.user?.lastName}</h4>
                        <p className="text-sm text-muted-foreground">{req.user?.email}</p>
                        <span className="inline-block mt-2 px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                          Pending Approval
                        </span>
                      </div>

                      <Button 
                        size="sm"
                        disabled={approveMutation.isPending}
                        onClick={() => approveMutation.mutate(req.id)}
                        className="gap-2 bg-green-600 hover:bg-green-700 text-white font-bold"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve Broker
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
