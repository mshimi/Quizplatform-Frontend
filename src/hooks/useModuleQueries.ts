import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFollowedModules, toggleFollowModule, getAllModules } from '../service/moduleService';

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
    const { page = 0, size = 3 } = options;

    return useQuery({
        // Der queryKey enthält nun die Paginierung, um eindeutige Caches zu gewährleisten.
        queryKey: ['followedModules', page, size],
        queryFn: () => getFollowedModules(page, size),
    });
};

/**
 * Custom Hook zum Abrufen aller Module (paginiert).
 * @param page Die Seitenzahl, die abgerufen werden soll.
 */
export const useAllModules = (page: number) => {
    return useQuery({
        queryKey: ['modules', page],
        queryFn: () => getAllModules(page, 9),
        placeholderData: (pre)=> pre, // Für eine flüssigere Paginierung
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
        onSuccess: () => {
            // Invalidiert beide relevanten Caches, um die UI konsistent zu halten
            queryClient.invalidateQueries({ queryKey: ['followedModules'] });
            queryClient.invalidateQueries({ queryKey: ['modules'] });
        },
    });
};
