import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
    getAllModules,
    getFollowedModules,
    getModuleDetails,
    type ModuleQueryParams,
    toggleFollowModule
} from '../service/moduleService';

/**
 * Custom Hook zum Abrufen der vom Benutzer gefolgten Module.
 * Kapselt die useQuery-Logik für diese spezifische Datenanforderung.
 */

interface FollowedModulesOptions {
    page?: number;
    size?: number;
}

/**
 * Custom Hook zum Abrufen der vom Benutzer gefolgten Module.
 * @param options - Optionale Paginierungsparameter (page, size).
 */
export const useFollowedModules = (options: FollowedModulesOptions = {}) => {
    // Setzt Standardwerte, falls keine Optionen übergeben werden.
    const {page = 0, size = 3} = options;

    return useQuery({
        // Der queryKey enthält nun die Paginierung, um eindeutige Caches zu gewährleisten.
        queryKey: ['followedModules', page, size],
        queryFn: () => getFollowedModules(page, size),
    });
};

export const useModules = (params: ModuleQueryParams) => {
    return useQuery({
        // The query key includes all params to ensure data is refetched when they change
        queryKey: ['modules', params],
        queryFn: () => getAllModules(params),
        placeholderData: (prev) => prev, // For a smoother pagination experience
    });
};

/**
 * Custom Hook, der die Mutation zum Umschalten des "Folgen"-Status kapselt.
 * Enthält die onSuccess-Logik zur Invalidierung der Caches.
 */
export const useToggleFollow = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: toggleFollowModule,
        onSuccess: (_data , variables: string) => {

          //  console.log(data);
          //  console.log(context);

            queryClient.invalidateQueries({queryKey: ['followedModules']});
            queryClient.invalidateQueries({queryKey: ['moduleDetails', variables]});
            queryClient.invalidateQueries({queryKey: ['modules']});

        },
    });
};

/**
 * A hook to fetch the details of a specific module.
 * @param moduleId - The ID of the module.
 * @param page - The current page for the questions.
 */
export const useModuleDetails = (moduleId: string | undefined, page: number) => {
    return useQuery({
        // The query key includes the module ID and page to refetch when they change.
        queryKey: ['moduleDetails', moduleId, page],
        // The query function will only run if moduleId is defined.
        queryFn: () => getModuleDetails(moduleId!, page),
        // This ensures the query doesn't run with an undefined ID.
        enabled: !!moduleId,
        placeholderData: (prev) => prev,
    });
};
