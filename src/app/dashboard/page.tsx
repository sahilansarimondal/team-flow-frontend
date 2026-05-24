'use strict';
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '@/providers/AppContext';
import { api } from '@/lib/api';
import { OverviewSkeleton } from '@/components/Skeletons';
import Link from 'next/link';
import { 
  Folder, 
  CheckSquare, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Calendar,
  Activity,
  Plus
} from 'lucide-react';
import { Task, Project, ActivityLog } from '@/types';

export default function DashboardOverview() {
  const { currentOrg, user } = useApp();

  // 1. Fetch current org projects
  const {
    data: projects = [],
    isLoading: isProjectsLoading,
  } = useQuery<Project[]>({
    queryKey: ['projects', currentOrg?.id],
    queryFn: () => api.getProjects(currentOrg!.id),
    enabled: !!currentOrg?.id,
  });

  // 2. Fetch current org tasks
  const {
    data: tasks = [],
    isLoading: isTasksLoading,
  } = useQuery<Task[]>({
    queryKey: ['tasks', currentOrg?.id],
    queryFn: () => api.getTasks({ organizationId: currentOrg!.id }),
    enabled: !!currentOrg?.id,
  });

  // 3. Fetch recent activity logs
  const {
    data: activities = [],
    isLoading: isActivitiesLoading,
  } = useQuery<ActivityLog[]>({
    queryKey: ['activityLogs'],
    queryFn: () => api.getActivityLogs(6),
  });

  const isLoading = isProjectsLoading || isTasksLoading || isActivitiesLoading;

  if (isLoading || !currentOrg) {
    return <OverviewSkeleton />;
  }

  // Calculate quick metrics
  const totalProjects = projects.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'DONE').length;
  const activeMembers = currentOrg.members?.length || 1;

  // Split tasks into lists
  const urgentTasks = tasks
    .filter((t) => t.priority === 'URGENT' || t.priority === 'HIGH')
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Upper header */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Welcome back, {user?.name.split(' ')[0]}!
          </h1>
          <p className="text-sm text-gray-400">
            Here is what is happening in <span className="text-indigo-400 font-semibold">{currentOrg.name}</span> today.
          </p>
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Projects Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Projects</span>
              <h3 className="text-3xl font-extrabold text-white">{totalProjects}</h3>
            </div>
            <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400 border border-indigo-500/10">
              <Folder className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xxs text-gray-500">
            <TrendingUp className="mr-1 h-3.5 w-3.5 text-green-400" />
            <span className="text-green-400 font-semibold mr-1">Workspace scoped</span>
            <span>projects active</span>
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Tasks</span>
              <h3 className="text-3xl font-extrabold text-white">{pendingTasks}</h3>
            </div>
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400 border border-amber-500/10">
              <CheckSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xxs text-gray-500">
            <span className="text-amber-400 font-semibold mr-1">{tasks.filter(t => t.status === 'IN_PROGRESS').length} in progress</span>
            <span>awaiting updates</span>
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tasks Completed</span>
              <h3 className="text-3xl font-extrabold text-white">{completedTasks}</h3>
            </div>
            <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400 border border-cyan-500/10">
              <CheckSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xxs text-gray-500">
            <span className="text-cyan-400 font-semibold mr-1">
              {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}% completion
            </span>
            <span>rate overall</span>
          </div>
        </div>

        {/* Active Members Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Team Members</span>
              <h3 className="text-3xl font-extrabold text-white">{activeMembers}</h3>
            </div>
            <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-400 border border-purple-500/10">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xxs text-gray-500">
            <span className="text-purple-400 font-semibold mr-1">Active Roles</span>
            <span>Owner, Admins, and Members</span>
          </div>
        </div>
      </div>

      {/* Main Grid Details Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left Side: Projects List & High Priority Tasks */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Projects Summary */}
          <div className="rounded-2xl border border-white/5 bg-[#0b0f19]/40 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white tracking-wide">Workspace Projects</h2>
              <Link
                href="/dashboard/projects"
                className="flex items-center space-x-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-smooth"
              >
                <span>View All Projects</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500 space-y-2">
                <Folder className="h-8 w-8 text-gray-600" />
                <p className="text-xs font-medium">No projects in this organization.</p>
                <Link
                  href="/dashboard/projects"
                  className="rounded-xl bg-indigo-600/10 border border-indigo-500/20 px-3.5 py-1.5 text-xs text-indigo-300 hover:bg-indigo-600/25 transition-smooth"
                >
                  Create one now
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {projects.slice(0, 4).map((project) => (
                  <Link
                    key={project.id}
                    href="/dashboard/tasks"
                    className="flex flex-col justify-between rounded-xl border border-white/5 bg-white/[0.01] p-4 hover:border-white/10 hover:bg-white/[0.03] transition-smooth group"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-smooth">
                        {project.name}
                      </h4>
                      <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                        {project.description || 'No description provided.'}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xxs text-gray-500">
                      <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                      <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-indigo-300 font-semibold">
                        {project._count?.tasks || 0} tasks
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* High Priority Tasks list */}
          <div className="rounded-2xl border border-white/5 bg-[#0b0f19]/40 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white tracking-wide">High Priority Action Items</h2>
              <Link
                href="/dashboard/tasks"
                className="flex items-center space-x-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-smooth"
              >
                <span>View Task Board</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {urgentTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <CheckSquare className="h-8 w-8 text-gray-600 mb-2" />
                <p className="text-xs">No urgent or high priority tasks remaining.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {urgentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="rounded bg-red-500/15 border border-red-500/25 px-1.5 py-0.5 text-xxs text-red-400 font-bold uppercase">
                          {task.priority}
                        </span>
                        <h4 className="text-sm font-semibold text-white">{task.title}</h4>
                      </div>
                      <p className="text-xs text-gray-400">{task.project?.name}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xxs font-semibold ${
                        task.status === 'DONE' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' :
                        task.status === 'IN_PROGRESS' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' :
                        'bg-gray-500/10 text-gray-400 border border-white/5'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Activity Streams */}
        <div>
          <div className="rounded-2xl border border-white/5 bg-[#0b0f19]/40 p-6 backdrop-blur-md h-full">
            <h2 className="text-base font-bold text-white tracking-wide mb-5 flex items-center space-x-2">
              <Activity className="h-4.5 w-4.5 text-indigo-400" />
              <span>Workspace Activity</span>
            </h2>

            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-xs">No activity logs recorded yet.</p>
              </div>
            ) : (
              <div className="flow-root">
                <ul className="-mb-8">
                  {activities.map((log, logIdx) => (
                    <li key={log.id}>
                      <div className="relative pb-8">
                        {logIdx !== activities.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-white/5"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            {log.user?.avatarUrl ? (
                              <img
                                src={log.user.avatarUrl}
                                alt={log.user.name}
                                className="flex h-8 w-8 items-center justify-center rounded-full object-cover border border-white/10"
                              />
                            ) : (
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-semibold text-indigo-300 border border-indigo-500/15">
                                {log.user?.name.slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-xs text-gray-300">
                                <span className="font-semibold text-white">{log.user?.name}</span>{' '}
                                {log.details}
                              </p>
                            </div>
                            <div className="whitespace-nowrap text-right text-xxs text-gray-500">
                              {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
