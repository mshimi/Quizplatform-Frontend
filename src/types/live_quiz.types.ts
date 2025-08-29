// src/api/liveQuizApi.ts


export type StartLiveSessionResponseDto = {
    sessionId: string;
    startAt: string; // ISO
    totalQuestions: number;
    questionDurationSec: number;
    bufferDurationSec: number;
};

export type SubmitLiveAnswerDto = {
    questionIndex: number;
    answerId: string;
};

export type SessionStateDto = {
    status: 'PLANNED' | 'COUNTDOWN' | 'RUNNING' | 'FINISHED' | 'CANCELLED';
    currentIndex: number;
    totalQuestions: number;
    startAt: string | null;
    endsAt: string | null;
    question: null | {
        id: string;
        text: string;
        answers: { id: string; text: string }[];
    };
    you: { score: number; answered: boolean };
};

