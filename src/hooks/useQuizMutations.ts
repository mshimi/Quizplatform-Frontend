import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {finishQuiz, startQuiz, submitAnswer} from '../service/quizService';
import type { QuizDetail } from '../types';

export const useStartQuiz = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation<QuizDetail, Error, string>({
        mutationFn: startQuiz, // The function that performs the async task
        onSuccess: (data) => {
            // This runs after the API call is successful
            console.log('Quiz started successfully:', data);

            // Invalidate quiz history so it updates if the user navigates back
            queryClient.invalidateQueries({ queryKey: ['quizHistory'] });

            // Redirect the user to the new quiz player page
            navigate(`/quizzes/${data.id}`);
        },
        onError: (error) => {
            console.error('Failed to start quiz:', error);
            // Here you could show an error notification to the user
            alert('Das Quiz konnte nicht gestartet werden. Bitte versuchen Sie es erneut.');
        },
    });
};


interface SubmitAnswerVariables {
    quizId: string;
    questionId: string;
    selectedAnswerId: string;
}

export const useSubmitAnswer = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, SubmitAnswerVariables>({
        mutationFn: ({ quizId, questionId, selectedAnswerId }) =>
            submitAnswer(quizId, questionId, selectedAnswerId),
        onSuccess: (_, variables) => {
            console.log('Answer submitted successfully. Invalidating quiz details cache.');


            queryClient.invalidateQueries({ queryKey: ['quizDetails', variables.quizId] });
        },

        onError: (error, variables) => {
            // Even though this is fire-and-forget, we should log if an error occurs.
            // This is crucial for debugging.
            console.error(`Failed to submit answer for question ${variables.questionId}:`, error);
        },
    });
};


export const useFinishQuiz = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: finishQuiz, // The service function to call

        // --- THIS IS THE KEY CHANGE ---
        // This onSuccess callback runs after the backend successfully marks the quiz as finished.
        onSuccess: (_, quizId) => {
            console.log(`Quiz ${quizId} finished. Invalidating cache to refetch results.`);

            // Invalidate the query for this specific quiz. This will automatically
            // trigger a refetch on the QuizPage, causing it to re-render with the results.
            queryClient.invalidateQueries({ queryKey: ['quizDetails', quizId] });
        },
        onError: (error) => {
            console.error('Failed to finish quiz:', error);
            alert('Das Quiz konnte nicht beendet werden.');
        },
    });
};