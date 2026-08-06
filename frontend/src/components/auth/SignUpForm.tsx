"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RoleSelector, RoleType } from './RoleSelector';
import { Phone, Lock, User, Building, Mail, ArrowRight, RotateCw } from 'lucide-react';
import { apiClient } from '@/lib/api/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface SignUpFormProps {
  onSuccessBrokerPending: (data: any) => void;
}

export function SignUpForm({ onSuccessBrokerPending }: SignUpFormProps) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [role, setRole] = useState<RoleType>('CUSTOMER');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      if (role === 'CUSTOMER') {
        const { data } = await apiClient.post('/auth/register-customer', {
          username: username || undefined,
          phone,
          password,
          email: email || undefined,
        });

        const { user, accessToken } = data.data;
        setAuth(user, accessToken);
        router.push('/');
      } else {
        // BROKER Signup
        const { data } = await apiClient.post('/auth/register-broker', {
          username: username || undefined,
          companyName: companyName || 'Brokerage Firm',
          phone,
          password,
          email: email || undefined,
        });

        onSuccessBrokerPending(data.data || data);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMsg(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Role Selection */}
      <RoleSelector selectedRole={role} onSelectRole={setRole} />

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold"
        >
          {errorMsg}
        </motion.div>
      )}

      {/* Dynamic Staggered Fields */}
      <motion.div
        key={role}
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary" /> Username / Name
          </label>
          <Input
            type="text"
            required
            placeholder="e.g. Dhiraj Chowdhury"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-11 rounded-xl bg-background/50 border-border/80 focus:border-primary"
          />
        </div>

        {/* Company Name (Broker only) */}
        {role === 'BROKER' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-1.5"
          >
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-primary" /> Company / Brokerage Name
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. Apex Realty Developers"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="h-11 rounded-xl bg-background/50 border-border/80 focus:border-primary"
            />
          </motion.div>
        )}

        {/* Mandatory Phone Section */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-primary" /> Phone Number (Mandatory)
          </label>
          <Input
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-11 rounded-xl bg-background/50 border-border/80 focus:border-primary"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" /> Password
          </label>
          <Input
            type="password"
            required
            minLength={6}
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl bg-background/50 border-border/80 focus:border-primary"
          />
        </div>

        {/* Optional Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email Address
            </span>
            <span className="text-[11px] text-muted-foreground/70 font-normal">(Optional)</span>
          </label>
          <Input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl bg-background/50 border-border/80"
          />
        </div>
      </motion.div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="w-full h-12 text-sm font-extrabold rounded-xl shadow-xl shadow-primary/20 bg-gradient-to-r from-primary to-amber-600 hover:opacity-95 transition-opacity gap-2"
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <RotateCw className="w-4 h-4 animate-spin" /> Creating Account...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Complete Registration <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </Button>
    </form>
  );
}
