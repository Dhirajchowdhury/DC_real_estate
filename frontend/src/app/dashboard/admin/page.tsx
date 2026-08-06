"use client";

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Building, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Plus, 
  Calendar, 
  DollarSign, 
  ArrowUpRight, 
  Sparkles,
  UserCheck,
  Search,
  MessageSquare,
  Activity,
  TrendingUp,
  UserPlus,
  FolderPlus,
  CheckSquare,
  Briefcase,
  Award,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  PhoneCall,
  User,
  ArrowDownRight,
  TrendingDown,
  Clock3,
  Target,
  Flame,
  Check,
  Heart,
  BarChart3,
  Filter,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { apiClient } from '@/lib/api/apiClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AddLeadModal } from '@/components/crm/add-lead-modal';

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

  // Timeframe switcher state for Advanced Analytics Zone
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'Week' | 'Month' | 'Quarter' | 'Year'>('Month');
  const [funnelTimeframe, setFunnelTimeframe] = useState<'Week' | 'Month' | 'Quarter' | 'Year'>('Month');

  // Active Month State for Mini Calendar
  const [currentDate, setCurrentDate] = useState(new Date());

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || (user?.role !== 'SUPER_ADMIN' && user?.role !== 'ADMIN'))) {
      router.push('/auth');
    }
  }, [mounted, isAuthenticated, user, router]);

  // Dynamic Time-Based Greeting Helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 22) return 'Good Evening';
    return 'Good Night';
  };

  // Fetch admin dashboard stats
  const { data: statsData, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/stats');
      return data.data;
    },
    enabled: mounted && isAuthenticated && (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN'),
  });

  // Fetch pending broker requests (Super Admin only)
  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-brokers'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/broker-requests');
      return data.data;
    },
    enabled: mounted && isAuthenticated && isSuperAdmin,
  });

  // Approve broker mutation
  const approveMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { data } = await apiClient.post(`/admin/broker-requests/${requestId}/approve`);
      return data;
    },
    onSuccess: (data) => {
      setActionMsg(data.message || 'Broker approved successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pending-brokers'] });
    }
  });

  // Reject broker mutation
  const rejectMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { data } = await apiClient.post(`/admin/broker-requests/${requestId}/reject`);
      return data;
    },
    onSuccess: (data) => {
      setActionMsg(data.message || 'Broker application rejected.');
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pending-brokers'] });
    }
  });

  if (!mounted || !isAuthenticated || (user?.role !== 'SUPER_ADMIN' && user?.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="clay-card p-10 max-w-md text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-primary mx-auto animate-pulse" />
          <h2 className="text-2xl font-black">Authenticating Access...</h2>
          <p className="text-muted-foreground text-sm font-medium">
            Verifying your Brokerage OS session credentials.
          </p>
          <Button onClick={() => router.push('/auth')} className="clay-button-primary w-full py-3 font-bold">
            Sign In to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const stats = statsData || {};
  const requests = pendingData?.requests || [];

  // Sparkline Mock Data (7-day trend arrays)
  const sparklineLeads = [{ v: 20 }, { v: 24 }, { v: 22 }, { v: 28 }, { v: 26 }, { v: 30 }, { v: 32 }];
  const sparklineFollowups = [{ v: 60 }, { v: 68 }, { v: 72 }, { v: 75 }, { v: 80 }, { v: 84 }, { v: 87 }];
  const sparklineOverdue = [{ v: 22 }, { v: 20 }, { v: 19 }, { v: 18 }, { v: 17 }, { v: 16 }, { v: 15 }];
  const sparklineVisits = [{ v: 4 }, { v: 5 }, { v: 6 }, { v: 5 }, { v: 7 }, { v: 7 }, { v: 8 }];
  const sparklineBookings = [{ v: 1 }, { v: 2 }, { v: 2 }, { v: 3 }, { v: 3 }, { v: 4 }, { v: 4 }];
  const sparklineRevenue = [{ v: 30 }, { v: 32 }, { v: 36 }, { v: 40 }, { v: 42 }, { v: 45 }, { v: 48 }];

  // Donut Chart Data (Enlarged +35%)
  const leadSourceData = [
    { name: 'Website Direct', value: 76, color: '#3B82F6', percentage: '35%' },
    { name: 'WhatsApp Business', value: 52, color: '#60A5FA', percentage: '24%' },
    { name: 'Client Referral', value: 38, color: '#93C5FD', percentage: '18%' },
    { name: 'Phone Calls', value: 28, color: '#2563EB', percentage: '13%' },
    { name: 'Other Channels', value: 20, color: '#CBD5E1', percentage: '10%' },
  ];

  // Lead Funnel Data (With Conversion & Drop-off)
  const leadFunnelData = [
    { stage: 'New Leads', count: 214, percentage: 100, conv: '100%', drop: '0%', trend: '↑ 14%' },
    { stage: 'Contacted', count: 156, percentage: 73, conv: '73%', drop: '27%', trend: '↑ 10%' },
    { stage: 'Interested', count: 98, percentage: 46, conv: '62%', drop: '38%', trend: '↑ 8%' },
    { stage: 'Site Visit', count: 54, percentage: 25, conv: '55%', drop: '45%', trend: '↑ 12%' },
    { stage: 'Negotiation', count: 28, percentage: 13, conv: '52%', drop: '48%', trend: '↑ 5%' },
    { stage: 'Booked', count: 15, percentage: 7, conv: '54%', drop: '46%', trend: '↑ 15%' },
    { stage: 'Sold', count: 9, percentage: 4, conv: '60%', drop: '40%', trend: '↑ 20%' },
  ];

  // Zone 2 Advanced Analytics Charts Mock Data
  const leadGrowthData = [
    { month: 'Jan', leads: 120, revenue: 24, website: 80, manual: 40 },
    { month: 'Feb', leads: 145, revenue: 30, website: 95, manual: 50 },
    { month: 'Mar', leads: 170, revenue: 35, website: 110, manual: 60 },
    { month: 'Apr', leads: 190, revenue: 41, website: 125, manual: 65 },
    { month: 'May', leads: 214, revenue: 48, website: 140, manual: 74 },
  ];

  const brokerPerformanceData = [
    { name: 'Rahul Sen', deals: 32, revenue: 18.4 },
    { name: 'Anita Das', deals: 28, revenue: 13.2 },
    { name: 'Sourav Ghosh', deals: 21, revenue: 9.8 },
    { name: 'Pooja Mehta', deals: 17, revenue: 7.6 },
    { name: 'Vivek Sharma', deals: 15, revenue: 6.4 },
  ];

  // Calendar Days Helper
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const overdueFollowUps: any[] = [];

  return (
    <div className="min-h-screen bg-background pt-6 lg:pt-8 pb-12 px-4 lg:px-6">
      <div className="max-w-[1800px] mx-auto space-y-5">
        
        {/* 1. DOMINANT PERSONALIZED GREETING HEADER (+20-25% SCALE FOR IMMEDIATE FIRST-FOLD ANCHOR) */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-3 border-b border-border/60">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight flex items-center gap-2">
              Welcome back, {user?.firstName || 'Dhiraj'} 👋
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm font-extrabold text-muted-foreground">
              <span className="text-foreground font-black">Today you have:</span>
              <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-xs lg:text-sm">📞 12 Follow Ups</span>
              <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-xl text-xs lg:text-sm">🚗 2 Site Visits</span>
              <span className="px-3 py-1.5 bg-amber-500/10 text-amber-600 rounded-xl text-xs lg:text-sm">🔥 1 High Priority Client</span>
              <span className="px-3 py-1.5 bg-blue-500/10 text-blue-600 rounded-xl text-xs lg:text-sm">🎯 Target: ₹3,00,000 (42%)</span>
            </div>
          </div>

          {/* Horizontally Aligned Taller Search & Date Bar */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto self-start lg:self-center">
            <div className="relative flex-1 lg:w-80">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <Input
                placeholder="Search leads, properties, brokers, clients... (Ctrl + K)"
                className="clay-input pl-10 h-11 text-xs font-bold w-full"
              />
              <span className="absolute right-3 top-3 px-1.5 py-0.5 bg-muted text-muted-foreground text-[10px] font-extrabold rounded">
                ⌘K
              </span>
            </div>

            <div className="clay-card-flat px-4 py-2.5 text-xs font-extrabold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* 2. EXPANDED TODAY'S MISSION BANNER (+15% HEIGHT / +20% PADDING WITH 16-20px RHYTHM GAP) */}
        <div className="clay-card p-4 px-6 bg-gradient-to-r from-blue-600 via-primary to-accent text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md rounded-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg flex-shrink-0">
              🎯
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-white/90">Today's Mission</span>
              <p className="text-xs lg:text-sm text-white/95 font-extrabold flex flex-wrap gap-x-5 gap-y-1 mt-0.5">
                <span>• Call 12 clients</span>
                <span>• Attend 2 site visits</span>
                <span>• Follow up with 3 hot leads</span>
                <span>• Revenue target: ₹3,00,000 (42% achieved)</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-black bg-white/15 px-3.5 py-1.5 rounded-xl border border-white/20 flex-shrink-0 self-start md:self-auto">
            <Flame className="w-4 h-4 text-amber-300 fill-amber-300" /> Focus Mode Active
          </div>
        </div>

        {actionMsg && (
          <div className="clay-card p-3 bg-emerald-500/10 border-emerald-500/20 text-emerald-700 text-xs font-bold flex justify-between">
            <span>{actionMsg}</span>
            <button onClick={() => setActionMsg('')} className="underline">Dismiss</button>
          </div>
        )}

        {/* ----------------------------------------------------------------------------------- */}
        {/* ZONE 1: OPERATIONS (TOP SECTION WITH +25% ENLARGED KPI VALUES & SWAPPED TOP ROW)  */}
        {/* ----------------------------------------------------------------------------------- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl lg:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" /> Operations & Daily Command
            </h2>
            <span className="text-xs font-extrabold text-muted-foreground">Zone 1 • Operational Summary</span>
          </div>

          {/* 6 TOP KPI CARDS (+25% LARGER NUMBERS MATCHING DESIGN GOAL) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* Card 1: New Leads */}
            <div className="clay-card p-4 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-extrabold uppercase tracking-wider">New Leads</span>
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <p className="text-3xl lg:text-4xl font-black text-foreground">32</p>
                <span className="text-xs font-black text-emerald-600">↑ 12%</span>
              </div>
              <div className="h-7 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineLeads}>
                    <Area type="monotone" dataKey="v" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Card 2: Pending Follow-Ups */}
            <div className="clay-card p-4 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-extrabold uppercase tracking-wider">Pending Follows</span>
                <Phone className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <p className="text-3xl lg:text-4xl font-black text-foreground">87</p>
                <span className="text-xs font-black text-amber-600">↑ 8%</span>
              </div>
              <div className="h-7 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineFollowups}>
                    <Area type="monotone" dataKey="v" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Card 3: Overdue Follow-Ups */}
            <div className="clay-card p-4 space-y-1 border-red-500/20 bg-red-500/5">
              <div className="flex items-center justify-between text-red-500">
                <span className="text-xs font-extrabold uppercase tracking-wider">Overdue</span>
                <Clock3 className="w-4 h-4 text-red-500" />
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <p className="text-3xl lg:text-4xl font-black text-red-600">15</p>
                <span className="text-xs font-black text-red-600">↓ 5%</span>
              </div>
              <div className="h-7 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineOverdue}>
                    <Area type="monotone" dataKey="v" stroke="#EF4444" fill="#EF4444" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Card 4: Today's Site Visits */}
            <div className="clay-card p-4 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-extrabold uppercase tracking-wider">Today's Visits</span>
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <p className="text-3xl lg:text-4xl font-black text-foreground">8</p>
                <span className="text-xs font-black text-emerald-600">↑ 14%</span>
              </div>
              <div className="h-7 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineVisits}>
                    <Area type="monotone" dataKey="v" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Card 5: New Bookings */}
            <div className="clay-card p-4 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-extrabold uppercase tracking-wider">New Bookings</span>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <p className="text-3xl lg:text-4xl font-black text-foreground">4</p>
                <span className="text-xs font-black text-emerald-600">↑ 33%</span>
              </div>
              <div className="h-7 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineBookings}>
                    <Area type="monotone" dataKey="v" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Card 6: Revenue (May) */}
            <div className="clay-card p-4 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-extrabold uppercase tracking-wider">Revenue</span>
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <p className="text-xl lg:text-2xl font-black text-foreground truncate">₹ 48.75 L</p>
                <span className="text-xs font-black text-emerald-600">↑ 18%</span>
              </div>
              <div className="h-7 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineRevenue}>
                    <Area type="monotone" dataKey="v" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* SWAPPED TOP ROW: [QUICK ACTIONS] ➔ [ENLARGED LEAD FUNNEL] ➔ [ENLARGED DONUT CHART] */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* LEFT: COMPACT QUICK ACTIONS UTILITY GRID (3 COLS - PROPORTIONALLY EXPANDED) */}
            <div className="lg:col-span-3 clay-card p-5 h-full flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <h3 className="text-base font-extrabold text-foreground">Quick Actions</h3>
                <span className="text-xs font-bold text-primary cursor-pointer hover:underline">View All</span>
              </div>

              <div className="grid grid-cols-2 gap-3 flex-1">
                <button
                  onClick={() => setIsAddLeadOpen(true)}
                  className="clay-button-secondary p-3 flex flex-col items-center justify-center gap-1.5 hover:scale-[1.03] transition-transform"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-foreground">Add Lead</span>
                </button>

                <Link
                  href="/properties/new"
                  className="clay-button-secondary p-3 flex flex-col items-center justify-center gap-1.5 hover:scale-[1.03] transition-transform"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-foreground">Add Property</span>
                </Link>

                <Link
                  href="/dashboard/admin/brokers"
                  className="clay-button-secondary p-3 flex flex-col items-center justify-center gap-1.5 hover:scale-[1.03] transition-transform"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-foreground">Add Broker</span>
                </Link>

                <button
                  onClick={() => setIsAddLeadOpen(true)}
                  className="clay-button-secondary p-3 flex flex-col items-center justify-center gap-1.5 hover:scale-[1.03] transition-transform"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-foreground">Add Client</span>
                </button>

                <Link
                  href="/dashboard/admin/operations?tab=calendar"
                  className="clay-button-secondary p-3 flex flex-col items-center justify-center gap-1.5 hover:scale-[1.03] transition-transform"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-foreground">Schedule Visit</span>
                </Link>

                <Link
                  href="/dashboard/admin/operations?tab=tasks"
                  className="clay-button-secondary p-3 flex flex-col items-center justify-center gap-1.5 hover:scale-[1.03] transition-transform"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-foreground">Add Task</span>
                </Link>

                <Link
                  href="/dashboard/admin/crm"
                  className="clay-button-secondary p-3 flex flex-col items-center justify-center gap-1.5 hover:scale-[1.03] transition-transform"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-foreground">Add Deal</span>
                </Link>

                <button
                  onClick={() => setIsAddLeadOpen(true)}
                  className="clay-button-secondary p-3 flex flex-col items-center justify-center gap-1.5 hover:scale-[1.03] transition-transform"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-foreground">New Follow Up</span>
                </button>
              </div>
            </div>

            {/* CENTER: ENLARGED LEAD CONVERSION FUNNEL (5 COLS - HERO ANALYTICS WIDGET) */}
            <div className="lg:col-span-5 clay-card p-5 h-full flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <div>
                  <h3 className="text-base font-extrabold text-foreground">Lead Conversion Funnel</h3>
                  <p className="text-xs text-muted-foreground font-medium">Stage progression, conversion rate, & drop-off metrics</p>
                </div>
                
                <div className="flex items-center gap-1 bg-muted p-1 rounded-xl text-[10px] font-black">
                  {(['Week', 'Month', 'Quarter', 'Year'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setFunnelTimeframe(tf)}
                      className={`px-2 py-0.5 rounded-lg transition-all ${
                        funnelTimeframe === tf ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3.5 flex-1 flex flex-col justify-around">
                {leadFunnelData.map((fn) => (
                  <div key={fn.stage} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-foreground flex items-center gap-2">
                        {fn.stage}
                        <span className="text-[10px] text-emerald-600 font-extrabold">{fn.trend}</span>
                      </span>
                      <span className="font-black text-foreground text-xs">{fn.count} Leads</span>
                    </div>
                    <div className="w-full bg-muted h-3.5 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="bg-gradient-to-r from-primary to-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${fn.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold px-0.5">
                      <span>Conversion: <strong className="text-foreground">{fn.conv}</strong></span>
                      <span>Drop-off: <strong className="text-red-500">{fn.drop}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: 35% LARGER LEADS OVERVIEW DONUT CHART (4 COLS) */}
            <div className="lg:col-span-4 clay-card p-5 h-full flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <div>
                  <h3 className="text-base font-extrabold text-foreground">Leads Overview</h3>
                  <p className="text-xs text-muted-foreground font-medium">Source acquisition distribution</p>
                </div>
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  82% Conv.
                </span>
              </div>

              <div className="flex flex-col items-center gap-3 flex-1 justify-center">
                <div className="w-48 h-48 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadSourceData}
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {leadSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute text-center">
                    <p className="text-2xl font-black text-foreground">214</p>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Total Leads</p>
                  </div>
                </div>

                <div className="w-full space-y-1.5 text-xs font-bold pt-1">
                  {leadSourceData.map((src) => (
                    <div key={src.name} className="flex items-center justify-between p-1.5 clay-card-flat">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: src.color }} />
                        <span className="text-foreground text-xs">{src.name}</span>
                      </div>
                      <span className="text-foreground text-xs font-black">{src.value} ({src.percentage})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ----------------------------------------------------------------------------------- */}
        {/* ZONE 2: ADVANCED ANALYTICS (MIDDLE SECTION - SPANNING FULL DASHBOARD WIDTH)          */}
        {/* ----------------------------------------------------------------------------------- */}
        <div className="space-y-4 pt-4 border-t border-border/60">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase">
                <BarChart3 className="w-3 h-3" /> Zone 2 • Enterprise Business Intelligence
              </div>
              <h2 className="text-xl lg:text-2xl font-black text-foreground tracking-tight mt-0.5">
                Advanced Analytics & Performance Intelligence
              </h2>
            </div>

            {/* Global Analytics Timeframe Controls */}
            <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl text-xs font-black self-start md:self-auto">
              {(['Week', 'Month', 'Quarter', 'Year'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setAnalyticsTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    analyticsTimeframe === tf ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  {tf} View
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Chart 1: Lead Growth & Revenue Trend Area Chart (7 Cols) */}
            <div className="lg:col-span-7 clay-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-foreground">Lead Growth & Monthly Revenue Trend</h3>
                  <p className="text-xs text-muted-foreground">Historical comparison of incoming leads vs revenue growth</p>
                </div>
                <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  ↑ 18% Revenue Trend
                </span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={leadGrowthData}>
                    <defs>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" textAnchor="end" tick={{ fontSize: 12, fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 12, fontWeight: 700 }} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="leads" name="Total Leads" stroke="#3B82F6" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="revenue" name="Revenue (₹ Lakhs)" stroke="#10B981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Broker Performance Bar Chart Comparison (5 Cols) */}
            <div className="lg:col-span-5 clay-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-foreground">Broker Performance Comparison</h3>
                  <p className="text-xs text-muted-foreground">Deals closed & total revenue by agent</p>
                </div>
                <Link href="/dashboard/admin/brokers" className="text-xs font-bold text-primary hover:underline">
                  Full Report ➔
                </Link>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={brokerPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 11, fontWeight: 700 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="deals" name="Deals Closed" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="revenue" name="Revenue (₹ Lakhs)" fill="#10B981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

        {/* ----------------------------------------------------------------------------------- */}
        {/* ZONE 3: LIVE ACTIVITY & WORKLOAD (BOTTOM SECTION WITH RIGHT PRODUCTIVITY STACK)     */}
        {/* ----------------------------------------------------------------------------------- */}
        <div className="space-y-4 pt-4 border-t border-border/60">
          <div className="flex items-center justify-between">
            <h2 className="text-xl lg:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Live Operations & Workload Feed
            </h2>
            <span className="text-xs font-extrabold text-muted-foreground">Zone 3 • Activity & Workload</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* LEFT WORKLOAD & FEED (8 COLS) */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* ROW A: RECENT LEADS QUEUE + TOP BROKERS LEADERBOARD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Recent Leads Queue (Enlarged Text & Stage Badges) */}
                <div className="clay-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-foreground">Recent Leads Queue</h3>
                    <Link href="/dashboard/admin/crm" className="text-xs font-bold text-primary hover:underline">View CRM ➔</Link>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { name: 'Vikram Mehta', loc: 'New Town, Kolkata', stage: 'New', time: '10m ago', color: 'bg-blue-100 text-blue-800' },
                      { name: 'Ananya Gupta', loc: 'Salt Lake, Kolkata', stage: 'Contacted', time: '30m ago', color: 'bg-emerald-100 text-emerald-800' },
                      { name: 'Rohit Verma', loc: 'Rajarhat, Kolkata', stage: 'Interested', time: '1h ago', color: 'bg-amber-100 text-amber-800' },
                      { name: 'Sneha Banerjee', loc: 'Ballygunge, Kolkata', stage: 'New', time: '2h ago', color: 'bg-blue-100 text-blue-800' },
                      { name: 'Karan Malhotra', loc: 'Behala, Kolkata', stage: 'Interested', time: '3h ago', color: 'bg-amber-100 text-amber-800' },
                    ].map((ld, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 clay-card-flat">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-xs">
                            {ld.name[0]}
                          </div>
                          <div>
                            <p className="font-extrabold text-foreground text-xs">{ld.name}</p>
                            <p className="text-[10px] text-muted-foreground">{ld.loc}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 text-[9px] font-black rounded-md ${ld.color}`}>
                            {ld.stage}
                          </span>
                          <p className="text-[9px] text-muted-foreground mt-0.5">{ld.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Brokers Leaderboard */}
                <div className="clay-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-foreground">Top Brokers</h3>
                    <Link href="/dashboard/admin/brokers" className="text-xs font-bold text-primary hover:underline">View All ➔</Link>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { rank: 1, name: 'Rahul Sen', deals: 32, rev: '₹ 18.4 Lakhs', badge: '🥇' },
                      { rank: 2, name: 'Anita Das', deals: 28, rev: '₹ 13.2 Lakhs', badge: '🥈' },
                      { rank: 3, name: 'Sourav Ghosh', deals: 21, rev: '₹ 9.8 Lakhs', badge: '🥉' },
                      { rank: 4, name: 'Pooja Mehta', deals: 17, rev: '₹ 7.6 Lakhs', badge: '4' },
                      { rank: 5, name: 'Vivek Sharma', deals: 15, rev: '₹ 6.4 Lakhs', badge: '5' },
                    ].map((br) => (
                      <div key={br.rank} className="flex items-center justify-between text-xs p-2 clay-card-flat">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 text-center font-black text-muted-foreground text-xs">{br.badge}</span>
                          <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-600 font-black flex items-center justify-center text-xs">
                            {br.name[0]}
                          </div>
                          <div>
                            <p className="font-extrabold text-foreground text-xs">{br.name}</p>
                            <p className="text-[10px] text-muted-foreground">{br.deals} Deals Closed</p>
                          </div>
                        </div>
                        <span className="font-black text-foreground text-xs">{br.rev}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ROW B: BUSINESS HEALTH + HUMANIZED LIVE FEED + EXPANDED PRODUCTIVITY */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Business Health Indicator Widget */}
                <div className="clay-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-emerald-500" /> Business Health
                    </h3>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 font-black text-[10px] rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> 🟢 Excellent
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 clay-card-flat">
                      <span className="text-muted-foreground font-bold">Lead Conversion:</span>
                      <span className="font-black text-emerald-600">82% (Target 75%)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 clay-card-flat">
                      <span className="text-muted-foreground font-bold">Revenue Growth:</span>
                      <span className="font-black text-primary">↑ Strong (+18%)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 clay-card-flat">
                      <span className="text-muted-foreground font-bold">Broker Activity:</span>
                      <span className="font-black text-foreground">Healthy (5 Active)</span>
                    </div>
                  </div>
                </div>

                {/* Live Humanized Activity Feed */}
                <div className="clay-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-primary" /> Live Activity Feed
                    </h3>
                    <span className="text-[9px] font-bold text-emerald-600">Realtime</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      { text: 'Rahul Sharma added by Dhiraj', time: '5 mins ago' },
                      { text: 'Luxury Apartment published in Salt Lake', time: '2 mins ago' },
                      { text: 'kompo services verified by Super Admin', time: '45 mins ago' },
                      { text: 'Rahul Kapoor completed site visit at Royal Palms', time: '1 hour ago' },
                    ].map((act, idx) => (
                      <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-muted/40 transition-colors">
                        <p className="font-extrabold text-foreground text-xs truncate flex-1">{act.text}</p>
                        <span className="text-[10px] text-muted-foreground ml-2">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personal Productivity Tracker */}
                <div className="clay-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-500" /> Productivity
                    </h3>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 font-black text-[10px] rounded-full">
                      92% Score
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="clay-card-flat p-2 space-y-0.5">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Today's Focus</span>
                      <p className="text-xs font-black text-foreground truncate">High Priority Calls</p>
                    </div>
                    <div className="clay-card-flat p-2 space-y-0.5">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Response Time</span>
                      <p className="text-xs font-black text-primary">42 mins avg</p>
                    </div>
                    <div className="clay-card-flat p-2 space-y-0.5">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Visits Scheduled</span>
                      <p className="text-xs font-black text-foreground">4 Visits</p>
                    </div>
                    <div className="clay-card-flat p-2 space-y-0.5">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Revenue Goal</span>
                      <p className="text-xs font-black text-emerald-600">68% Achieved</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUPER ADMIN APPROVAL QUEUE (STRICT RBAC PROTECTION) */}
              {isSuperAdmin && (
                <div className="clay-card p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <div>
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 text-[9px] font-black rounded-full uppercase">
                        Super Admin Exclusive
                      </span>
                      <h3 className="text-base font-black text-foreground mt-0.5">Pending Broker Registrations</h3>
                    </div>
                  </div>

                  {pendingLoading ? (
                    <p className="text-xs text-muted-foreground font-medium">Loading pending applications...</p>
                  ) : requests.length === 0 ? (
                    <p className="text-xs text-muted-foreground font-medium">All broker registration applications have been reviewed.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {requests.map((req: any) => (
                        <div key={req.id} className="clay-card-flat p-3.5 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-extrabold text-foreground">{req.user?.companyName || `${req.user?.firstName} ${req.user?.lastName}`}</p>
                            <p className="text-[10px] text-muted-foreground">{req.user?.email}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => rejectMutation.mutate(req.id)} className="text-[11px] font-bold text-red-600 h-7 px-2">
                              Reject
                            </Button>
                            <Button size="sm" onClick={() => approveMutation.mutate(req.id)} className="clay-button-primary text-[11px] font-bold h-7 px-3">
                              Approve
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT PRODUCTIVITY COLUMN (4 COLS) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* TODAY'S FOLLOW UPS */}
              <div className="clay-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-foreground">Today's Follow Ups</h3>
                  <Link href="/dashboard/admin/crm" className="text-xs font-bold text-primary hover:underline">View All</Link>
                </div>

                <div className="space-y-2.5 text-xs">
                  {[
                    { initials: 'RK', name: 'Rahul Kapoor', sub: 'Call after 2 days', time: '11:30 AM', color: 'bg-blue-100 text-blue-800' },
                    { initials: 'PS', name: 'Priya Sharma', sub: 'Call after 3 days', time: '01:00 PM', color: 'bg-amber-100 text-amber-800' },
                    { initials: 'AS', name: 'Amit Singh', sub: 'Call after 5 days', time: '04:00 PM', color: 'bg-emerald-100 text-emerald-800' },
                    { initials: 'NJ', name: 'Neha Joshi', sub: 'Call after 1 day', time: '06:00 PM', color: 'bg-purple-100 text-purple-800' },
                  ].map((fl, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 clay-card-flat">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full font-black text-[10px] flex items-center justify-center ${fl.color}`}>
                          {fl.initials}
                        </div>
                        <div>
                          <p className="font-extrabold text-foreground text-xs">{fl.name}</p>
                          <p className="text-[10px] text-muted-foreground">{fl.sub}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-muted-foreground">{fl.time}</span>
                        <button className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                          <PhoneCall className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MINI CALENDAR WIDGET */}
              <div className="clay-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-foreground">Calendar</h3>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                      className="p-1 rounded-lg hover:bg-muted"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <span className="text-xs font-bold text-foreground">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button 
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                      className="p-1 rounded-lg hover:bg-muted"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 text-center text-[9px] font-extrabold text-muted-foreground">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>

                <div className="grid grid-cols-7 text-center text-xs font-bold gap-y-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <span key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: days }).map((_, i) => {
                    const dayNum = i + 1;
                    const isToday = dayNum === 15;
                    return (
                      <button
                        key={dayNum}
                        className={`h-6 w-6 mx-auto rounded-full flex items-center justify-center text-[11px] transition-all ${
                          isToday 
                            ? 'bg-primary text-white shadow-md shadow-primary/30 font-black' 
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* OVERDUE FOLLOW UPS */}
              <div className="clay-card p-4 space-y-3 border-red-500/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-red-600 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-500" /> Overdue Follow Ups
                  </h3>
                  <Link href="/dashboard/admin/crm" className="text-xs font-bold text-red-600 hover:underline">View All</Link>
                </div>

                {overdueFollowUps.length === 0 ? (
                  <div className="p-4 clay-card-flat bg-emerald-500/10 border-emerald-500/20 text-center space-y-1">
                    <p className="text-lg">🎉</p>
                    <p className="font-extrabold text-xs text-emerald-700 dark:text-emerald-300">No overdue follow-ups today!</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Great job keeping up with your client queue.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 text-xs">
                    {overdueFollowUps.map((ov, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 clay-card-flat bg-red-500/5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-red-500/10 text-red-600 font-black flex items-center justify-center text-xs">
                            {ov.name[0]}
                          </div>
                          <div>
                            <p className="font-extrabold text-foreground text-xs">{ov.name}</p>
                            <p className="text-[10px] font-bold text-red-600">{ov.days}</p>
                          </div>
                        </div>
                        <button className="w-6 h-6 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                          <PhoneCall className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Signature Add Lead Workflow Modal */}
      <AddLeadModal isOpen={isAddLeadOpen} onClose={() => setIsAddLeadOpen(false)} />
    </div>
  );
}
