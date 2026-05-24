'use strict';
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  KanbanSquare, 
  LayoutDashboard, 
  Folder, 
  CheckSquare, 
  Activity, 
  Users, 
  Settings, 
  Menu, 
  X,
  Zap
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/dashboard/projects', icon: Folder },
    { name: 'Tasks & Boards', href: '/dashboard/tasks', icon: CheckSquare },
  ];

  const secondaryLinks = [
    { name: 'Members & Roles', href: '#', icon: Users, disabled: true },
    { name: 'Settings', href: '#', icon: Settings, disabled: true },
  ];

  const NavContent = () => (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-7">
        {/* Brand Logo */}
        <div className="flex items-center space-x-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20">
            <Zap className="h-5 w-5 fill-current text-indigo-100" />
          </div>
          <span className="text-lg font-bold tracking-wider text-white">
            Team<span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Flow</span>
          </span>
        </div>

        {/* Primary Navigation */}
        <nav className="space-y-1">
          <p className="px-2.5 pb-2 text-xxs font-semibold uppercase tracking-wider text-gray-500">
            Manage
          </p>
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-smooth ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/20 to-cyan-600/5 text-white border-l-2 border-indigo-500 glow-indigo'
                    : 'text-gray-400 hover:bg-white/[0.03] hover:text-white'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 transition-colors duration-200 ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-white'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Scalability Mock Items */}
        <div className="space-y-1">
          <p className="px-2.5 pb-2 text-xxs font-semibold uppercase tracking-wider text-gray-500">
            Workspace
          </p>
          {secondaryLinks.map((link) => {
            const Icon = link.icon;
            return (
              <div
                key={link.name}
                className="flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 cursor-not-allowed"
                title="Coming soon under full-auth implementation"
              >
                <Icon className="h-4.5 w-4.5 text-gray-700" />
                <span>{link.name}</span>
                <span className="rounded-full bg-white/[0.02] border border-white/5 px-1.5 py-0.5 text-xxs text-gray-500">
                  Locked
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer / System Meta */}
      <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3">
        <p className="text-xxs text-gray-500 font-semibold uppercase tracking-wide">Environment</p>
        <div className="mt-1 flex items-center space-x-2">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-400 font-medium">Production-Ready (Fake Auth)</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Toggle */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-600/35 border border-indigo-500 outline-none active:scale-95 transition-transform duration-150"
          aria-label="Toggle Navigation Drawer"
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden h-screen w-64 flex-shrink-0 border-r border-white/5 bg-[#030712] md:block">
        <NavContent />
      </aside>

      {/* Mobile Sidebar (Drawer overlay) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Drawer backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer sheet */}
          <aside className="relative flex w-64 max-w-xs flex-col border-r border-white/10 bg-[#070b16] shadow-2xl h-full animate-slide-in">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
