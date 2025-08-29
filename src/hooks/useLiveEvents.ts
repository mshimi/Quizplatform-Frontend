// src/hooks/useLiveEvents.ts
import { useEffect, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import { useQueryClient } from '@tanstack/react-query';
import { liveKeys } from './useLiveQuiz';
import type {
    LiveEvent,
    QuestionEnd,
    QuestionShow,
    QuizAborted,
    QuizEnded,
    QuizStarted,
    SessionStateDto
} from "../types";


type Handlers = Partial<{
    onStarted: (e: QuizStarted) => void;
    onQuestionShow: (e: QuestionShow) => void;
    onQuestionEnd: (e: QuestionEnd) => void;
    onEnded: (e: QuizEnded) => void;
    onAborted: (e: QuizAborted) => void;
}>;

export function useLiveEvents(lobbyId?: string, sessionId?: string, handlers?: Handlers) {
    const { subscribe, unsubscribe } = useWebSocket();
    const qc = useQueryClient();

    const handlersRef = useRef(handlers);
    handlersRef.current = handlers;

    useEffect(() => {
        if (!lobbyId) return;
        const topic = `/topic/lobby/${lobbyId}`;

        const cb = (evt: LiveEvent) => {
            switch (evt.type) {

              //  case 'QUIZ_STARTED': {
                //      handlersRef.current?.onStarted?.(evt);
                //      // Optional: initial cache seed
                //      if (evt.sessionId) {
                        //           qc.setQueryData<SessionStateDto>(liveKeys.session(evt.sessionId), (prev) => ({
                //            status: 'COUNTDOWN',
                                //            currentIndex: -1,
                //            totalQuestions: evt.totalQuestions,
                //             startAt: evt.startAt,
                                //             endsAt: null,
                //             question: null,
                //             you: prev?.you ?? { score: 0, answered: false },
                //           }));
                //        }
                //       break;
                //    }
                case 'QUESTION_SHOW': {
                    handlersRef.current?.onQuestionShow?.(evt);
                    if (sessionId && evt.sessionId === sessionId) {
                        qc.setQueryData<SessionStateDto>(liveKeys.session(sessionId), (prev) => ({
                            ...(prev ?? {
                                totalQuestions: evt.index + 1,
                                you: { score: 0, answered: false },
                            }),
                            status: 'RUNNING',
                            currentIndex: evt.index,
                            startAt: prev?.startAt ?? null,
                            endsAt: evt.endsAt,
                            question: evt.question,
                            you: { ...(prev?.you ?? { score: 0, answered: false }), answered: false },
                        }));
                    }
                    break;
                }
                case 'QUESTION_END': {
                    handlersRef.current?.onQuestionEnd?.(evt);
                    if (sessionId && evt.sessionId === sessionId) {
                        // lock UI; show correct answer (im UI)
                        qc.setQueryData<SessionStateDto>(liveKeys.session(sessionId), (prev) => prev ? {
                            ...prev,
                            endsAt: null,
                        } : prev);
                    }
                    break;
                }
                case 'QUIZ_ENDED': {
                    handlersRef.current?.onEnded?.(evt);
                    if (sessionId && evt.sessionId === sessionId) {
                        qc.setQueryData<SessionStateDto>(liveKeys.session(sessionId), (prev) => prev ? {
                            ...prev,
                            status: 'FINISHED',
                            endsAt: null,
                        } : prev);
                    }
                    break;
                }
                case 'QUIZ_ABORTED': {
                    handlersRef.current?.onAborted?.(evt);
                    break;
                }
            }
        };

        subscribe<LiveEvent>(topic, cb);
        return () => {
            try { unsubscribe(topic); } catch { /* empty */ }
        };
    }, [lobbyId, sessionId, subscribe, unsubscribe, qc]);
}
