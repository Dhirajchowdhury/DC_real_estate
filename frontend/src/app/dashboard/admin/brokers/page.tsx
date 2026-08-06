"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  UserCheck, 
  Search, 
  Building, 
  Users, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Ban, 
  Trash2, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api/apiClient';
import { useAuthStore } from '@/store/useAuthStore';

export default function BrokerManagementPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const [searchTerm, setSearchTerm] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  // Fetch Brokers
  const { data: brokerData, isLoading } = useQuery({
    queryKey: ['admin-brokers'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/users');
      const allUsers = data.data.users || [];
      return allUsers.filter((u: any) => u.role === 'BROKER');
    }
  });

  const brokers = (brokerData || []).filter((b: any) => {
    const term = searchTerm.toLowerCase();
    return (
      b.firstName?.toLowerCase().includes(term) ||
      b.lastName?.toLowerCase().includes(term) ||
      b.companyName?.toLowerCase().includes(term) ||
      b.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 lg:px-10">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-black rounded-full mb-2 uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5" /> Broker Partner Network
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-foreground">
              Broker Network Directory
            </h1>
            <p className="text-muted-foreground text-sm font-medium mt-0.5">
              Monitor active broker partners, assigned inventory, sales metrics, and verification states.
            </p>
          </div>

          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <Input
                placeholder="Search by name, company, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="clay-input pl-10 h-11"
              />
            </div>
          </div>
        </div>

        {actionMsg && (
          <div className="clay-card p-4 bg-emerald-500/10 border-emerald-500/20 text-emerald-700 text-xs font-bold flex justify-between">
            <span>{actionMsg}</span>
            <button onClick={() => setActionMsg('')} className="underline">Dismiss</button>
          </div>
        )}

        {/* Directory Cards */}
        {isLoading ? (
          <div className="py-16 text-center text-muted-foreground font-bold">Loading broker directory...</div>
        ) : brokers.length === 0 ? (
          <div className="clay-card p-12 text-center text-muted-foreground">
            <UserCheck className="w-10 h-10 mx-auto mb-3 opacity-30 text-primary" />
            <p className="font-extrabold text-base text-foreground">No brokers found</p>
            <p className="text-xs mt-1">Try adjusting your search filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brokers.map((broker: any) => (
              <div key={broker.id} className="clay-card p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                        {broker.companyName?.[0] || broker.firstName?.[0] || 'B'}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-foreground">
                          {broker.companyName || `${broker.firstName} ${broker.lastName}`}
                        </h3>
                        <p className="text-xs text-primary font-bold">
                          Agent: {broker.firstName} {broker.lastName}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-black rounded-full uppercase">
                      Active Partner
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground pt-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-primary" /> {broker.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-primary" /> {broker.phone || '+91 98765 43210'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="clay-card-flat p-2.5 text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Assigned Leads</p>
                      <p className="text-lg font-black text-foreground">12</p>
                    </div>
                    <div className="clay-card-flat p-2.5 text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Listings</p>
                      <p className="text-lg font-black text-foreground">4</p>
                    </div>
                  </div>
                </div>

                {/* STRICT RBAC: Action buttons (Suspend / Delete) HIDDEN FOR STANDARD ADMINS */}
                {isSuperAdmin ? (
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Super Admin Controls
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="outline" className="text-amber-600 border-amber-200 text-xs font-bold px-2 py-1 h-8 rounded-xl">
                        <Ban className="w-3.5 h-3.5" /> Suspend
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 text-xs font-bold px-2 py-1 h-8 rounded-xl">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-border/60 text-right">
                    <Button size="sm" variant="outline" className="clay-button-secondary text-xs font-bold">
                      View Profile
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
