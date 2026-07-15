import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { voiceApi } from '../api/api';

// Voice Queries
export const useVoiceQueries = () => {
  const queryClient = useQueryClient();

  const useTranscribeAudio = () => {
    return useMutation({
      mutationFn: async (audioFile) => {
        const response = await voiceApi.transcribe(audioFile);
        return response.data;
      },
    });
  };

  const useCreateTaskFromVoice = () => {
    return useMutation({
      mutationFn: async (voiceData) => {
        const response = await voiceApi.createTask(voiceData);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  const useGetVoiceHistory = () => {
    return useQuery({
      queryKey: ['voice-history'],
      queryFn: async () => {
        const response = await voiceApi.getHistory();
        return response.data;
      },
    });
  };

  const useDeleteVoiceRecord = () => {
    return useMutation({
      mutationFn: async (id) => {
        await voiceApi.delete(id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['voice-history']);
      },
    });
  };

  return {
    useTranscribeAudio,
    useCreateTaskFromVoice,
    useGetVoiceHistory,
    useDeleteVoiceRecord,
  };
};