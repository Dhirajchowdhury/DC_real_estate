import { PublicNavbar } from '@/components/public/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Building, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <PublicNavbar />
      
      {/* Hero Section */}
      <main className="flex-1 pt-20">
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center px-6 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            {/* Soft gradient background matching Luxury Minimalism */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F9E8A2]/30 via-background to-[#B4E1EB]/30 dark:from-[#222831] dark:to-[#393E46] opacity-70" />
            
            {/* Optional abstract shapes could go here */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#95BDD7]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#F9E8A2]/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center z-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-6">
              Discover Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#78A4CB]">Perfect Sanctuary.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light">
              Experience the pinnacle of luxury real estate. Find curated homes, commercial spaces, and exclusive properties tailored for your lifestyle.
            </p>

            {/* Intelligent Search Bar */}
            <div className="bg-background/80 backdrop-blur-xl border border-border p-3 md:p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
              <div className="flex-1 flex items-center gap-3 px-4 bg-muted/50 rounded-xl h-12">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Location, City, or Zip" 
                  className="bg-transparent border-none outline-none w-full text-foreground"
                />
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 bg-muted/50 rounded-xl h-12">
                <Building className="w-5 h-5 text-muted-foreground" />
                <select className="bg-transparent border-none outline-none w-full text-foreground appearance-none">
                  <option value="">Property Type</option>
                  <option value="flat">Apartments</option>
                  <option value="villa">Villas</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <Button size="lg" className="h-12 px-8 rounded-xl gap-2 font-medium">
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="border-y border-border bg-muted/30">
          <div className="max-w-[1600px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/50">
            <div>
              <h3 className="text-4xl font-bold text-foreground mb-2">500+</h3>
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Premium Properties</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-foreground mb-2">$2B+</h3>
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Sales Volume</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-foreground mb-2">10k+</h3>
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Happy Clients</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-foreground mb-2">15</h3>
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Years Experience</p>
            </div>
          </div>
        </section>

        {/* Featured Properties Preview */}
        <section className="py-24 px-6 max-w-[1600px] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Exclusive Listings</h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                Explore our handpicked selection of premium properties, featuring breathtaking designs and prime locations.
              </p>
            </div>
            <Link href="/properties">
              <Button variant="outline" className="hidden md:flex gap-2 rounded-full px-6">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mock Property Cards for Initial View */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="relative h-64 overflow-hidden bg-muted">
                  {/* Next Image would go here, placeholder color for now */}
                  <div className="absolute inset-0 bg-[#95BDD7]/20 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-background/90 backdrop-blur text-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      For Sale
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white drop-shadow-md">$1,250,000</h3>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="text-xl font-bold mb-2">Modern Glass Villa</h4>
                  <p className="text-muted-foreground text-sm mb-4 flex-1">
                    123 Beverly Hills, Los Angeles, CA
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex gap-4 text-sm font-medium text-muted-foreground">
                      <span>4 Beds</span>
                      <span>3 Baths</span>
                      <span>2,500 sqft</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/properties">
              <Button variant="outline" className="w-full gap-2 rounded-xl h-12">
                View All Listings <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

      </main>
      
      <footer className="bg-muted py-12 border-t border-border">
        <div className="max-w-[1600px] mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} DC Real Estate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
