'use strict';
'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useApp } from '@/providers/AppContext';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isError } = useApp();

  // Global loading state on boot (fetching mock user / organization metadata)
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#030712] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="text-sm text-gray-400 font-medium tracking-wide">
          Syncing workspace context...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#030712] px-6 text-center space-y-4">
        <div className="rounded-full bg-red-500/10 p-3 text-red-400 border border-red-500/20">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-white">Connection Error</h2>
        <p className="max-w-md text-sm text-gray-400">
          Failed to connect to the backend server. Please verify the Docker Compose services are running and the seed script was successfully executed.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-smooth active:scale-95"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#030712] bg-mesh">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Primary Content Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Selector */}
        <Header />

        {/* Scrollable Work Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
