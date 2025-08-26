import api from './api';
import type { StatisticsData } from '../types';

/**
 * Fetches the user's statistics from the backend.
 * @param timeframe - The selected time period (e.g., "Gesamt", "Heute").
 * @returns A promise that resolves to the user's statistics data.
 */
export const getStatistics = async (timeframe: string): Promise<StatisticsData> => {
    const { data } = await api.get('/statistics', {
        params: {
            timeframe: timeframe,
        },
    });
    return data;
};