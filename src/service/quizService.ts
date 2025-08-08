// service/quizService.ts
import api from './api';
import type {Page, QuizStatus, QuizSummary} from '../types';

/**
 * Fetches a paginated history of the current user's quiz attempts.
 * @param page - The page number to fetch.
 * @param size - The number of items per page.
 */
export const getQuizHistory = async (page = 0, size = 8, status: QuizStatus | null = null): Promise<Page<QuizSummary>> => {
    const {data} = await api.get('/quizzes', {
        params: {
            pageNumber: page,
            pageSize: size,
            ...(status && {status}),
        },
    });
    return data;
};
