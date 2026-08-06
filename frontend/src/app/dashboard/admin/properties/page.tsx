"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Building, 
  Search, 
  Plus, 
  MapPin, 
  DollarSign, 
  Eye, 
  Edit, 
  Trash2, 
  ShieldAlert,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

export default function PropertyManagementPage() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Fetch Properties
  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const { data } = await apiClient.get('/properties');
      return data.data.properties || [];
    }
  });

  const properties = (propertiesData || []).filter((p: any) => {
    const matchesSearch = 
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'ALL' || p.propertyType === selectedType;
    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6 lg:px-10">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-black rounded-full mb-2 uppercase tracking-wider">
              <Building className="w-3.5 h-3.5" /> Real Estate Portfolio
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-foreground">
              Property Inventory Management
            </h1>
            <p className="text-muted-foreground text-sm font-medium mt-0.5">
              Review active listings, draft proposals, property pricing, and operational statuses.
            </p>
          </div>

          <Link href="/properties/new">
            <Button className="clay-button-primary gap-2 py-3 px-5 text-xs font-extrabold">
              <Plus className="w-4 h-4" /> Add New Property Listing
            </Button>
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="clay-card p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
            <Input
              placeholder="Search by title, city, area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="clay-input pl-10 h-11 text-xs font-bold"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="clay-input h-11 px-3 text-xs font-bold text-foreground"
            >
              <option value="ALL">All Property Types</option>
              <option value="FLAT">Flat / Apartment</option>
              <option value="VILLA">Luxury Villa</option>
              <option value="HOUSE">Independent House</option>
              <option value="COMMERCIAL">Commercial Space</option>
              <option value="LAND">Plot / Land</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="clay-input h-11 px-3 text-xs font-bold text-foreground"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="PENDING">Pending Approval</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        {/* Property Grid */}
        {isLoading ? (
          <div className="py-16 text-center text-muted-foreground font-bold">Loading property inventory...</div>
        ) : properties.length === 0 ? (
          <div className="clay-card p-12 text-center text-muted-foreground">
            <Building className="w-10 h-10 mx-auto mb-3 opacity-30 text-primary" />
            <p className="font-extrabold text-base text-foreground">No properties match your filter criteria</p>
            <p className="text-xs mt-1">Try clearing your search terms or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop: any) => (
              <div key={prop.id} className="clay-card p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase">
                      {prop.propertyType}
                    </span>
                    <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase ${
                      prop.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {prop.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-foreground line-clamp-1">{prop.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {prop.location}, {prop.city}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Price</span>
                      <p className="font-black text-foreground">₹{prop.price ? `${(prop.price / 100000).toFixed(1)} L` : 'On Request'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Area</span>
                      <p className="font-bold text-foreground">{prop.areaSqFt || '1450'} SqFt</p>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <Link href={`/properties/${prop.slug || prop.id}`}>
                    <Button size="sm" variant="outline" className="clay-button-secondary text-xs font-bold gap-1">
                      <Eye className="w-3.5 h-3.5" /> View
                    </Button>
                  </Link>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="clay-button-secondary text-xs font-bold gap-1">
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </Button>

                    {/* STRICT RBAC HIDING: Delete Property button ONLY visible to Super Admin */}
                    {isSuperAdmin && (
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 text-xs font-bold rounded-xl hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
