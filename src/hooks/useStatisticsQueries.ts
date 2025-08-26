import { useQuery } from '@tanstack/react-query';
import { getStatistics } from '../service/statisticsService';

/**
 * Custom hook to fetch user statistics for a given timeframe.
 * @param timeframe - The selected time filter.
 */
export const useStatistics = (timeframe: string) => {
    return useQuery({
        // The query key includes the timeframe, so data is automatically refetched
        // when the user selects a different time filter.
        queryKey: ['statistics', timeframe],
        queryFn: () => getStatistics(timeframe),
        // placeholderData keeps the old data visible while new data is loading,
        // which makes for a smoother user experience.
        placeholderData: (previousData) => previousData,
    });
};