'use strict';
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApp } from '@/providers/AppContext';
import { api } from '@/lib/api';
import Modal from '@/components/Modal';
import { TableSkeleton } from '@/components/Skeletons';
import { Plus, Folder, ExternalLink, Trash2, Calendar, Loader2 } from 'lucide-react';
import { Project } from '@/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters').max(60, 'Name is too long'),
  description: z.string().max(300, 'Description cannot exceed 300 characters').optional(),
});

type CreateProjectInput = z.infer<typeof createProjectSchema>;

export default function ProjectsPage() {
  const { currentOrg } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // 1. Fetch projects
  const {
    data: projects = [],
    isLoading,
    refetch,
  } = useQuery<Project[]>({
    queryKey: ['projects', currentOrg?.id],
    queryFn: () => api.getProjects(currentOrg!.id),
    enabled: !!currentOrg?.id,
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
  });

  // 2. Create Project mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateProjectInput) =>
      api.createProject({
        name: data.name,
        description: data.description,
        organizationId: currentOrg!.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', currentOrg?.id] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      setIsModalOpen(false);
      reset();
    },
  });

  // 3. Delete Project mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', currentOrg?.id] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
    },
  });

  const onSubmit = (data: CreateProjectInput) => {
    createMutation.mutate(data);
  };

  if (isLoading || !currentOrg) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header and CTA */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Projects</h1>
          <p className="text-sm text-gray-400">
            Create, view, and administer development projects inside <span className="text-indigo-400 font-semibold">{currentOrg.name}</span>.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-smooth active:scale-95 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Display */}
      {projects.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0b0f19]/40 py-20 px-6 text-center backdrop-blur-md flex flex-col items-center justify-center space-y-4">
          <div className="rounded-2xl bg-indigo-500/10 p-4 text-indigo-400 border border-indigo-500/10">
            <Folder className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">No projects found</h3>
            <p className="text-sm text-gray-400 max-w-sm">
              Get started by creating your very first project. Projects group tasks, comments, and members.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-indigo-600/10 border border-indigo-500/20 px-4 py-2 text-sm text-indigo-300 hover:bg-indigo-600/25 transition-smooth"
          >
            Create first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400 border border-indigo-500/10">
                    <Folder className="h-5 w-5" />
                  </div>
                  {/* Delete Option */}
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
                        deleteMutation.mutate(project.id);
                      }
                    }}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-smooth"
                    title="Delete Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <h3 className="text-lg font-bold text-white tracking-wide">{project.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-3">
                    {project.description || 'No description provided. Click below to add tasks.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/5 pt-4 flex items-center justify-between">
                <div className="flex items-center text-xxs text-gray-500 space-x-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-xxs text-indigo-300 font-semibold">
                  {project._count?.tasks || 0} Tasks
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reusable Modal for Project Creation */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Create New Project"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="e.g. Acme Redesign"
              className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none transition-smooth focus:border-indigo-500/50 focus:bg-white/[0.04]"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Brief summary of the goals and deliverables..."
              className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none transition-smooth focus:border-indigo-500/50 focus:bg-white/[0.04]"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-400 font-medium">{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                reset();
              }}
              className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/[0.04] transition-smooth"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-smooth"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Project</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
