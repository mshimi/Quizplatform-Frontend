// components/quiz/StatusFilter.tsx

import type { QuizStatus } from '../../types';

interface StatusFilterProps {
    currentFilter: QuizStatus | null;
    onFilterChange: (status: QuizStatus | null) => void;
}

const filterOptions: { label: string; value: QuizStatus | null }[] = [
    { label: 'Alle', value: null },
    { label: 'Abgeschlossen', value: 'COMPLETED' },
    { label: 'In Bearbeitung', value: 'IN_PROGRESS' },
];

const StatusFilter = ({ currentFilter, onFilterChange }: StatusFilterProps) => {
    const baseStyle = "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
    const activeStyle = "bg-indigo-600 text-white shadow-sm";
    const inactiveStyle = "bg-gray-100 text-gray-700 hover:bg-gray-200";

    return (
        <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
                <button
                    key={option.label}
                    onClick={() => onFilterChange(option.value)}
                    className={`${baseStyle} ${currentFilter === option.value ? activeStyle : inactiveStyle}`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export default StatusFilter;