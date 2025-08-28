// src/hooks/useLobbyQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createLobby, joinLobby, cancelLobby, getWaitingLobbies, getLobby } from '../service/lobbyService';
import { useNavigate } from 'react-router-dom';
import type { QuizLobby } from '../types';

// Centralised query keys
export const lobbyKeys = {
    all: ['lobbies'] as const,
    waiting: () => [...lobbyKeys.all, 'waiting'] as const,
    detail: (id: string) => [...lobbyKeys.all, 'detail', id] as const,
};

/** Waiting list */
export const useWaitingLobbies = () =>
    useQuery({
        queryKey: lobbyKeys.waiting(),
        queryFn: getWaitingLobbies,
        staleTime: 0,
        refetchOnMount: 'always',
        refetchOnReconnect: 'always',
        refetchOnWindowFocus: false,
    });

/** Lobby detail */
export const useLobby = (id?: string) =>
    useQuery({
        queryKey: id ? lobbyKeys.detail(id) : ['__disabled__'],
        queryFn: () => getLobby(id!),
        enabled: !!id,
        refetchOnMount: 'always',
    });

/** Create lobby */
export const useCreateLobby = () => {
    const qc = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: createLobby, // (vars) => Promise<QuizLobby>
        onSuccess: (data: QuizLobby) => {
            // Seed caches so the target page and lists are instantly accurate
            qc.setQueryData(lobbyKeys.detail(data.id), data);
            qc.setQueryData(lobbyKeys.waiting(), (old?: QuizLobby[]) =>
                old ? [data, ...old] : [data]
            );
            navigate(`/lobbies/${data.id}`);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: lobbyKeys.waiting() });
        },
    });
};

/** Join lobby */
export const useJoinLobby = () => {
    const qc = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: joinLobby, // (lobbyId: string) => Promise<QuizLobby>
        onSuccess: (updated: QuizLobby) => {
            // Update detail
            qc.setQueryData(lobbyKeys.detail(updated.id), updated);
            // Replace in waiting list (DON'T filter it out)
            qc.setQueryData(lobbyKeys.waiting(), (old?: QuizLobby[]) =>
                old ? old.map(l => (l.id === updated.id ? updated : l)) : old
            );
            navigate(`/lobbies/${updated.id}`);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: lobbyKeys.waiting() });
        },
    });
};

/** Cancel lobby */
export const useCancelLobby = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: cancelLobby, // (lobbyId: string) => Promise<void | QuizLobby>
        onSuccess: (_data, lobbyId) => {
            // Drop from waiting list; optionally mark detail as cancelled
            qc.setQueryData(lobbyKeys.waiting(), (old?: QuizLobby[]) =>
                old ? old.filter(l => l.id !== lobbyId) : old
            );
            qc.invalidateQueries({ queryKey: lobbyKeys.detail(String(lobbyId)) });
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: lobbyKeys.waiting() });
        },
    });
};
