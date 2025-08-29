import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {createLobby, joinLobby, cancelLobby, getWaitingLobbies, getLobby, leaveLobby} from '../service/lobbyService';
import { useNavigate } from 'react-router-dom';

// Create a query key factory for consistency
export const  lobbyKeys = {
    all: ['lobbies'] as const,
    waiting: () => [...lobbyKeys.all, 'waiting'] as const,
    detail: (id: string) => [...lobbyKeys.all, 'detail', id] as const, // --- ADD THIS ---

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


export const useLobby = (id?: string) =>
    useQuery({
        queryKey: id ? lobbyKeys.detail(id) : ['__disabled__'],
        queryFn: () => getLobby(id!),
        enabled: !!id,
        refetchOnMount: 'always',
    });


export const useLeaveLobby = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (lobbyId: string) => leaveLobby(lobbyId),
        onSuccess: (_data, lobbyId) => {
            // Update lists & detail; the WS event will also refresh, this is just snappy UX
            qc.invalidateQueries({ queryKey: lobbyKeys.waiting() });
            qc.removeQueries({ queryKey: lobbyKeys.detail(lobbyId) });
        },
    });
};