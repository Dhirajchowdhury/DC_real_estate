"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Building, 
  Clock, 
  DollarSign, 
  Calendar, 
  FileText, 
  Tag, 
  Heart, 
  CheckCircle2, 
  MessageSquare,
  BadgeCheck,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

interface ClientProfileModalProps {
  client: any;
  isOpen: boolean;
  onClose: () => void;
}

export function ClientProfileModal({ client, isOpen, onClose }: ClientProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'documents' | 'properties'>('overview');
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="clay-card w-full max-w-4xl bg-card overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-border/60 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md">
              {client.name?.[0] || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-2xl text-foreground">{client.name}</h3>
                <span className="px-2.5 py-0.5 bg-primary/10 text-primary font-bold text-xs rounded-full uppercase">
                  {client.stage || 'NEW LEAD'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">Digital Diary Client Profile • ID: #{client.id?.slice(0, 8)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* STRICT RBAC: Delete Client button ONLY visible to Super Admin */}
            {isSuperAdmin && (
              <Button size="sm" variant="outline" className="text-red-600 border-red-200 text-xs font-bold rounded-xl hover:bg-red-50">
                Delete Record
              </Button>
            )}
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border/60 bg-muted/40 px-6 gap-6">
          {[
            { id: 'overview', label: 'Client Overview' },
            { id: 'timeline', label: 'Activity Timeline' },
            { id: 'documents', label: 'Document Vault' },
            { id: 'properties', label: 'Favorited Properties' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 text-xs font-extrabold transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Info */}
              <div className="clay-card-flat p-5 space-y-3">
                <h4 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Contact & Personal Preferences
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 text-primary" /> Phone: <span className="font-bold text-foreground">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 text-primary" /> Email: <span className="font-bold text-foreground">{client.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" /> Call Preference: <span className="font-bold text-foreground">Evening (5 PM - 8 PM)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BadgeCheck className="w-3.5 h-3.5 text-primary" /> Decision Maker: <span className="font-bold text-foreground">Self & Spouse</span>
                  </div>
                </div>
              </div>

              {/* Requirement Summary */}
              <div className="clay-card-flat p-5 space-y-3">
                <h4 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <Building className="w-4 h-4 text-primary" /> Property Requirements & Budget
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Property Type:</span>
                    <span className="font-bold text-foreground">{client.propertyType || '3 BHK Apartment'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Preferred Areas:</span>
                    <span className="font-bold text-foreground">{client.preferredLocation || 'New Town, Salt Lake'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Budget Range:</span>
                    <span className="font-bold text-emerald-600">₹{client.minBudget || '60'} - ₹{client.maxBudget || '120'} Lakhs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Home Loan Status:</span>
                    <span className="font-bold text-blue-600">Pre-Approved (HDFC Bank)</span>
                  </div>
                </div>
              </div>

              {/* Conversation Diary Notes */}
              <div className="md:col-span-2 clay-card-flat p-5 space-y-2">
                <h4 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Conversation Notes & Diary
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {client.notes || "Client is looking for a ready-to-move 3 BHK apartment with balcony views. Prefers high floor with dedicated covered car parking. Wants possession before Diwali."}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {[
                { title: 'Site Visit Completed', date: 'Yesterday at 4:30 PM', desc: 'Visited Royal Palms Apartment 3BHK unit 402 with broker.' },
                { title: 'Phone Call Discussion', date: '3 days ago', desc: 'Discussed pricing and negotiation terms with buyer.' },
                { title: 'Lead Registered', date: '5 days ago', desc: 'Lead captured from Website Direct Inquiry form.' }
              ].map((item, idx) => (
                <div key={idx} className="clay-card-flat p-4 flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-foreground">{item.title}</h5>
                    <p className="text-[11px] text-muted-foreground">{item.date}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-3">
              <div className="clay-card-flat p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-bold text-xs text-foreground">Aadhaar_KYC_Verification.pdf</p>
                    <p className="text-[10px] text-muted-foreground">Uploaded on Aug 02, 2026 • 1.4 MB</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs font-bold">Download</Button>
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="space-y-3">
              <div className="clay-card-flat p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <div>
                    <p className="font-bold text-xs text-foreground">Skyline Heights 3BHK Luxury Flat</p>
                    <p className="text-[10px] text-muted-foreground">New Town, Kolkata • ₹95 Lakhs</p>
                  </div>
                </div>
                <Button size="sm" className="clay-button-primary text-xs font-bold">View Property</Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
