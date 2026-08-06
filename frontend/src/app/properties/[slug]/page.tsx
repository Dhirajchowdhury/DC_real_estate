"use client";

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { PublicNavbar } from '@/components/public/navbar';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, Calendar as CalendarIcon, Phone, Share2, Heart } from 'lucide-react';

export default function PropertyDetailsPage() {
  const params = useParams();
  const slug = params.slug;

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', slug],
    queryFn: async () => {
      const { data } = await apiClient.get(`/public/properties/${slug}`);
      return data.data.property;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center">Property not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <PublicNavbar />
      
      <main className="flex-1 pt-20">
        {/* Image Gallery Header */}
        <div className="h-[50vh] md:h-[70vh] bg-muted relative group overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <img 
              src={property.images[0].url} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#95BDD7]/30 to-background" />
          )}
          
          <div className="absolute top-6 right-6 flex gap-3">
            <Button variant="secondary" size="icon" className="rounded-full shadow-lg backdrop-blur-md bg-background/50 hover:bg-background/80">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="icon" className="rounded-full shadow-lg backdrop-blur-md bg-background/50 hover:bg-background/80 text-destructive">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
          {/* Main Details */}
          <div className="flex-1 space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {property.status}
                </span>
                <span className="bg-muted text-muted-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {property.type}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{property.title}</h1>
              <p className="flex items-center text-muted-foreground text-lg">
                <MapPin className="w-5 h-5 mr-2" />
                {property.location}, {property.city}, {property.state} {property.zipCode}
              </p>
            </div>

            <div className="flex flex-wrap gap-8 py-8 border-y border-border">
              {property.bedrooms && (
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-xl"><Bed className="w-6 h-6 text-foreground" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-bold text-lg">{property.bedrooms}</p>
                  </div>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-xl"><Bath className="w-6 h-6 text-foreground" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-bold text-lg">{property.bathrooms}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-muted rounded-xl"><Square className="w-6 h-6 text-foreground" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Square Area</p>
                  <p className="font-bold text-lg">{property.areaSqFt} sqft</p>
                </div>
              </div>
              {property.yearBuilt && (
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-xl"><CalendarIcon className="w-6 h-6 text-foreground" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Year Built</p>
                    <p className="font-bold text-lg">{property.yearBuilt}</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">About this property</h3>
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                <p>{property.description}</p>
              </div>
            </div>

            {/* Amenities Section */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity: any) => (
                    <div key={amenity.id} className="flex items-center gap-3 bg-muted/50 p-4 rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-medium">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-28 bg-card border border-border rounded-2xl p-8 shadow-xl">
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-2">Asking Price</p>
              <h2 className="text-4xl font-bold mb-8">${Number(property.price).toLocaleString()}</h2>
              
              <div className="space-y-4">
                <Button size="lg" className="w-full h-14 text-lg">Schedule a Site Visit</Button>
                <Button size="lg" variant="outline" className="w-full h-14 text-lg gap-2">
                  <Phone className="w-5 h-5" /> Contact Broker
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h4 className="font-bold mb-4">Submit an Inquiry</h4>
                <form className="space-y-4">
                  <input type="text" placeholder="Your Name" className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border outline-none focus:border-primary" />
                  <input type="email" placeholder="Your Email" className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border outline-none focus:border-primary" />
                  <input type="tel" placeholder="Your Phone" className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border outline-none focus:border-primary" />
                  <Button className="w-full h-12">Submit</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
