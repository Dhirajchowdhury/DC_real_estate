"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Clock, ShieldAlert, CheckCircle, FileText, UserCheck, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

interface VerificationPendingScreenProps {
  user?: any;
  onBackToSignIn?: () => void;
}

export function VerificationPendingScreen({ user, onBackToSignIn }: VerificationPendingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-6 md:p-8 text-center space-y-6"
    >
      <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20 shadow-inner">
        <Clock className="w-8 h-8 animate-pulse" />
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Application Under Verification
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
          Your Broker Partner application for <span className="font-semibold text-foreground">{user?.companyName || user?.firstName || 'your brokerage'}</span> has been received and is currently under Super Admin review.
        </p>
      </div>

      {/* Progress Timeline Tracker */}
      <div className="bg-card/50 border border-border p-4 rounded-2xl space-y-3 text-left max-w-md mx-auto">
        <div className="flex items-center gap-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Application & Phone OTP Verified</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-amber-500">
          <Clock className="w-4 h-4 shrink-0 animate-spin" />
          <span>Super Admin Review & Document Verification</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground/60">
          <UserCheck className="w-4 h-4 shrink-0" />
          <span>Broker Dashboard & Listing Access Granted</span>
        </div>
      </div>

      <div className="bg-muted/40 p-3.5 rounded-xl border border-border text-xs text-muted-foreground max-w-md mx-auto flex items-center gap-2 text-left">
        <Mail className="w-4 h-4 text-primary shrink-0" />
        <span>You will receive an SMS/Email notification as soon as your account is activated (estimated within 1-2 business hours).</span>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
        {onBackToSignIn ? (
          <Button variant="outline" onClick={onBackToSignIn} className="rounded-xl font-bold gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Button>
        ) : (
          <Link href="/">
            <Button variant="outline" className="rounded-xl font-bold gap-2">
              <ArrowLeft className="w-4 h-4" /> Return to Homepage
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
