'use strict';
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ShieldCheck, 
  Workflow, 
  Activity, 
  Layers, 
  ArrowRight,
  Sparkles,
  KeyRound,
  Network
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 overflow-hidden relative bg-mesh">
      
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      {/* Floating Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#030712]/60 backdrop-blur-md px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20">
              <Zap className="h-5 w-5 fill-current text-indigo-100" />
            </div>
            <span className="text-lg font-bold tracking-wider text-white">
              Team<span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Flow</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="flex items-center space-x-1.5 rounded-xl bg-white/[0.03] border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.06] hover:border-white/20 transition-smooth active:scale-97"
            >
              <span>Launch Console</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-16 text-center lg:pt-32">
        <div className="space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Built for Modern Scale</span>
          </div>

          {/* Majestic Hero Headline */}
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
            The Production-Grade{' '}
            <span className="text-gradient-mixed">Team Engine</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto max-w-2xl text-base text-gray-400 sm:text-lg">
            An enterprise-ready project management monorepo designed with a clean layered architecture, rich database schema, and high-fidelity glassmorphic dashboard workspace.
          </p>

          {/* Action CTAs */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 rounded-xl bg-indigo-600 px-6 py-3 text-base font-bold text-white hover:bg-indigo-500 transition-smooth shadow-lg shadow-indigo-600/30 hover:scale-102"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] px-6 py-3 text-base font-bold text-gray-300 hover:text-white transition-smooth"
            >
              <span>Explore Architecture</span>
            </a>
          </div>
        </div>
      </section>

      {/* Live Preview / Decorative Grid */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="glass-card rounded-2xl border border-white/10 p-2 sm:p-4 glow-indigo">
          <div className="rounded-xl border border-white/5 bg-[#070b16] overflow-hidden shadow-2xl relative">
            
            {/* Header controls decoration */}
            <div className="h-10 bg-[#0c101d] border-b border-white/5 px-4 flex items-center justify-between">
              <div className="flex space-x-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/30 border border-red-500/40" />
                <span className="h-3 w-3 rounded-full bg-amber-500/30 border border-amber-500/40" />
                <span className="h-3 w-3 rounded-full bg-green-500/30 border border-green-500/40" />
              </div>
              <span className="text-xxs font-semibold text-gray-600 tracking-wider">teamflow.io/dashboard</span>
              <span className="w-12" />
            </div>

            {/* Visual Screen placeholder */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-b from-[#0b0f19]/30 to-[#030712]/90">
              <div className="md:col-span-2 space-y-4">
                <div className="h-6 w-1/4 bg-white/5 rounded-md" />
                <div className="h-32 bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 bg-white/10 rounded" />
                    <div className="h-3 w-1/2 bg-white/5 rounded" />
                  </div>
                  <div className="h-6 w-1/6 bg-indigo-500/20 rounded-md border border-indigo-500/10" />
                </div>
              </div>
              <div className="bg-[#0b0f19]/80 border border-white/5 rounded-xl p-4 space-y-3">
                <div className="h-5 w-1/3 bg-white/10 rounded" />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <span className="h-4 w-4 bg-white/5 rounded-full" />
                      <div className="h-3 flex-1 bg-white/5 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20 border-t border-white/5">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
            A Scalable Architecture Blueprint
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-gray-400">
            Engineered as a production ready platform featuring state-of-the-art developer standards.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Card 1: Monorepo Setup */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400 border border-indigo-500/10 w-fit mb-4">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Monorepo Isolation</h3>
            <p className="text-xs text-gray-400">
              Clean separation of frontend and backend processes under a unified monorepo workspace for optimized developer workflows.
            </p>
          </div>

          {/* Card 2: Schema */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400 border border-cyan-500/10 w-fit mb-4">
              <Network className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Rich Relations DB</h3>
            <p className="text-xs text-gray-400">
              Structured PostgreSQL schema specifying strict relations for users, organizations, memberships, tasks, and history logging.
            </p>
          </div>

          {/* Card 3: Layered Backend */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400 border border-purple-500/10 w-fit mb-4">
              <Workflow className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Layered Express REST</h3>
            <p className="text-xs text-gray-400">
              A decoupled back-end flow organizing endpoints through clean routes, validation middleware, repositories, and services.
            </p>
          </div>

          {/* Card 4: React Query */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="rounded-xl bg-green-500/10 p-3 text-green-400 border border-green-500/10 w-fit mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Cache-First State</h3>
            <p className="text-xs text-gray-400">
              Harnesses TanStack React Query for lightning fast client synchronization, optimistic rendering, and caching invalidations.
            </p>
          </div>

          {/* Card 5: Fake Auth */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="rounded-xl bg-orange-500/10 p-3 text-orange-400 border border-orange-500/10 w-fit mb-4">
              <KeyRound className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Fake Auth Middleware</h3>
            <p className="text-xs text-gray-400">
              Dynamic local context injector built to seamlessly elevate to production SSO, JWT, and session management frameworks in the future.
            </p>
          </div>

          {/* Card 6: Audit Logs */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="rounded-xl bg-rose-500/10 p-3 text-rose-400 border border-rose-500/10 w-fit mb-4">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Active Activity Logs</h3>
            <p className="text-xs text-gray-400">
              Robust backend transaction triggers logging status alterations, project uploads, and team assignments into a central feed.
            </p>
          </div>

        </div>
      </section>

      {/* Footer Section */}
      <footer className="mx-auto max-w-7xl px-6 py-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 space-y-4 sm:space-y-0">
        <p>© 2026 TeamFlow Enterprise Inc. All rights reserved.</p>
        <div className="flex space-x-6">
          <span className="hover:text-gray-400 transition-smooth">Privacy Policy</span>
          <span className="hover:text-gray-400 transition-smooth">Terms of Service</span>
          <span className="hover:text-gray-400 transition-smooth">Documentation</span>
        </div>
      </footer>
    </div>
  );
}
