import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateQuestionRequest } from '../types';
import {createQuestion} from "../service/createQuestion.ts";

interface CreateQuestionVariables {
    moduleId: string;
    questionData: CreateQuestionRequest;
}

export const useCreateQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ moduleId, questionData }: CreateQuestionVariables) =>
            createQuestion(moduleId, questionData),

        // When the mutation is successful, invalidate the module details query.
        // This tells react-query to re-fetch the module data, so the UI
        // updates automatically with the new question.
        onSuccess: (data, variables) => {
            console.log('Question created successfully:', data);
            // Invalidate queries for the specific module to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ['moduleDetails', variables.moduleId] });
        },
        onError: (error) => {
            console.error('Error creating question:', error);
            // Here you could show a toast notification to the user
        },
    });
};