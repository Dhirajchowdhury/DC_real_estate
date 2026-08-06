"use client";

import { PublicNavbar } from '@/components/public/navbar';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Award, Users, Building, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <PublicNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Hero */}
        <section className="relative py-20 px-6 max-w-[1400px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <Award className="w-4 h-4" /> Leading Real Estate Management Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto mb-6">
            Redefining Brokerage & Premium Property Management
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            DC Real Estate empowers professional brokers with state-of-the-art listing management, client AI analytics, and legal transparency for high-value properties.
          </p>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-card/50 py-16 px-6">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold text-primary mb-2">₹250+ Cr</p>
              <p className="text-muted-foreground text-sm font-medium">Property Volume Managed</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-primary mb-2">500+</p>
              <p className="text-muted-foreground text-sm font-medium">Verified Properties</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-primary mb-2">120+</p>
              <p className="text-muted-foreground text-sm font-medium">Partner Brokers</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-primary mb-2">99.8%</p>
              <p className="text-muted-foreground text-sm font-medium">Client Satisfaction</p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-6 max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Core Pillars</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built specifically for modern brokerages, agents, and discerning buyers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-4 border-border">
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Verified Ownership & Listings</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Every property on DC Real Estate is direct from partner brokers with strict document verification and legal compliance checks.
                </p>
              </CardContent>
            </Card>

            <Card className="p-4 border-border">
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Smart Broker Suite</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Comprehensive CRM, lead stage tracking, automated site visit scheduling, and AI-driven buyer matching tools.
                </p>
              </CardContent>
            </Card>

            <Card className="p-4 border-border">
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Super Admin Oversight</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Platform owner controls broker approvals, listing audits, system security, and analytics to maintain quality standards.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 max-w-[1400px] mx-auto">
          <div className="bg-primary text-primary-foreground rounded-3xl p-12 text-center relative overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Partner With Us?</h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Join DC Real Estate as a verified broker and publish your premium listings to thousands of active buyers.
            </p>
            <Link href="/register" className="inline-block bg-background text-foreground font-bold px-8 py-4 rounded-xl hover:bg-background/90 transition-colors">
              Apply as Partner Broker
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
