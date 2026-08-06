"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignUpForm } from './SignUpForm';
import { SignInForm } from './SignInForm';
import { VerificationPendingScreen } from './VerificationPendingScreen';
import { Sparkles, ShieldCheck } from 'lucide-react';

export type AuthMode = 'SIGN_UP' | 'SIGN_IN' | 'PENDING_VERIFICATION';

interface AuthCardProps {
  initialMode?: AuthMode;
}

export function AuthCard({ initialMode = 'SIGN_UP' }: AuthCardProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [pendingUser, setPendingUser] = useState<any>(null);

  const handleBrokerPendingSuccess = (data: any) => {
    setPendingUser(data.user || data);
    setMode('PENDING_VERIFICATION');
  };

  const handleShowPendingVerification = (user: any) => {
    setPendingUser(user);
    setMode('PENDING_VERIFICATION');
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Floating Ambient Background Glow */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphism / Claymorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative bg-card/80 backdrop-blur-2xl border border-border/80 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-10"
      >
        {/* Top Header & Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Enterprise Access Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            {mode === 'SIGN_UP' && 'Create Your Account'}
            {mode === 'SIGN_IN' && 'Welcome Back'}
            {mode === 'PENDING_VERIFICATION' && 'Verification Status'}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-2">
            {mode === 'SIGN_UP' && 'Select your role to access DC Real Estate tools'}
            {mode === 'SIGN_IN' && 'Sign in to access your dashboard and listings'}
            {mode === 'PENDING_VERIFICATION' && 'Review your broker partner activation progress'}
          </p>
        </div>

        {/* Tab Switcher (Only visible during Sign Up / Sign In) */}
        {mode !== 'PENDING_VERIFICATION' && (
          <div className="relative flex bg-muted/60 p-1.5 rounded-2xl border border-border/60 mb-8">
            {/* Sliding Active Tab Background */}
            <motion.div
              className="absolute top-1.5 bottom-1.5 rounded-xl bg-card shadow-lg shadow-black/5"
              initial={false}
              animate={{
                left: mode === 'SIGN_UP' ? '0.375rem' : '50%',
                width: 'calc(50% - 0.375rem)',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />

            <button
              type="button"
              onClick={() => setMode('SIGN_UP')}
              className={`relative z-10 flex-1 py-3 text-sm font-extrabold transition-colors duration-200 text-center ${
                mode === 'SIGN_UP' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>

            <button
              type="button"
              onClick={() => setMode('SIGN_IN')}
              className={`relative z-10 flex-1 py-3 text-sm font-extrabold transition-colors duration-200 text-center ${
                mode === 'SIGN_IN' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
          </div>
        )}

        {/* Content Body with Animated Transitions */}
        <AnimatePresence mode="wait">
          {mode === 'SIGN_UP' && (
            <motion.div
              key="sign-up-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <SignUpForm onSuccessBrokerPending={handleBrokerPendingSuccess} />
            </motion.div>
          )}

          {mode === 'SIGN_IN' && (
            <motion.div
              key="sign-in-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <SignInForm
                onSwitchToSignUp={() => setMode('SIGN_UP')}
                onShowPendingVerification={handleShowPendingVerification}
              />
            </motion.div>
          )}

          {mode === 'PENDING_VERIFICATION' && (
            <motion.div
              key="pending-tab"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <VerificationPendingScreen
                user={pendingUser}
                onBackToSignIn={() => setMode('SIGN_IN')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
