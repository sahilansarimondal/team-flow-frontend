'use strict';
'use client';

import React from 'react';

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-white/5 bg-[#0b0f19]/40 p-6 space-y-4">
      <div className="skeleton h-6 w-1/3 rounded" />
      <div className="skeleton h-4 w-5/6 rounded" />
      <div className="skeleton h-4 w-4/5 rounded" />
      <div className="flex justify-between items-center pt-2">
        <div className="skeleton h-8 w-1/4 rounded-lg" />
        <div className="skeleton h-6 w-6 rounded-full" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="w-full rounded-xl border border-white/5 bg-[#0b0f19]/40 overflow-hidden p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="skeleton h-6 w-1/4 rounded" />
        <div className="skeleton h-8 w-1/6 rounded-lg" />
      </div>
      <div className="space-y-3 pt-2">
        <div className="skeleton h-10 w-full rounded" />
        <div className="skeleton h-10 w-full rounded" />
        <div className="skeleton h-10 w-full rounded" />
        <div className="skeleton h-10 w-full rounded" />
        <div className="skeleton h-10 w-full rounded" />
      </div>
    </div>
  );
}

export function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      {/* 4 small metric cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-white/5 bg-[#0b0f19]/40 p-6 space-y-3">
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="skeleton h-8 w-1/3 rounded" />
          </div>
        ))}
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <TableSkeleton />
        </div>
        <div>
          <div className="rounded-xl border border-white/5 bg-[#0b0f19]/40 p-6 space-y-4">
            <div className="skeleton h-5 w-1/3 rounded" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex space-x-3 items-center">
                <div className="skeleton h-8 w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
