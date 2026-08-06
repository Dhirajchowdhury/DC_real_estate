"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Home,
  LayoutDashboard,
  Users,
  Building,
  UserCheck,
  Calendar,
  CheckSquare,
  FileText,
  PieChart,
  Globe,
  Megaphone,
  Bell,
  Settings,
  ShieldAlert,
  History,
  Briefcase,
  Star,
  MapPin,
  Compass,
  LogOut,
  RefreshCw,
  User,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  const handleSwitchAccount = () => {
    logout();
    router.push('/auth');
  };

  const menuSections = [
    {
      title: "Core CRM",
      items: [
        { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
        { label: "Lead Management", href: "/dashboard/admin/crm", icon: Users, featured: true },
        { label: "Client Directory", href: "/dashboard/admin/crm?tab=list", icon: Briefcase },
        { label: "Follow Ups", href: "/dashboard/admin/crm?tab=followups", icon: CheckSquare },
        { label: "Calendar", href: "/dashboard/admin/operations?tab=calendar", icon: Calendar },
      ]
    },
    {
      title: "Properties & Inventory",
      items: [
        { label: "Explore Properties", href: "/properties", icon: Compass },
        { label: "Property Portfolio", href: "/dashboard/admin/properties", icon: Building },
        { label: "Site Visits", href: "/dashboard/admin/operations?tab=calendar", icon: MapPin },
      ]
    },
    {
      title: "Team & Network",
      items: [
        { label: "Broker Network", href: "/dashboard/admin/brokers", icon: UserCheck },
        { label: "Employees", href: "/dashboard/admin/team", icon: Users },
      ]
    },
    {
      title: "Business & Revenue",
      items: [
        { label: "Deals & Invoices", href: "/dashboard/admin/operations?tab=deals", icon: FileText },
        { label: "Reports & Analytics", href: "/dashboard/admin/operations?tab=analytics", icon: PieChart },
        { label: "Marketing Campaigns", href: "/dashboard/admin/marketing", icon: Megaphone },
      ]
    },
    {
      title: "Platform Tools",
      items: [
        { label: "Website CMS", href: "/dashboard/admin/cms", icon: Globe },
        { label: "Notifications", href: "/dashboard/admin/notifications", icon: Bell },
        { label: "Settings", href: "/dashboard/admin/settings-general", icon: Settings },
      ]
    }
  ];

  // Super Admin Exclusive Navigation Section
  const superAdminSection = {
    title: "Super Admin Control",
    items: [
      { label: "Role Management", href: "/dashboard/admin/roles", icon: ShieldAlert },
      { label: "Audit Logs", href: "/dashboard/admin/audit-logs", icon: History },
      { label: "System Settings", href: "/dashboard/admin/system-settings", icon: Settings },
    ]
  };

  return (
    <aside className="w-72 fixed left-6 top-6 bottom-6 z-40 flex flex-col clay-sidebar p-4 overflow-hidden hidden lg:flex">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-1 mb-4 flex-shrink-0">
        <div className="w-9 h-9 bg-gradient-to-tr from-primary via-blue-600 to-accent rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-primary/30">
          DC
        </div>
        <div>
          <h2 className="font-extrabold text-base tracking-tight text-foreground">DC Real Estate</h2>
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Business OS</p>
        </div>
      </div>

      {/* 🏠 TOP HOME LINK (NAVIGATES TO PUBLIC WEBSITE) */}
      <div className="mb-3 flex-shrink-0">
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold text-foreground bg-primary/10 hover:bg-primary/20 transition-all border border-primary/20"
        >
          <div className="flex items-center gap-2.5">
            <Home className="w-4 h-4 text-primary" />
            <span>🏠 Home Page</span>
          </div>
          <span className="text-[10px] font-bold text-primary">Public ➔</span>
        </Link>
      </div>

      {/* Quick Search Input Trigger */}
      <div className="mb-4 px-0 flex-shrink-0">
        <div className="clay-input flex items-center px-3 py-2 text-xs text-muted-foreground gap-2 cursor-pointer hover:bg-card transition-colors">
          <Search className="w-3.5 h-3.5 text-primary" />
          <span className="font-semibold text-[11px]">Quick Search (⌘K)</span>
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <div className="space-y-5 flex-1 overflow-y-auto pr-1">
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="px-2.5 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/80">
              {section.title}
            </h3>
            {section.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard/admin' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 translate-x-1"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60 hover:translate-x-1"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("w-4 h-4", isActive ? "text-primary-foreground" : "text-primary")} />
                    <span>{item.label}</span>
                  </div>
                  {item.featured && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-400/20 text-amber-600 dark:text-amber-300 text-[9px] rounded-md font-black">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> HOT
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Super Admin Only Section (STRICT RBAC PROTECTION) */}
        {isSuperAdmin && (
          <div className="space-y-1 pt-3 border-t border-border/60">
            <h3 className="px-2.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> {superAdminSection.title}
            </h3>
            {superAdminSection.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200",
                    isActive
                      ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 translate-x-1"
                      : "text-muted-foreground hover:text-foreground hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:translate-x-1"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-amber-500" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* FIXED PINNED BOTTOM USER PROFILE SECTION (NEVER SCROLLS AWAY) */}
      <div className="pt-3 border-t border-border/60 mt-2 flex-shrink-0">
        <div className="clay-card-flat p-3 space-y-2.5">
          {/* User Info Header */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-black text-xs flex items-center justify-center flex-shrink-0 border border-primary/30">
              👤
            </div>
            <div className="truncate">
              <p className="text-sm font-extrabold truncate text-foreground">{user?.firstName || 'Dhiraj'} {user?.lastName || ''}</p>
              <p className="text-[9px] font-black text-primary uppercase tracking-wider">{user?.role || 'SUPER ADMIN'}</p>
            </div>
          </div>

          {/* User Profile Quick Actions */}
          <div className="pt-2 border-t border-border/50 grid grid-cols-3 gap-1 text-[10px] font-bold text-muted-foreground">
            <Link 
              href="/dashboard/admin/settings-general"
              className="p-1.5 rounded-lg hover:bg-muted text-center flex flex-col items-center gap-0.5 hover:text-foreground transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-primary" />
              <span>Settings</span>
            </Link>

            <button 
              onClick={handleSwitchAccount}
              className="p-1.5 rounded-lg hover:bg-muted text-center flex flex-col items-center gap-0.5 hover:text-foreground transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
              <span>Switch</span>
            </button>

            <button 
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-red-50 text-center flex flex-col items-center gap-0.5 text-red-600 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
