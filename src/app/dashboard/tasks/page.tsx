'use strict';
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApp } from '@/providers/AppContext';
import { api } from '@/lib/api';
import Modal from '@/components/Modal';
import Table from '@/components/Table';
import { TableSkeleton } from '@/components/Skeletons';
import { 
  Plus, 
  Trash2, 
  User as UserIcon, 
  CheckSquare, 
  Filter, 
  Tag, 
  ChevronRight,
  ListTodo,
  Loader2
} from 'lucide-react';
import { Task, Project, User } from '@/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']),
  projectId: z.string().uuid('Please select a valid project'),
  assigneeId: z.string().uuid('Please select a valid assignee').optional().or(z.literal('')),
});

type CreateTaskInput = z.infer<typeof createTaskSchema>;

export default function TasksPage() {
  const { currentOrg } = useApp();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters State
  const [projectIdFilter, setProjectIdFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // 1. Fetch current org projects (for filter & creation options)
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['projects', currentOrg?.id],
    queryFn: () => api.getProjects(currentOrg!.id),
    enabled: !!currentOrg?.id,
  });

  // 2. Fetch system users (for assignee lists)
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: api.getUsers,
  });

  // 3. Fetch tasks with active filters
  const {
    data: tasks = [],
    isLoading: isTasksLoading,
  } = useQuery<Task[]>({
    queryKey: ['tasks', currentOrg?.id, projectIdFilter, statusFilter, priorityFilter],
    queryFn: () =>
      api.getTasks({
        organizationId: currentOrg!.id,
        projectId: projectIdFilter || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
      }),
    enabled: !!currentOrg?.id,
  });

  // React Hook Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: 'MEDIUM',
      status: 'TODO',
      projectId: '',
      assigneeId: '',
    },
  });

  // 4. Create Task Mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateTaskInput) =>
      api.createTask({
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        projectId: data.projectId,
        assigneeId: data.assigneeId || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', currentOrg?.id] });
      queryClient.invalidateQueries({ queryKey: ['projects', currentOrg?.id] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      setIsModalOpen(false);
      reset();
    },
  });

  // 5. Update Task Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.updateTask(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', currentOrg?.id] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
    },
  });

  // 6. Delete Task Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', currentOrg?.id] });
      queryClient.invalidateQueries({ queryKey: ['projects', currentOrg?.id] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
    },
  });

  const onSubmit = (data: CreateTaskInput) => {
    createMutation.mutate(data);
  };

  const priorityColors = {
    LOW: 'bg-green-500/10 text-green-400 border-green-500/20',
    MEDIUM: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    URGENT: 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse',
  };

  const statusColors = {
    TODO: 'bg-gray-500/10 text-gray-400 border-white/5',
    IN_PROGRESS: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    IN_REVIEW: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    DONE: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  const columns = [
    {
      header: 'Task Title',
      render: (task: Task) => (
        <div className="flex flex-col">
          <span className="font-semibold text-white tracking-wide">{task.title}</span>
          <span className="text-xxs text-gray-500 line-clamp-1 max-w-xs">{task.description || 'No description.'}</span>
        </div>
      ),
    },
    {
      header: 'Project',
      render: (task: Task) => (
        <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/5 px-2 py-1 rounded-md border border-indigo-500/10">
          {task.project?.name || 'Unlinked'}
        </span>
      ),
    },
    {
      header: 'Priority',
      render: (task: Task) => (
        <span className={`rounded-full px-2 py-0.5 text-xxs font-bold border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (task: Task) => (
        <select
          value={task.status}
          onChange={(e) => updateStatusMutation.mutate({ id: task.id, status: e.target.value })}
          className={`rounded-full px-2 py-0.5 text-xxs font-bold border outline-none cursor-pointer bg-[#0b0f19] ${statusColors[task.status]}`}
        >
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="IN_REVIEW">IN REVIEW</option>
          <option value="DONE">DONE</option>
        </select>
      ),
    },
    {
      header: 'Assignee',
      render: (task: Task) => (
        <div className="flex items-center space-x-2">
          {task.assignee?.avatarUrl ? (
            <img
              src={task.assignee.avatarUrl}
              alt={task.assignee.name}
              className="h-6 w-6 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-xxs font-semibold text-gray-400 border border-white/5">
              <UserIcon className="h-3.5 w-3.5" />
            </div>
          )}
          <span className="text-xs text-gray-300">{task.assignee?.name || 'Unassigned'}</span>
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (task: Task) => (
        <button
          onClick={() => {
            if (confirm(`Delete task "${task.title}"?`)) {
              deleteMutation.mutate(task.id);
            }
          }}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-smooth"
          title="Delete Task"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  if (isTasksLoading || !currentOrg) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Task Board</h1>
          <p className="text-sm text-gray-400">
            Sprint management workspace for <span className="text-indigo-400 font-semibold">{currentOrg.name}</span>.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-smooth active:scale-95 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Advanced Filter Panel */}
      <div className="rounded-xl border border-white/5 bg-[#0b0f19]/25 p-4 backdrop-blur-md flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <Filter className="h-4 w-4 text-indigo-400" />
          <span>Filters:</span>
        </div>

        {/* Project Filter */}
        <select
          value={projectIdFilter}
          onChange={(e) => setProjectIdFilter(e.target.value)}
          className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs text-gray-300 outline-none focus:border-indigo-500/50 hover:bg-white/[0.04] transition-smooth cursor-pointer"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs text-gray-300 outline-none focus:border-indigo-500/50 hover:bg-white/[0.04] transition-smooth cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="IN_REVIEW">IN REVIEW</option>
          <option value="DONE">DONE</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs text-gray-300 outline-none focus:border-indigo-500/50 hover:bg-white/[0.04] transition-smooth cursor-pointer"
        >
          <option value="">All Priorities</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </select>

        {/* Clear Filters Helper */}
        {(projectIdFilter || statusFilter || priorityFilter) && (
          <button
            onClick={() => {
              setProjectIdFilter('');
              setStatusFilter('');
              setPriorityFilter('');
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-smooth font-semibold"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Task Table */}
      <Table
        columns={columns}
        data={tasks}
        emptyState={
          <div className="flex flex-col items-center justify-center py-14 text-center space-y-4">
            <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 text-gray-500">
              <ListTodo className="h-8 w-8 text-gray-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">No tasks found</p>
              <p className="text-xs text-gray-400 max-w-xs">
                Modify your active filters or create a new task to populate this sprint view.
              </p>
            </div>
          </div>
        }
      />

      {/* Reusable Form Modal for Task Creation */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Add New Task"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Task Title
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Implement OIDC Login Auth"
              className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none transition-smooth focus:border-indigo-500/50"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-400 font-medium">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Detail the acceptance criteria..."
              className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none transition-smooth focus:border-indigo-500/50"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-400 font-medium">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Priority
              </label>
              <select
                {...register('priority')}
                className="w-full rounded-xl border border-white/5 bg-[#0b0f19] px-3.5 py-2 text-sm text-gray-200 outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full rounded-xl border border-white/5 bg-[#0b0f19] px-3.5 py-2 text-sm text-gray-200 outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="IN_REVIEW">IN REVIEW</option>
                <option value="DONE">DONE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Target Project
              </label>
              <select
                {...register('projectId')}
                className="w-full rounded-xl border border-white/5 bg-[#0b0f19] px-3.5 py-2 text-sm text-gray-200 outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                <option value="">Choose Project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.projectId && (
                <p className="mt-1 text-xs text-red-400 font-medium">{errors.projectId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Assignee (Optional)
              </label>
              <select
                {...register('assigneeId')}
                className="w-full rounded-xl border border-white/5 bg-[#0b0f19] px-3.5 py-2 text-sm text-gray-200 outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              {errors.assigneeId && (
                <p className="mt-1 text-xs text-red-400 font-medium">{errors.assigneeId.message}</p>
              )}
            </div>
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
                  <span>Adding...</span>
                </>
              ) : (
                <span>Add Task</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
