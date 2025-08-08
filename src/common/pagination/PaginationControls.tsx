// components/quiz/PaginationControls.tsx

import React from 'react';

// --- Helper Types & Interfaces ---
interface PaginationControlsProps {
    currentPage: number; // 0-indexed
    totalPages: number;
    onPageChange: (page: number) => void;
    isFetching: boolean;
}

const DOTS = '...';

// --- Helper function to generate the page numbers array ---
const usePaginationRange = (currentPage: number, totalPages: number, siblingCount = 1) => {
    return React.useMemo(() => {
        const totalPageNumbers = siblingCount + 5;

        // Case 1: If the number of pages is less than the page numbers we want to show
        if (totalPageNumbers >= totalPages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 0);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);

        const shouldShowLeftDots = leftSiblingIndex > 1;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        // Case 2: No left dots to show, but right dots to be shown
        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, DOTS, totalPages];
        }

        // Case 3: No right dots to show, but left dots to be shown
        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
            return [firstPageIndex, DOTS, ...rightRange];
        }

        // Case 4: Both left and right dots to be shown
        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i + 1);
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }

        return []; // Fallback
    }, [currentPage, totalPages, siblingCount]);
};


// --- Icon Components ---
const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);


// --- Main Pagination Component ---
const PaginationControls = ({ currentPage, totalPages, onPageChange, isFetching }: PaginationControlsProps) => {

    const paginationRange = usePaginationRange(currentPage, totalPages);

    // Don't render component if there's only one page or less
    if (totalPages <= 1) {
        return null;
    }

    const handlePrev = () => onPageChange(currentPage - 1);
    const handleNext = () => onPageChange(currentPage + 1);

    const baseButton = "flex items-center justify-center h-10 w-10 rounded-full text-sm font-medium transition-colors duration-200";
    const inactiveButton = "text-gray-600 hover:bg-indigo-100 hover:text-indigo-600";
    const activeButton = "bg-indigo-600 text-white font-bold shadow-md pointer-events-none";
    const disabledButton = "text-gray-300 cursor-not-allowed";

    return (
        <nav aria-label="Pagination" className="mt-8 pt-4 border-t">
            <ul className="flex justify-center items-center gap-2">
                {/* Previous Page Button */}
                <li>
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 0 || isFetching}
                        className={`${baseButton} ${currentPage === 0 ? disabledButton : inactiveButton}`}
                        aria-label="Vorherige Seite"
                    >
                        <ChevronLeftIcon />
                    </button>
                </li>

                {/* Page Number Buttons */}
                {paginationRange.map((pageNumber, index) => {
                    if (pageNumber === DOTS) {
                        return (
                            <li key={`${DOTS}-${index}`} className={`${baseButton} text-gray-400`}>
                                &#8230;
                            </li>
                        );
                    }
                    // Page numbers from hook are 1-indexed, convert to 0-indexed for onPageChange
                    const pageIndex = (pageNumber as number) - 1;
                    return (
                        <li key={pageNumber}>
                            <button
                                onClick={() => onPageChange(pageIndex)}
                                disabled={isFetching}
                                className={`${baseButton} ${currentPage === pageIndex ? activeButton : inactiveButton}`}
                                aria-current={currentPage === pageIndex ? 'page' : undefined}
                            >
                                {pageNumber}
                            </button>
                        </li>
                    );
                })}

                {/* Next Page Button */}
                <li>
                    <button
                        onClick={handleNext}
                        disabled={currentPage >= totalPages - 1 || isFetching}
                        className={`${baseButton} ${currentPage >= totalPages - 1 ? disabledButton : inactiveButton}`}
                        aria-label="Nächste Seite"
                    >
                        <ChevronRightIcon />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default PaginationControls;