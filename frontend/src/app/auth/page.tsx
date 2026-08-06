"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PublicNavbar } from '@/components/public/navbar';
import { AuthCard, AuthMode } from '@/components/auth/AuthCard';

function AuthPageContent() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');
  
  let initialMode: AuthMode = 'SIGN_UP';
  if (modeParam === 'signin' || modeParam === 'login') {
    initialMode = 'SIGN_IN';
  } else if (modeParam === 'pending') {
    initialMode = 'PENDING_VERIFICATION';
  }

  return <AuthCard initialMode={initialMode} />;
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center pt-28 pb-16 px-4 md:px-6">
        <Suspense fallback={<div className="text-center py-20 text-muted-foreground">Loading Authentication Portal...</div>}>
          <AuthPageContent />
        </Suspense>
      </main>
    </div>
  );
}
