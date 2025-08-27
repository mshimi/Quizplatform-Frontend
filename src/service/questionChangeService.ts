// src/service/questionChangeService.ts

import api from './api';
import type {
    Page,
    QuestionChangeRequest,
    CreateChangeRequest,
    Vote, ChangeRequestStatus,
} from '../types';

/**
 * Fetches a paginated list of change requests for a specific module.
 * @param moduleId The UUID of the module.
 * @param page The page number to fetch.
 * @param size The number of items per page.
 */
export const getChangeRequestsByModule = async (
    moduleId: string,
    page = 0,
    size = 10
): Promise<Page<QuestionChangeRequest>> => {
    const { data } = await api.get(`/change-requests/module/${moduleId}`, {
        params: { page, size },
    });
    return data;
};

/**
 * Fetches a paginated list of change requests for modules the current user follows.
 * @param page The page number to fetch.
 * @param size The number of items per page.
 */
export const getChangeRequestsForFollowedModules = async (
    page = 0,
    size = 10,
    status: ChangeRequestStatus // Add status parameter
): Promise<Page<QuestionChangeRequest>> => {
    const { data } = await api.get('/change-requests/followed-modules', {
        params: { page, size, status }, // Pass status to the API call
    });
    return data;
};

/**
 * Fetches a paginated list of change requests for a specific question.
 * @param questionId The UUID of the question.
 * @param page The page number to fetch.
 * @param size The number of items per page.
 */
export const getChangeRequestsByQuestion = async (
    questionId: string,
    page = 0,
    size = 10
): Promise<Page<QuestionChangeRequest>> => {
    const { data } = await api.get(`/change-requests/question/${questionId}`, {
        params: { page, size },
    });
    return data;
};

/**
 * Submits a new change request for a specific question.
 * @param questionId The UUID of the question to which the change request applies.
 * @param requestDto The DTO containing the details of the change request.
 */
export const addChangeRequest = async (
    questionId: string,
    requestDto: CreateChangeRequest
): Promise<void> => {
    await api.post(`/change-requests/question/${questionId}`, requestDto);
};

/**
 * Submits a vote for a specific change request.
 * @param changeRequestId The UUID of the change request to vote on.
 * @param voteDto The DTO containing the vote type.
 */
export const voteForChangeRequest = async (
    changeRequestId: string,
    voteDto: Vote
): Promise<void> => {
    await api.post(`/change-requests/${changeRequestId}/vote`, voteDto);
};