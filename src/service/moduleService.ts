// service/moduleService.ts
import api from './api';
import type {ModuleDetail, ModuleListItem, Page} from '../types';

export interface ModuleQueryParams {
    page?: number;
    size?: number;
    title?: string;
    followed?: boolean | null; // null for all, true for followed, false for not followed
    sortBy?: 'title' | 'numberOfChoiceQuestions' | 'likeCount';
    sortDirection?: 'asc' | 'desc';
}

export const getAllModules = async (params: ModuleQueryParams = {}): Promise<Page<ModuleListItem>> => {

    if(params.sortBy === "numberOfChoiceQuestions" || params.sortBy === "likeCount") {
        params.sortDirection = "desc";
    }

    // Set default values for pagination
    const queryParams = {
        pageNumber: params.page ?? 0,
        pageSize: params.size ?? 15,
        title: params.title,
        isFollowed: params.followed,
        sort: params.sortBy ? `${params.sortBy},${params.sortDirection ?? 'asc'}` : undefined,
    };

    const { data } = await api.get('/modules', { params: queryParams });
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


export const getModuleDetails = async (moduleId: string, page = 0, size = 10): Promise<ModuleDetail> => {
    const { data } = await api.get(`/modules/${moduleId}`, {
        params: {
            pageNumber: page,
            pageSize: size,
        },
    });
    console.log(data);
    return data;
};