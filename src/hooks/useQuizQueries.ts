import { useQuery } from '@tanstack/react-query';
import { getQuizHistory } from '../service/quizService';
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
