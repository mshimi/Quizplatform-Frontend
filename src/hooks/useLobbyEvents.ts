import { useEffect, useRef } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useQueryClient } from '@tanstack/react-query';
import { lobbyKeys } from '../hooks/useLobbyQueries';
import type { QuizLobby } from '../types';
import { shallowEqual } from '../utils/shallowEqual';
import { useNavigate } from 'react-router-dom';

export type LobbyEventType =
    | 'LOBBY_CREATED'
    | 'LOBBY_CANCELLED'
    | 'LOBBY_JOINED'
    | 'LOBBY_LEFT'
    | 'LOBBY_UPDATE'
    | 'QUIZ_STARTED';

export type LobbyEventDto = {
    type: LobbyEventType;
    lobby?: QuizLobby;
    lobbyId?: string;
    sessionId?: string;
    startAt?: string;
    totalQuestions?: number;
    questionDurationSec?: number;
    bufferDurationSec?: number;
};

type Options = {
    /** Call this right before we navigate away (suppresses auto-leave). */
    onBeforeNavigateToLive?: () => void;
    opts?: { onQuizStarted?: (e: LobbyEventDto) => void }
};

export function useLobbyEvents(lobbyId?: string, opts?: { onQuizStarted?: (e: LobbyEventDto) => void }) {
    const { subscribe, unsubscribe } = useWebSocket();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const lastSnapshotRef = useRef<QuizLobby | null>(null);
    const handlerRef = useRef<(evt: LobbyEventDto) => void>(() => {});
    const navigatedSessionRef = useRef<string | null>(null); // prevent double navigation

    useEffect(() => {
        handlerRef.current = (evt: LobbyEventDto) => {
            if (!lobbyId) return;

            switch (evt.type) {
                case 'LOBBY_CANCELLED': {
                    if (!evt.lobbyId || evt.lobbyId === lobbyId) {
                        navigate('/quizzes', { replace: true });
                    }
                    return;
                }
                case 'LOBBY_CREATED':
                case 'LOBBY_JOINED':
                case 'LOBBY_LEFT':
                case 'LOBBY_UPDATE': {
                    if (!evt.lobby) return;
                    const prev =
                        queryClient.getQueryData<QuizLobby>(lobbyKeys.detail(lobbyId)) ||
                        lastSnapshotRef.current;
                    if (prev && shallowEqual<QuizLobby>(prev, evt.lobby)) return;

                    lastSnapshotRef.current = evt.lobby;
                    queryClient.setQueryData(lobbyKeys.detail(lobbyId), evt.lobby);
                    return;
                }
                case 'QUIZ_STARTED': {
                    const sid = evt.sessionId;
                    if (!sid) return;

                    // Guard against double navigation
                    if (navigatedSessionRef.current === sid) return;
                    navigatedSessionRef.current = sid;

                    // CRITICAL: suppress auto-leave before we unmount the lobby page
                    try {
                      //  opts?.onBeforeNavigateToLive?.();
                    } catch {
                        // ignore
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    opts?.onQuizStarted?.(evt) ??
                    navigate(`/lobbies/${lobbyId}/live?sessionId=${evt.sessionId}`, { replace: true });
                    return;
                }
                default:
                    return;
            }
        };
    }, [lobbyId, navigate, queryClient, opts]);

    // subscribe per lobby
    useEffect(() => {
        if (!lobbyId) return;
        const topic = `/topic/lobby/${lobbyId}`;
        const cb = (payload: LobbyEventDto) => {
            // console.debug('WS lobby event', payload);
            handlerRef.current(payload);
        };

        subscribe<LobbyEventDto>(topic, cb);
        return () => {
            try {
                unsubscribe(topic);
            } catch {
                // ignore
            }
        };
    }, [lobbyId, subscribe, unsubscribe]);
}
