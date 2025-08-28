// src/pages/QuizLobbyPage.tsx
import React, { useEffect, useRef } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useLobby, useCancelLobby, lobbyKeys } from '../hooks/useLobbyQueries';
import { useAuth } from '../hooks/useAuth';
import type { QuizLobby } from '../types';
import SpinnerIcon from '../common/icons/SpinnerIcon';
import { useWebSocket } from '../hooks/useWebSocket';
import { useQueryClient } from '@tanstack/react-query';

 function shallowEqual<T extends object>(
    a: T | null | undefined,
    b: T | null | undefined
): boolean {
    if (a === b) return true;
    if (!a || !b) return false;

    const aKeys = Object.keys(a) as Array<keyof T>;
    const bKeys = Object.keys(b) as Array<keyof T>;
    if (aKeys.length !== bKeys.length) return false;

    for (const key of aKeys) {
        if (!Object.prototype.hasOwnProperty.call(b, key)) return false;

        // Safe, typed indexing without `any`
        const av = (a as Record<PropertyKey, unknown>)[key as PropertyKey];
        const bv = (b as Record<PropertyKey, unknown>)[key as PropertyKey];

        if (av !== bv) return false;
    }
    return true;
}

const QuizLobbyPage: React.FC = () => {
    const { lobbyId } = useParams<{ lobbyId: string }>();
    const navigate = useNavigate(); // used only for cancel success
    const { user, isLoading: isUserLoading } = useAuth();
    const queryClient = useQueryClient();
    const { subscribe, unsubscribe } = useWebSocket();

    // fetch lobby detail
    const { data: lobby, isLoading: isLobbyLoading, isError } = useLobby(lobbyId);

    const cancelLobbyMutation = useCancelLobby();

    // keep ws fns stable for the effect
    const subscribeRef = useRef(subscribe);
    const unsubscribeRef = useRef(unsubscribe);
    useEffect(() => {
        subscribeRef.current = subscribe;
        unsubscribeRef.current = unsubscribe;
    }, [subscribe, unsubscribe]);

    // WS handler (stable via ref). We only update cache if data actually changed.
    const lastSnapshotRef = useRef<QuizLobby | null>(null);
    const handlerRef = useRef<(updated: QuizLobby) => void>(() => {});
    useEffect(() => {
        handlerRef.current = (updated: QuizLobby) => {
            if (!lobbyId) return;

            // Prevent redundant writes / render churn
            const prev =
                queryClient.getQueryData<QuizLobby>(lobbyKeys.detail(lobbyId)) ||
                lastSnapshotRef.current;

            if (prev && shallowEqual<QuizLobby>(prev, updated)) return;



            lastSnapshotRef.current = updated;
            queryClient.setQueryData(lobbyKeys.detail(lobbyId), updated);
        };
    }, [lobbyId, queryClient]);

    // Subscribe once per lobbyId; cleanup unsubscribes
    useEffect(() => {
        if (!lobbyId) return;
        const topic = `/topic/lobby/${lobbyId}`;
        const cb = (payload: QuizLobby) => handlerRef.current(payload);

        subscribeRef.current<QuizLobby>(topic, cb);
        return () => {
            try {
                unsubscribeRef.current(topic);
            } catch {
                // ignore
            }
        };
        // ONLY rerun when lobbyId changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lobbyId]);

    // Cancel on unmount if host leaves page — guard so it fires once
    const cancelledOnUnmount = useRef(false);
    useEffect(() => {
        return () => {
            if (!cancelledOnUnmount.current && lobby && user && lobby.host.email === user.email) {
                cancelledOnUnmount.current = true;
                cancelLobbyMutation.mutate(lobby.id);
            }
        };
    }, [lobby, user, cancelLobbyMutation]);

    const handleCancelLobby = () => {
        if (!lobbyId) return;
        cancelLobbyMutation.mutate(lobbyId, {
            onSuccess: () => navigate('/quizzes', { replace: true }),
        });
    };

    // -------- Render guards (safe redirects via <Navigate/>) --------
    if (!lobbyId) return <Navigate to="/quizzes" replace />;

    // While loading user or lobby
    if (isLobbyLoading || isUserLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <SpinnerIcon />
            </div>
        );
    }

    // If fetch errored OR lobby no longer exists
    if (isError || !lobby) {
        return <Navigate to="/quizzes" replace />;
    }

    // If server marked lobby as cancelled
    if (lobby.status === 'CANCELLED') {
        return <Navigate to="/quizzes" replace />;
    }

    // User must be participant
    const isParticipant = lobby.participants.some((p) => p.email === user?.email);
    if (!isParticipant) {
        return <Navigate to="/quizzes" replace />;
    }

    const isHost = user?.email === lobby.host.email;

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <h1 className="text-2xl font-bold text-slate-800">Warte auf Mitspieler...</h1>
                <p className="mt-2 text-slate-500">
                    Das Quiz für das Modul{' '}
                    <span className="font-semibold text-indigo-600">{lobby.module.title}</span> startet, sobald du es beginnst.
                </p>

                <div className="my-8">
                    <div className="text-lg font-bold text-slate-700 mb-4">
                        Teilnehmer ({lobby.participants.length})
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {lobby.participants.map((p) => (
                            <div
                                key={p.email}
                                className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-semibold"
                            >
                                {p.firstName} {p.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-10">
                    {isHost && (
                        <button
                            onClick={handleCancelLobby}
                            disabled={cancelLobbyMutation.isPending}
                            className="px-6 py-3 font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700"
                        >
                            {cancelLobbyMutation.isPending ? <SpinnerIcon /> : 'Lobby abbrechen'}
                        </button>
                    )}
                    <button
                        disabled={!isHost || lobby.participants.length < 2}
                        className="px-6 py-3 font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 disabled:bg-gray-400"
                    >
                        Quiz starten
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizLobbyPage;
