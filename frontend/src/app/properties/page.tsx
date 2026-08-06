"use client";

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { useSearchParams, useRouter } from 'next/navigation';
import { PublicNavbar } from '@/components/public/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';
import { useState, Suspense } from 'react';

function PropertyDiscoveryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCity = searchParams.get('city') || '';
  const initialType = searchParams.get('type') || '';
  
  const [city, setCity] = useState(initialCity);
  const [type, setType] = useState(initialType);

  const { data, isLoading } = useQuery({
    queryKey: ['public-properties', searchParams.toString()],
    queryFn: async () => {
      const { data } = await apiClient.get('/public/properties', {
        params: {
          city: searchParams.get('city'),
          type: searchParams.get('type'),
        }
      });
      return data.data;
    }
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (type && type !== 'all') params.set('type', type);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <PublicNavbar />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-[1600px] mx-auto px-6">
          
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Discover Properties</h1>
            
            {/* Filter Bar */}
            <div className="bg-card border border-border p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search city or location..." 
                  className="pl-10 h-12 w-full bg-background"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={type} onValueChange={(value) => setType(value || '')}>
                  <SelectTrigger className="h-12 bg-background">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="FLAT">Apartments</SelectItem>
                    <SelectItem value="VILLA">Villas</SelectItem>
                    <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                    <SelectItem value="LAND">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button size="lg" className="h-12 w-full md:w-auto px-8" onClick={handleSearch}>
                <Filter className="w-4 h-4 mr-2" />
                Filter Results
              </Button>
            </div>
          </div>

          {/* Property Grid */}
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Loading properties...
            </div>
          ) : data?.properties?.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground border border-dashed rounded-xl">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-xl font-medium">No properties found</p>
              <p className="text-sm mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.properties?.map((property: any) => (
                <Link href={`/properties/${property.slug}`} key={property.id} className="group">
                  <div className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                    <div className="relative h-60 bg-muted overflow-hidden">
                      {property.images && property.images[0] ? (
                        <img 
                          src={property.images[0].url} 
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#95BDD7]/20 group-hover:scale-105 transition-transform duration-700" />
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-background/90 backdrop-blur text-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          {property.status}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-2xl font-bold text-white drop-shadow-md">
                          ${Number(property.price).toLocaleString()}
                        </h3>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h4 className="text-lg font-bold mb-1 line-clamp-1">{property.title}</h4>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-1 flex-1">
                        {property.location}, {property.city}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-border/50 text-sm font-medium text-muted-foreground">
                        {property.bedrooms && <span>{property.bedrooms} Beds</span>}
                        {property.bathrooms && <span>{property.bathrooms} Baths</span>}
                        <span>{property.areaSqFt} sqft</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function PropertyDiscoveryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center">Loading properties...</div>}>
      <PropertyDiscoveryContent />
    </Suspense>
  );
}
