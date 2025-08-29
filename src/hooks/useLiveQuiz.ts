// src/hooks/useLiveQuiz.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {SessionStateDto, StartLiveSessionResponseDto, SubmitLiveAnswerDto} from "../types";
import {getLiveSessionState, startLiveSession, submitLiveAnswer} from "../service/liveQuizService.ts";


export const liveKeys = {
    session: (sessionId: string) => ['live', 'session', sessionId] as const,
};

export const useStartLiveSession = () => {
    return useMutation<StartLiveSessionResponseDto, unknown, { lobbyId: string }>({
        mutationFn: ({ lobbyId }) => startLiveSession(lobbyId),
    });
};

export const useLiveSessionState = (sessionId?: string) => {
    return useQuery<SessionStateDto>({
        queryKey: sessionId ? liveKeys.session(sessionId) : ['live', 'session', 'nil'],
        queryFn: () => getLiveSessionState(sessionId!),
        enabled: !!sessionId,
        refetchOnWindowFocus: false,
    });
};

export const useSubmitLiveAnswer = (sessionId: string) => {
    const qc = useQueryClient();
    return useMutation<void, unknown, SubmitLiveAnswerDto>({
        mutationFn: (body) => submitLiveAnswer(sessionId, body),
        onSuccess: () => {
            // Optional: optimistic lock – markiere answered=true im Cache
            const key = liveKeys.session(sessionId);
            const cur = qc.getQueryData<SessionStateDto>(key);
            if (cur && cur.status === 'RUNNING') {
                qc.setQueryData<SessionStateDto>(key, {
                    ...cur,
                    you: { ...cur.you, answered: true },
                });
            }
        },
    });
};
