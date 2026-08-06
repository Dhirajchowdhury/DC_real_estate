"use client";

import { motion } from 'framer-motion';
import { UserCheck, Building2, ShieldAlert } from 'lucide-react';

export type RoleType = 'CUSTOMER' | 'BROKER';

interface RoleSelectorProps {
  selectedRole: RoleType;
  onSelectRole: (role: RoleType) => void;
}

export function RoleSelector({ selectedRole, onSelectRole }: RoleSelectorProps) {
  const roles = [
    {
      id: 'CUSTOMER' as RoleType,
      title: 'Customer / Client',
      subtitle: 'Browse properties, schedule site visits, and connect with verified agents.',
      icon: UserCheck,
      badge: 'Instant Access',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'BROKER' as RoleType,
      title: 'Broker / Agent',
      subtitle: 'List commercial & residential properties, access CRM, and manage clients.',
      icon: Building2,
      badge: 'Admin Approval Required',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
  ];

  return (
    <div className="space-y-3 mb-6">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block text-center">
        Choose Account Type
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <motion.button
              key={role.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRole(role.id)}
              className={`relative p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-card border-primary ring-2 ring-primary/30 shadow-xl shadow-primary/10'
                  : 'bg-card/40 border-border hover:border-primary/50 hover:bg-card/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl transition-colors ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${role.badgeColor}`}>
                    {role.badge}
                  </span>
                </div>

                <h3 className="font-bold text-base text-foreground mb-1">
                  {role.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {role.subtitle}
                </p>
              </div>

              {isSelected && (
                <motion.div
                  layoutId="role-check"
                  className="mt-3 text-xs font-bold text-primary flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Selected
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
