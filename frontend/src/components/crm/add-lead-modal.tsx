"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  Building,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api/apiClient';
import { useQueryClient } from '@tanstack/react-query';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddLeadModal({ isOpen, onClose }: AddLeadModalProps) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'WEBSITE',
    
    propertyType: 'FLAT',
    location: '',
    minBudget: '',
    maxBudget: '',
    bhk: '2 BHK',

    notes: '',
    score: 'WARM',
    priority: 'MEDIUM',

    followUpOption: '3',
    customFollowUpDate: '',
  });

  if (!isOpen) return null;

  // Duration Pills Calculation Options
  const followUpDurationOptions = [
    { label: 'Tomorrow (+1 Day)', days: 1 },
    { label: 'After 2 Days', days: 2 },
    { label: 'After 3 Days', days: 3 },
    { label: 'After 5 Days', days: 5 },
    { label: 'After 7 Days', days: 7 },
    { label: 'After 15 Days', days: 15 },
    { label: 'After 30 Days', days: 30 },
    { label: 'Custom Date', days: 0 },
  ];

  // Helper to compute calculated follow-up date
  const calculateFollowUpDate = () => {
    if (formData.followUpOption === 'custom') {
      return formData.customFollowUpDate || new Date().toISOString().split('T')[0];
    }
    const daysToAdd = parseInt(formData.followUpOption, 10) || 3;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    return targetDate.toISOString().split('T')[0];
  };

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.phone)) {
      setErrorMsg('Please provide client name and phone number.');
      return;
    }
    setErrorMsg('');
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setErrorMsg('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const followUpDate = calculateFollowUpDate();

      await apiClient.post('/crm/leads', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        source: formData.source,
        score: formData.score,
        priority: formData.priority,
        notes: formData.notes,
        preferredLocation: formData.location,
        propertyType: formData.propertyType,
        minBudget: formData.minBudget ? parseFloat(formData.minBudget) : undefined,
        maxBudget: formData.maxBudget ? parseFloat(formData.maxBudget) : undefined,
        nextFollowUpDate: followUpDate,
      });

      queryClient.invalidateQueries({ queryKey: ['crm-leads'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });

      setStep(1);
      onClose();
    } catch (err: any) {
      console.error('Lead creation error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to create lead. Please check input details.');
    } fontally: {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="clay-card w-full max-w-2xl bg-card overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-border/60 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-foreground">Add New Client Lead</h3>
              <p className="text-xs text-muted-foreground font-medium">Guided Fast Workflow • Step {step} of 5</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workflow Progress Bar */}
        <div className="w-full bg-muted h-1.5 flex">
          <div 
            className="bg-gradient-to-r from-primary to-blue-600 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Modal Body / Step Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {errorMsg && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Basic Details */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h4 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Basic Client Information
              </h4>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-muted-foreground">Full Name *</label>
                <Input
                  placeholder="e.g. Anish Malhotra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="clay-input h-11 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-muted-foreground">Phone Number *</label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="clay-input h-11 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-muted-foreground">Email Address (Optional)</label>
                  <Input
                    type="email"
                    placeholder="client@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="clay-input h-11 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-muted-foreground">Lead Source Channel</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="clay-input h-11 w-full px-3 text-xs font-bold text-foreground"
                >
                  <option value="WEBSITE">Website Direct Inquiry</option>
                  <option value="WHATSAPP">WhatsApp Business</option>
                  <option value="FACEBOOK">Facebook Ads</option>
                  <option value="INSTAGRAM">Instagram Campaign</option>
                  <option value="REFERRAL">Client Referral</option>
                  <option value="WALK_IN">Walk-In Customer</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Requirements */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h4 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" /> Property Requirements
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-muted-foreground">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="clay-input h-11 w-full px-3 text-xs font-bold text-foreground"
                  >
                    <option value="FLAT">Flat / Apartment</option>
                    <option value="VILLA">Luxury Villa</option>
                    <option value="HOUSE">Independent House</option>
                    <option value="COMMERCIAL">Commercial Office</option>
                    <option value="LAND">Plot / Land</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-muted-foreground">Configuration</label>
                  <select
                    value={formData.bhk}
                    onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                    className="clay-input h-11 w-full px-3 text-xs font-bold text-foreground"
                  >
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4+ BHK">4+ BHK / Penthouse</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-muted-foreground">Preferred Location / Locality</label>
                <Input
                  placeholder="e.g. Salt Lake Sector 5, New Town"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="clay-input h-11 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-muted-foreground">Min Budget (₹ Lakhs)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 50"
                    value={formData.minBudget}
                    onChange={(e) => setFormData({ ...formData, minBudget: e.target.value })}
                    className="clay-input h-11 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-muted-foreground">Max Budget (₹ Lakhs)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 120"
                    value={formData.maxBudget}
                    onChange={(e) => setFormData({ ...formData, maxBudget: e.target.value })}
                    className="clay-input h-11 text-xs font-bold"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Conversation Notes & Score */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h4 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" /> Conversation Notes & Lead Priority
              </h4>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-muted-foreground">Initial Conversation Remarks</label>
                <Textarea
                  rows={4}
                  placeholder="Record initial phone conversation notes, client urgency, specific requirements..."
                  value={formData.notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, notes: e.target.value })}
                  className="clay-input p-3 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-muted-foreground">Lead Score</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['COLD', 'WARM', 'HOT'].map((sc) => (
                      <button
                        key={sc}
                        type="button"
                        onClick={() => setFormData({ ...formData, score: sc })}
                        className={`py-2 rounded-xl text-xs font-black transition-all ${
                          formData.score === sc
                            ? sc === 'HOT' ? 'bg-red-500 text-white shadow-md' : sc === 'WARM' ? 'bg-amber-500 text-white shadow-md' : 'bg-blue-500 text-white shadow-md'
                            : 'clay-button-secondary text-muted-foreground'
                        }`}
                      >
                        {sc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-muted-foreground">Priority Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['LOW', 'MEDIUM', 'HIGH'].map((pr) => (
                      <button
                        key={pr}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: pr })}
                        className={`py-2 rounded-xl text-xs font-black transition-all ${
                          formData.priority === pr
                            ? 'bg-primary text-white shadow-md'
                            : 'clay-button-secondary text-muted-foreground'
                        }`}
                      >
                        {pr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SMART FOLLOW-UP SECTION */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <h4 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" /> When should we contact this client again?
                </h4>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  Select a duration. The system will automatically calculate the follow-up date and sync your calendar & reminders.
                </p>
              </div>

              {/* Quick Pills */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {followUpDurationOptions.map((opt) => {
                  const isSelected = opt.days === 0 
                    ? formData.followUpOption === 'custom'
                    : formData.followUpOption === String(opt.days);

                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, followUpOption: opt.days === 0 ? 'custom' : String(opt.days) })}
                      className={`p-3.5 rounded-2xl text-xs font-extrabold text-left transition-all ${
                        isSelected
                          ? 'clay-button-primary scale-[1.02]'
                          : 'clay-button-secondary text-foreground'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {formData.followUpOption === 'custom' && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-extrabold text-muted-foreground">Select Custom Date</label>
                  <Input
                    type="date"
                    value={formData.customFollowUpDate}
                    onChange={(e) => setFormData({ ...formData, customFollowUpDate: e.target.value })}
                    className="clay-input h-11 text-xs font-bold"
                  />
                </div>
              )}

              {/* Calculated Date Banner */}
              <div className="clay-card-flat p-4 bg-primary/10 border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <CalendarIcon className="w-4 h-4" /> Calculated Follow-Up Date:
                </div>
                <span className="text-sm font-black text-foreground underline decoration-primary decoration-2">
                  {calculateFollowUpDate()}
                </span>
              </div>
            </motion.div>
          )}

          {/* STEP 5: REVIEW & SAVE */}
          {step === 5 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h4 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" /> Review Lead Entry Summary
              </h4>

              <div className="clay-card-flat p-5 space-y-3 text-xs">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground font-bold">Client Name:</span>
                  <span className="font-black text-foreground">{formData.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground font-bold">Phone Number:</span>
                  <span className="font-black text-foreground">{formData.phone}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground font-bold">Property Type & BHK:</span>
                  <span className="font-black text-foreground">{formData.propertyType} • {formData.bhk}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground font-bold">Location & Budget:</span>
                  <span className="font-black text-foreground">{formData.location || 'Any'} (₹{formData.minBudget || '0'} - ₹{formData.maxBudget || 'Max'} Lakhs)</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground font-bold">Lead Score:</span>
                  <span className="font-black text-primary">{formData.score}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-muted-foreground font-bold">Next Follow-Up Date:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">{calculateFollowUpDate()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Modal Footer Buttons */}
        <div className="p-4 border-t border-border/60 flex items-center justify-between bg-muted/30">
          {step > 1 ? (
            <Button onClick={handleBack} variant="outline" className="clay-button-secondary gap-1.5 text-xs font-bold">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <Button onClick={handleNext} className="clay-button-primary gap-1.5 text-xs font-extrabold px-6 py-2.5">
              Next Step <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting} 
              className="clay-button-primary bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-extrabold px-6 py-2.5"
            >
              {isSubmitting ? 'Saving Lead...' : 'Complete & Launch Lead'}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
