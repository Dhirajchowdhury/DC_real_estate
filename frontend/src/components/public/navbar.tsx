"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Shield, Building, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { label: 'Buy', href: '/properties?type=FLAT' },
    { label: 'Rent', href: '/properties?type=HOUSE' },
    { label: 'Commercial', href: '/properties?type=COMMERCIAL' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-gradient-to-tr from-primary to-amber-500 rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            DC
          </div>
          <span className="font-extrabold text-xl tracking-tight hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            DC Real Estate
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {mounted && isAuthenticated && user ? (
            <>
              {user.role === 'SUPER_ADMIN' && (
                <Link href="/dashboard/admin">
                  <Button variant="outline" className="font-medium gap-2 rounded-xl">
                    <Shield className="w-4 h-4 text-amber-500" /> Admin Dashboard
                  </Button>
                </Link>
              )}
              {user.role === 'BROKER' && (
                <Link href="/dashboard/broker">
                  <Button variant="outline" className="font-medium gap-2 rounded-xl">
                    <Building className="w-4 h-4 text-primary" /> Broker Dashboard
                  </Button>
                </Link>
              )}
              <div className="text-xs font-semibold px-3.5 py-1.5 bg-muted/80 rounded-full border border-border flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {user.firstName} ({user.role})
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted" title="Logout" onClick={handleLogout}>
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </Button>
            </>
          ) : mounted ? (
            <Link href="/auth">
              <Button size="lg" className="gap-2 text-sm font-bold shadow-lg shadow-primary/20 rounded-xl px-5 bg-gradient-to-r from-primary to-amber-600 hover:opacity-95 transition-opacity">
                <User className="w-4 h-4" />
                Sign In / Sign Up
              </Button>
            </Link>
          ) : null}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-0 right-0 bg-background border-b border-border p-6 shadow-xl md:hidden flex flex-col gap-4"
          >
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="text-lg font-medium py-2 border-b border-border/50"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              {mounted && isAuthenticated && user ? (
                <>
                  <Button variant="outline" className="w-full justify-center rounded-xl" onClick={() => { setIsOpen(false); router.push('/dashboard/admin'); }}>Dashboard</Button>
                  <Button variant="destructive" className="w-full justify-center rounded-xl" onClick={() => { setIsOpen(false); handleLogout(); }}>Logout</Button>
                </>
              ) : (
                <Link href="/auth" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-center rounded-xl font-bold bg-primary text-primary-foreground">
                    Sign In / Sign Up
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
