import type {ModuleQueryParams} from "../../service/moduleService.ts";
import GridIcon from "../../common/icons/GridIcon.tsx";
import ListIcon from "../../common/icons/ListIcon.tsx";
import React, {useEffect, useRef, useState} from "react";
// --- Helper Data & Types ---
// --- Icon Components for Custom Dropdown ---
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const ArrowUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
);

const ArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


// --- Helper Data & Types ---
interface FilterBarProps {
    filters: Omit<ModuleQueryParams, 'page' | 'title'>;
    setFilters: React.Dispatch<React.SetStateAction<Omit<ModuleQueryParams, 'page' | 'title'>>>;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    viewMode: 'grid' | 'list';
    setViewMode: React.Dispatch<React.SetStateAction<'grid' | 'list'>>;
}

const followFilterOptions: { label: string; value: boolean | null }[] = [
    { label: 'Alle Module', value: null },
    { label: 'Meine Module', value: true },
    { label: 'Weitere Module', value: false },
];

const sortOptions: { label: string; value: ModuleQueryParams['sortBy'] }[] = [
    { label: 'Alphabetisch', value: 'title' },
    { label: 'Anzahl Fragen', value: 'numberOfChoiceQuestions' },
    { label: 'Anzahl Follower', value: 'likeCount' },
];


// --- Main FilterBar Component ---
const FilterBar = ({ filters, setFilters, setSearchTerm, viewMode, setViewMode }: FilterBarProps) => {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    // Effect to close the dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [sortRef]);

    const handleFollowFilterChange = (value: boolean | null) => {
        setFilters(prev => ({ ...prev, followed: value }));
    };

    const handleSortChange = (value: ModuleQueryParams['sortBy']) => {
        setFilters(prev => ({ ...prev, sortBy: value }));
        setIsSortOpen(false); // Close dropdown after selection
    };

    const toggleSortDirection = () => {
        setFilters(prev => ({ ...prev, sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc' }));
    };

    const currentSortLabel = sortOptions.find(opt => opt.value === filters.sortBy)?.label;

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="w-full md:w-auto">
                <input
                    type="text"
                    placeholder="Module suchen..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition duration-150 ease-in-out"
                />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Follow Status Filter */}
                <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                    {followFilterOptions.map(option => (
                        <button
                            key={option.label}
                            onClick={() => handleFollowFilterChange(option.value)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                                filters.followed === option.value
                                    ? 'bg-white text-indigo-600 shadow'
                                    : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Sort Controls */}
                <div className="flex items-center gap-2">
                    {/* Custom Sort Dropdown */}
                    <div className="relative" ref={sortRef}>
                        <button
                            onClick={() => setIsSortOpen(prev => !prev)}
                            className="flex items-center justify-between w-44 px-3 py-2 text-sm font-medium text-left text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
                        >
                            <span>{currentSortLabel}</span>
                            <ChevronDownIcon className={`w-5 h-5 ml-2 -mr-1 text-gray-400 transform transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isSortOpen && (
                            <div className="absolute z-10 w-44 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    {sortOptions.map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSortChange(option.value)}
                                            className={`w-full text-left block px-4 py-2 text-sm ${
                                                filters.sortBy === option.value ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                                            } hover:bg-indigo-50 hover:text-indigo-700`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Sort Direction Toggle */}
                    <button
                        onClick={toggleSortDirection}
                        className="p-2 text-gray-500 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
                        aria-label="Sortierrichtung wechseln"
                    >
                        {filters.sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    </button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}
                        aria-label="Grid View"
                    >
                        <GridIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}
                        aria-label="List View"
                    >
                        <ListIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;