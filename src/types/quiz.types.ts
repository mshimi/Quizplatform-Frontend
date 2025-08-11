// types/quiz.types.ts

// Represents a single quiz summary item from your backend DTO
import type {ModuleSummary} from "./module.types.ts";


export type QuizStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface QuizSummary {
    id: string;
    module:ModuleSummary;
    numberOfQuestions: number;
    numberOfCorrectAnswers: number;
    completedAt: string;
    createdAt:string;
    status: QuizStatus;

}

export interface QuizAnswer {
    id: string;
    text: string;
    // Note: isCorrect is intentionally omitted for security
}

export interface QuizQuestion {
    id: string;
    questionText: string;
    answers: QuizAnswer[]; // Answers will be in a pre-shuffled order from the backend
}

export interface QuizDetail {
    id: string;
    module: {
        id: string;
        title: string;
    };
    status: QuizStatus;
    createdAt: string;
    questions: QuizQuestion[];
    selectedAnswers: Record<string, string>; // Maps questionId to selectedAnswerId

}

export interface SubmitAnswerRequest {
    questionId: string;
    selectedAnswerId: string;
}


export interface AnswerResult {
    id: string;
    text: string;
    correct: boolean;
    selected: boolean;
}

export interface QuestionResult {
    id: string;
    questionText: string;
    wasAnsweredCorrectly: boolean;
    answers: AnswerResult[];
}

export interface QuizResult {
    id: string;
    module: { id: string; title: string; };
    status: 'COMPLETED'; // The status will always be COMPLETED for this type
    completedAt: string;
    numberOfQuestions: number;
    numberOfCorrectAnswers: number;
    scorePercentage: number;
    questionResults: QuestionResult[];
}