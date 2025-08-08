// src/pages/ExploreModulesPage.tsx

import {useEffect, useState} from 'react';
import { useDebounce } from 'use-debounce'; // A handy hook for debouncing input
import { useModules, useToggleFollow } from '../hooks/useModuleQueries';
import ModuleCard from '../components/module/ModuleCard';
import ModuleCardSkeleton from '../components/module/ModuleCardSkeleton';
import ModuleListItem from '../components/module/ModuleListItem';
// import ModuleListItemSkeleton from '../components/module/ModuleListItemSkeleton'; // You would create this
import PaginationControls from '../common/pagination/PaginationControls';
// Assume you have icons for list and grid view

import type {ModuleQueryParams} from "../service/moduleService.ts";
import FilterBar from "../components/module/FilterBar.tsx";
import {useAutoAnimate} from "@formkit/auto-animate/react";




const ExploreModulesPage = () => {
    const [animationParent] = useAutoAnimate<HTMLDivElement>();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const [filters, setFilters] = useState<Omit<ModuleQueryParams, 'page' | 'title'>>({
        followed: null,
        sortBy: 'title',
        sortDirection: 'asc',
    });

    // Effect to reset the current page whenever a filter or search term changes
    useEffect(() => {
        setCurrentPage(0);
    }, [filters, debouncedSearchTerm]);

    const queryParams: ModuleQueryParams = {
        page: currentPage,
        size: viewMode === 'grid' ? 9 : 10,
        title: debouncedSearchTerm,
        ...filters,
    };

    const { data, isLoading, isError, isFetching } = useModules(queryParams);
    const toggleFollowMutation = useToggleFollow();

    const handleToggleFollow = async (moduleId: string) => {
        await toggleFollowMutation.mutateAsync(moduleId);
    };

    const renderContent = () => {
        if (isLoading) {
            const skeletons = Array.from({ length: 9 }, (_, i) => i);
            if (viewMode === 'grid') {
                return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skeletons.map(i => <ModuleCardSkeleton key={i} />)}
                </div>;
            }
            // You should create a ModuleListItemSkeleton for a better experience
            return <div className="space-y-4">{skeletons.map(i => <ModuleCardSkeleton key={i} />)}</div>;
        }

        if (isError) return <div className="text-center py-10 px-6 bg-red-50 text-red-700 rounded-lg">Module konnten nicht geladen werden.</div>;
        if (!data || data.content.length === 0) return <div className="text-center py-10 px-6 bg-blue-50 text-blue-700 rounded-lg">Keine Module für die aktuellen Filter gefunden.</div>;

        const content = viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.content.map(module => (
                    <ModuleCard
                        key={module.id}
                        module={module}
                        onToggleFollow={handleToggleFollow}
                        isToggling={toggleFollowMutation.isPending && toggleFollowMutation.variables === module.id}
                    />
                ))}
            </div>
        ) : (
            <div className="space-y-4">
                {data.content.map(module => (
                    <ModuleListItem
                        key={module.id}
                        module={module}
                        onToggleFollow={handleToggleFollow}
                        isToggling={toggleFollowMutation.isPending && toggleFollowMutation.variables === module.id}
                    />
                ))}
            </div>
        );

        return content;
    };

    return (
        <div className="py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Alle Module entdecken</h1>
                    <p className="text-lg text-gray-500 mt-2">Finden und folgen Sie Modulen, um Ihr Wissen zu erweitern.</p>
                </div>

                <FilterBar
                    setSearchTerm={setSearchTerm}
                    filters={filters}
                    setFilters={setFilters} // Pass the state dispatcher directly
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />

                <div ref={animationParent} className="relative min-h-[500px]">
                    {/* Content wrapper for blur/opacity effect */}
                    <div className={`transition-all duration-300 ${isFetching && data ? 'opacity-100 blur-3xl pointer-events-none' : ''}`}>
                        {renderContent()}
                    </div>

                    {/* Loading overlay for background fetches */}
                    {isFetching && data && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>

                {data && data.totalPages > 1 && (
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={data.totalPages}
                        onPageChange={setCurrentPage}
                        isFetching={isFetching}
                    />
                )}
            </div>
        </div>
    );
};

export default ExploreModulesPage;
