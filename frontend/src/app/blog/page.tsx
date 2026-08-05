"use client";

import { PublicNavbar } from '@/components/public/navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  const blogs = [
    {
      id: 1,
      title: "The Future of Luxury Real Estate in 2026",
      excerpt: "Explore the emerging trends shaping high-end properties, from smart home automation to sustainable architecture.",
      date: "August 12, 2026",
      readTime: "5 min read",
      category: "Market Trends"
    },
    {
      id: 2,
      title: "A First-Time Buyer's Guide to Mortgages",
      excerpt: "Everything you need to know about securing the best interest rates and understanding EMI calculations.",
      date: "July 28, 2026",
      readTime: "8 min read",
      category: "Guides"
    },
    {
      id: 3,
      title: "Top 5 Neighborhoods for Real Estate Investment",
      excerpt: "Discover the most lucrative areas for property investment offering the highest ROI and rental yields.",
      date: "July 15, 2026",
      readTime: "6 min read",
      category: "Investment"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <PublicNavbar />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Real Estate Insights</h1>
            <p className="text-xl text-muted-foreground">
              Expert advice, market trends, and guides for buying, selling, and investing in premium properties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Card key={blog.id} className="group overflow-hidden border-border hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 bg-muted overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-[#95BDD7]/20 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-background/90 backdrop-blur text-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {blog.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-xs text-muted-foreground mb-4 gap-4">
                    <span>{blog.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {blog.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{blog.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <Button variant="ghost" className="p-0 hover:bg-transparent text-primary font-medium gap-2">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
