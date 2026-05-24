'use strict';
'use client';

import React from 'react';

interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyState?: React.ReactNode;
}

export default function Table<T>({ columns, data, emptyState }: TableProps<T>) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/5 bg-[#0b0f19]/40 backdrop-blur-md">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-gray-300">
          <thead className="border-b border-white/10 bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-gray-400">
            <tr>
              {columns.map((column, index) => (
                <th key={index} scope="col" className="px-6 py-4">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-transparent">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  {emptyState || (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <p className="text-sm">No records found.</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="group hover:bg-white/[0.02] transition-colors duration-150"
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="whitespace-nowrap px-6 py-4">
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
