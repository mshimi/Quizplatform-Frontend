import { useQuery } from '@tanstack/react-query';
import { searchQuestions } from '../service/questionService';

/**
 * Custom hook to search for questions within a module.
 * @param moduleId - The ID of the module to search in.
 * @param searchTerm - The text to search for.
 */
export const useSearchQuestions = (moduleId: string, searchTerm: string) => {
    return useQuery({
        queryKey: ['questions', 'search', moduleId, searchTerm],
        queryFn: () => searchQuestions(moduleId, searchTerm),
        enabled: !!moduleId , // Only search when there's a moduleId and the search term is long enough
    });
};