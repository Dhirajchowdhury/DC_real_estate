"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Lock, ArrowRight, RotateCw } from 'lucide-react';
import { apiClient } from '@/lib/api/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onShowPendingVerification: (user: any) => void;
}

export function SignInForm({ onSwitchToSignUp, onShowPendingVerification }: SignInFormProps) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { data } = await apiClient.post('/auth/login', { identifier, password });
      const { user, accessToken } = data.data;

      // Check if user is a Broker or Admin with pending verification status
      if (user.role === 'BROKER' && !user.isApproved) {
        onShowPendingVerification(user);
        return;
      }

      setAuth(user, accessToken);

      // Auto redirect based on role
      if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else if (user.role === 'BROKER') {
        router.push('/dashboard/broker');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setErrorMsg(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold"
        >
          {errorMsg}
        </motion.div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary" /> Username, Email, or Phone
          </label>
          <Input
            type="text"
            required
            placeholder="e.g. broker@dcrealestate.com or +919876543210"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="h-11 rounded-xl bg-background/50 border-border/80 focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-primary" /> Password
            </label>
            <button
              type="button"
              onClick={() => alert('Password reset link will be sent to your registered contact.')}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <Input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl bg-background/50 border-border/80 focus:border-primary"
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="w-full h-12 text-sm font-extrabold rounded-xl shadow-xl shadow-primary/20 bg-gradient-to-r from-primary to-amber-600 hover:opacity-95 transition-opacity gap-2"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <RotateCw className="w-4 h-4 animate-spin" /> Verifying Credentials...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Sign In to Account <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </Button>

      {/* Switch to Sign Up */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors"
        >
          New to DC Real Estate? <span className="text-primary font-bold underline">Create an Account</span>
        </button>
      </div>
    </form>
  );
}
