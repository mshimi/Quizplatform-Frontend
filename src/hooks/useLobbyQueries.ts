import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createLobby, joinLobby, cancelLobby, getWaitingLobbies } from '../service/lobbyService';
import { useNavigate } from 'react-router-dom';

// Create a query key factory for consistency
const lobbyKeys = {
    all: ['lobbies'] as const,
    waiting: () => [...lobbyKeys.all, 'waiting'] as const,
};

/**
 * Hook to fetch the list of waiting lobbies.
 */
export const useWaitingLobbies = () => {
    return useQuery({
        queryKey: lobbyKeys.waiting(),
        queryFn: getWaitingLobbies,
    });
};

/**
 * Mutation hook to create a new lobby.
 */
export const useCreateLobby = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: createLobby,
        onSuccess: (data) => {
           //  After creating a lobby, navigate to the new lobby's page
            navigate(`/lobbies/${data.id}`);
            // Invalidate the list of waiting lobbies to trigger a refetch
            queryClient.invalidateQueries({ queryKey: lobbyKeys.waiting() });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: lobbyKeys.waiting() });
        },
    });
};

/**
 * Mutation hook to join a lobby.
 */
export const useJoinLobby = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: joinLobby,
        onSuccess: (data) => {
            navigate(`/lobbies/${data.id}`);
            queryClient.invalidateQueries({ queryKey: lobbyKeys.waiting() });
        },
    });
};

/**
 * Mutation hook to cancel a lobby.
 */
export const useCancelLobby = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelLobby,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lobbyKeys.waiting() });
        },
    });
};