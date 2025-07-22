// service/moduleService.ts
import api from './api';
import type {ModuleListItem, Page} from '../types';

/**
 * Fetches a paginated list of all modules.
 * @param page - The page number to fetch.
 * @param size - The number of items per page.
 */
export const getAllModules = async (page = 0, size = 9): Promise<Page<ModuleListItem>> => {
    const { data } = await api.get('/modules', {
        params: {
            page,
            size,
        },
    });
    return data;
};

/**
 * Toggles the "follow" status for a given module.
 * @param moduleId - The ID of the module to follow or unfollow.
 * @returns The new follow status.
 */
export const toggleFollowModule = async (moduleId: string): Promise<{ isFollowing: boolean }> => {
    const { data } = await api.post(`/modules/${moduleId}/toggle-follow`);
    return data;
};

/**
 * Fetches a paginated list of modules the current user is following.
 * @param page - The page number to fetch.
 * @param size - The number of items per page.
 */
export const getFollowedModules = async (page = 0, size = 4): Promise<Page<ModuleListItem>> => {
    const { data } = await api.get('/modules/followed', {
        params: {
            pageNumber: page,
            pageSize: size,
        },
    });
    return data;
};