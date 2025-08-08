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