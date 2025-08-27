import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getChangeRequestsByModule,
    getChangeRequestsForFollowedModules,
    getChangeRequestsByQuestion,
    addChangeRequest,
    voteForChangeRequest,
} from '../service/questionChangeService';
import type {ChangeRequestStatus, CreateChangeRequest, Vote} from '../types';

// It's a good practice to create a query key factory to ensure consistency
const questionChangeKeys = {
    all: ['questionChanges'] as const,
    byModule: (moduleId: string) => [...questionChangeKeys.all, 'module', moduleId] as const,
    followedModules: () => [...questionChangeKeys.all, 'followed'] as const,
    byQuestion: (questionId: string) => [...questionChangeKeys.all, 'question', questionId] as const,
};

/**
 * Hook to fetch change requests for a specific module.
 * @param moduleId - The ID of the module.
 * @param page - The page number.
 * @param size - The page size.
 */
export const useChangeRequestsByModule = (moduleId: string, page = 0, size = 10) => {
    return useQuery({
        queryKey: [...questionChangeKeys.byModule(moduleId), page, size],
        queryFn: () => getChangeRequestsByModule(moduleId, page, size),
        enabled: !!moduleId, // Only run the query if moduleId is available
    });
};

/**
 * Hook to fetch change requests for modules the current user follows.
 * @param page - The page number.
 * @param size - The page size.
 */
export const useChangeRequestsForFollowedModules = (page = 0, size = 10,status: ChangeRequestStatus = 'PENDING') => {
    return useQuery({
        queryKey: [...questionChangeKeys.followedModules(), page, size,status],
        queryFn: () => getChangeRequestsForFollowedModules(page, size,status),
    });
};

/**
 * Hook to fetch change requests for a specific question.
 * @param questionId - The ID of the question.
 * @param page - The page number.
 * @param size - The page size.
 */
export const useChangeRequestsByQuestion = (questionId: string, page = 0, size = 10) => {
    return useQuery({
        queryKey: [...questionChangeKeys.byQuestion(questionId), page, size],
        queryFn: () => getChangeRequestsByQuestion(questionId, page, size),
        enabled: !!questionId,
    });
};

/**
 * Mutation hook to add a new change request for a question.
 */
export const useAddChangeRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
                         questionId,
                         requestDto,
                     }: {
            questionId: string;
            requestDto: CreateChangeRequest;
        }) => addChangeRequest(questionId, requestDto),
        onSuccess: (_, { questionId }) => {
            // Invalidate queries related to the specific question to refetch and show the new request
            queryClient.invalidateQueries({ queryKey: questionChangeKeys.byQuestion(questionId) });
            // You might also want to invalidate module-level requests if they are displayed on the same page
            // queryClient.invalidateQueries({ queryKey: questionChangeKeys.all });
        },
    });
};

/**
 * Mutation hook to vote on a change request.
 */
export const useVoteForChangeRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
                         changeRequestId,
                         voteDto,
                     }: {
            changeRequestId: string;
            voteDto: Vote;
        }) => voteForChangeRequest(changeRequestId, voteDto),
        onSuccess: () => {
            // Invalidate all change request queries to reflect the new vote count
            queryClient.invalidateQueries({ queryKey: questionChangeKeys.all });
        },
    });
};