'use strict';
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/providers/AppContext';
import { ChevronDown, Search, Bell, Sparkles, Building2, User as UserIcon, LogOut } from 'lucide-react';

export default function Header() {
  const { user, organizations, currentOrg, setCurrentOrg } = useApp();
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const orgRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside clicks
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (orgRef.current && !orgRef.current.contains(e.target as Node)) {
        setIsOrgDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/5 bg-[#030712]/75 px-6 backdrop-blur-md">
      
      {/* Left Area: Organization Switcher */}
      <div className="flex items-center space-x-4">
        <div ref={orgRef} className="relative">
          <button
            onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
            className="flex items-center space-x-2.5 rounded-xl border border-white/5 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-white hover:bg-white/[0.06] transition-smooth active:scale-98"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <span className="max-w-[120px] truncate sm:max-w-none">
              {currentOrg ? currentOrg.name : 'Loading Workspace...'}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:text-white" />
          </button>

          {isOrgDropdownOpen && (
            <div className="absolute left-0 mt-2 w-56 origin-top-left rounded-xl border border-white/10 bg-[#0b0f19]/95 p-1.5 shadow-2xl backdrop-blur-xl animate-fade-in glow-indigo">
              <div className="px-2.5 py-1.5 text-xxs font-semibold uppercase tracking-wider text-gray-500">
                Workspaces
              </div>
              <div className="mt-1 space-y-1">
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => {
                      setCurrentOrg(org);
                      setIsOrgDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-all duration-150 ${
                      currentOrg?.id === org.id
                        ? 'bg-indigo-600/15 text-indigo-300 font-medium'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{org.name}</span>
                    {currentOrg?.id === org.id && (
                      <span className="flex h-2 w-2 rounded-full bg-indigo-400 glow-indigo" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle Area: Mock Search */}
      <div className="hidden max-w-md flex-1 px-12 md:block">
        <div className="relative">
          <Search className="absolute top-2.5 left-3 h-4.5 w-4.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search projects, tasks, activities..."
            className="w-full rounded-xl border border-white/5 bg-white/[0.02] py-2 pr-4 pl-10 text-sm text-gray-200 placeholder-gray-500 outline-none transition-smooth focus:border-indigo-500/50 focus:bg-white/[0.04] focus:ring-1 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Right Area: Profile & System Info */}
      <div className="flex items-center space-x-4">
        {/* Fake Premium Badge */}
        <div className="hidden items-center space-x-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 sm:flex">
          <Sparkles className="h-3 w-3" />
          <span>Demo Account</span>
        </div>

        {/* Notifications mock icon */}
        <button className="relative rounded-xl border border-white/5 bg-white/[0.02] p-2 text-gray-400 hover:text-white transition-smooth">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1 right-1 flex h-1.5 w-1.5 rounded-full bg-cyan-400 glow-cyan" />
        </button>

        {/* User profile details */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center space-x-2 rounded-full outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-9 w-9 rounded-full border border-white/10 object-cover ring-2 ring-indigo-500/10"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-indigo-500/20 text-sm font-semibold text-indigo-300">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'TF'}
              </div>
            )}
          </button>

          {isProfileDropdownOpen && user && (
            <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-white/10 bg-[#0b0f19]/95 p-1.5 shadow-2xl backdrop-blur-xl animate-fade-in glow-indigo">
              {/* Account Overview */}
              <div className="border-b border-white/5 px-3.5 py-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Logged In As</p>
                <p className="mt-1.5 text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
              </div>

              {/* Mock items to represent production scale */}
              <div className="mt-1.5 space-y-0.5">
                <div className="flex items-center space-x-2.5 rounded-lg px-3.5 py-2 text-xs text-gray-500">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  <span>Enterprise Role: OWNER</span>
                </div>
                <div className="flex items-center space-x-2.5 rounded-lg px-3.5 py-2 text-xs text-indigo-400 bg-white/[0.02]">
                  <span>Fake Auth Active</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
