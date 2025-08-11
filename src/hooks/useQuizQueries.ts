import { useQuery } from '@tanstack/react-query';
import {getQuizDetails, getQuizHistory} from '../service/quizService';
import type {QuizStatus} from "../types";

/**
 * Custom Hook to fetch the user's quiz history.
 */
export const useQuizHistory = (page: number, status: QuizStatus | null) => {
    return useQuery({
        queryKey: ['quizHistory', page, status],
        queryFn: () => getQuizHistory(page, 6, status), // Fetch the 5 most recent for the dashboard
        placeholderData: (prev)=> prev,
    });
};


export const useQuizDetails = (quizId: string | undefined) => {
    return useQuery({
        // The query key uniquely identifies this query.
        queryKey: ['quizDetails', quizId],
        // The query function will only run if quizId is not undefined.
        queryFn: () => getQuizDetails(quizId!),
        // This 'enabled' option is a safeguard to prevent the query from running with an undefined ID.
        enabled: !!quizId,
        placeholderData: (prev)=> prev,
    });
};