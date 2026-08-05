"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { label: 'Buy', href: '/properties?type=buy' },
    { label: 'Rent', href: '/properties?type=rent' },
    { label: 'Commercial', href: '/properties?type=commercial' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-xl">
            DC
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">DC Real Estate</span>
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
          <Button variant="ghost" className="gap-2 text-sm font-medium">
            <User className="w-4 h-4" />
            Sign In
          </Button>
          <Button className="font-medium">Schedule Visit</Button>
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
              <Button variant="outline" className="w-full justify-center">Sign In</Button>
              <Button className="w-full justify-center">Schedule Visit</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
