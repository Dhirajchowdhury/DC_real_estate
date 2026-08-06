"use client";

import { PublicNavbar } from '@/components/public/navbar';
import { AuthCard } from '@/components/auth/AuthCard';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <PublicNavbar />
      <main className="flex-1 flex items-center justify-center pt-28 pb-16 px-4 md:px-6">
        <AuthCard initialMode="SIGN_UP" />
      </main>
    </div>
  );
}
