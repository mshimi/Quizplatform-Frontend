// src/types/questionChange.types.ts

import type { ChoiceQuestion } from './question.type';

export type ChangeRequestType =
    | 'INCORRECT_QUESTION_TEXT'
    | 'INCORRECT_ANSWER'
    | 'SUGGEST_DELETION'
    | 'DUPLICATE_QUESTION';

export type ChangeRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type VoteType = 'APPROVE' | 'REJECT';

// Base interface with common properties for all request types
interface BaseQuestionChangeRequest {
    id: string;
    requesterUsername: string;
    requestType: ChangeRequestType;
    status: ChangeRequestStatus;
    justification: string;
    createdAt: string;
    resolvedAt?: string;
    question: ChoiceQuestion;
    positiveVotes: number;
    negativeVotes: number;
    currentUserHasVoted: boolean;
}

// Specific interface for Incorrect Question Text requests
export interface IncorrectQuestionTextRequest extends BaseQuestionChangeRequest {
    requestType: 'INCORRECT_QUESTION_TEXT';
    proposedText: string;
}

export interface ProposedAnswer {
    id: string;
    text: string;
    isCorrect: boolean;
}

// Specific interface for Incorrect Answer requests
export interface IncorrectAnswerRequest extends BaseQuestionChangeRequest {
    requestType: 'INCORRECT_ANSWER';
    // Remove old single-change properties
    // targetAnswerId?: string;
    // oldAnswerText?: string;
    // oldAnswerIsCorrect?: boolean;
    // proposedText?: string;
    // proposedIsCorrect?: boolean;

    // Add new property for the list of proposed answers
    proposedAnswers: ProposedAnswer[];
}

// Specific interface for Deletion requests
export interface SuggestDeletionRequest extends BaseQuestionChangeRequest {
    requestType: 'SUGGEST_DELETION';
}

// Specific interface for Duplicate Question requests
export interface DuplicateQuestionRequest extends BaseQuestionChangeRequest {
    requestType: 'DUPLICATE_QUESTION';
    duplicateOfQuestion?: ChoiceQuestion;
}

// A discriminated union of all possible change request types
export type QuestionChangeRequest =
    | IncorrectQuestionTextRequest
    | IncorrectAnswerRequest
    | SuggestDeletionRequest
    | DuplicateQuestionRequest;


// Types for creating new requests (unchanged)
export interface CreateChangeRequest {
    type: ChangeRequestType;
    justification: string;
    newQuestionText?: string;
    newAnswers?: { text: string; isCorrect: boolean }[];
    duplicateQuestionId?: string;
}

export interface Vote {
    voteType: VoteType;
}
