import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/api';

// Task Queries
export const useTaskQueries = () => {
  const queryClient = useQueryClient();

  const useGetTasks = (params = {}) => {
    return useQuery({
      queryKey: ['tasks', params],
      queryFn: async () => {
        const response = await taskApi.getAll(params);
        return response.data;
      },
    });
  };

  const useGetTask = (id) => {
    return useQuery({
      queryKey: ['task', id],
      queryFn: async () => {
        const response = await taskApi.getById(id);
        return response.data;
      },
      enabled: !!id,
    });
  };

  const useCreateTask = () => {
    return useMutation({
      mutationFn: async (taskData) => {
        const response = await taskApi.create(taskData);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  const useUpdateTask = () => {
    return useMutation({
      mutationFn: async ({ id, ...taskData }) => {
        const response = await taskApi.update(id, taskData);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  const useDeleteTask = () => {
    return useMutation({
      mutationFn: async (id) => {
        await taskApi.delete(id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  const useCompleteTask = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await taskApi.complete(id);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  const useArchiveTask = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await taskApi.archive(id);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  const useAddComment = () => {
    return useMutation({
      mutationFn: async ({ taskId, comment }) => {
        const response = await taskApi.addComment(taskId, comment);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  const useGetAnalytics = () => {
    return useQuery({
      queryKey: ['analytics'],
      queryFn: async () => {
        const response = await taskApi.getAnalytics();
        return response.data;
      },
    });
  };

  const useGetReminderStats = () => {
    return useQuery({
      queryKey: ['reminder-stats'],
      queryFn: async () => {
        const response = await taskApi.getReminderStats();
        return response.data;
      },
    });
  };

  const useBulkUpdate = () => {
    return useMutation({
      mutationFn: async ({ taskIds, updates }) => {
        const response = await taskApi.bulkUpdate(taskIds, updates);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  const useBulkDelete = () => {
    return useMutation({
      mutationFn: async (taskIds) => {
        await taskApi.bulkDelete(taskIds);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  return {
    useGetTasks,
    useGetTask,
    useCreateTask,
    useUpdateTask,
    useDeleteTask,
    useCompleteTask,
    useArchiveTask,
    useAddComment,
    useGetAnalytics,
    useGetReminderStats,
    useBulkUpdate,
    useBulkDelete,
  };
};