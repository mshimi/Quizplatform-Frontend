import api from './api';
import type { Page, QuestionSummary } from '../types';

/**
 * Searches for questions within a specific module by a given search term.
 * @param moduleId - The ID of the module to search within.
 * @param searchTerm - The text to search for.
 * @param page - The page number to fetch.
 * @returns A paginated list of question summaries.
 */
export const searchQuestions = async (
    moduleId: string,
    searchTerm: string,
    page = 0
): Promise<Page<QuestionSummary>> => {
    const { data } = await api.get(`/questions/search/${moduleId}`, {
        params: {
            searchTerm,
            page,
            size: 10, // Default page size
        },
    });
    return data;
};