import api from './api';
import type { QuizLobby } from '../types';

/**
 * Creates a new quiz lobby for a given module.
 * @param moduleId - The ID of the module for the quiz.
 * @returns The newly created lobby object.
 */
export const createLobby = async (moduleId: string): Promise<QuizLobby> => {
    const { data } = await api.post<QuizLobby>(`/lobbies/create/${moduleId}`);
    return data;
};

/**
 * Joins an existing quiz lobby.
 * @param lobbyId - The ID of the lobby to join.
 * @returns The updated lobby object.
 */
export const joinLobby = async (lobbyId: string): Promise<QuizLobby> => {
    const { data } = await api.post<QuizLobby>(`/lobbies/join/${lobbyId}`);
    return data;
};

/**
 * Cancels a quiz lobby. This can only be done by the host.
 * @param lobbyId - The ID of the lobby to cancel.
 */
export const cancelLobby = async (lobbyId: string): Promise<void> => {
    await api.post(`/lobbies/cancel/${lobbyId}`);
};

/**
 * Fetches a list of all lobbies currently in the 'WAITING' state.
 * @returns A list of waiting lobby objects.
 */
export const getWaitingLobbies = async (): Promise<QuizLobby[]> => {
    const { data } = await api.get<QuizLobby[]>('/lobbies/waiting');
    return data;
};


export const getLobby = async (lobbyId: string): Promise<QuizLobby> => {
    const { data } = await api.get<QuizLobby>(`/lobbies/${lobbyId}`);
    return data;
};