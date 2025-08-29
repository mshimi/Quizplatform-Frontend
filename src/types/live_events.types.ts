// src/types/live_events.type.ts
export type QuizStarted = {
    type: 'QUIZ_STARTED';
    sessionId: string;
    startAt: string; // ISO
    totalQuestions: number;
    questionDurationSec: number;
    bufferDurationSec: number;
};

export type QuestionShow = {
    type: 'QUESTION_SHOW';
    sessionId: string;
    index: number;
    endsAt: string; // ISO
    question: {
        id: string;
        text: string;
        answers: { id: string; text: string }[];
    };
};

export type QuestionEnd = {
    type: 'QUESTION_END';
    sessionId: string;
    index: number;
    correctAnswerId: string;
    leaderboard?: Array<{ userId: string; firstName: string; name: string; score: number }>;
};

export type QuizEnded = {
    type: 'QUIZ_ENDED';
    sessionId: string;
    leaderboard: Array<{ userId: string; firstName: string; name: string; score: number }>;
};

export type QuizAborted = {
    type: 'QUIZ_ABORTED';
    sessionId: string;
    reason: string;
};

export type LiveEvent = QuizStarted | QuestionShow | QuestionEnd | QuizEnded | QuizAborted;
