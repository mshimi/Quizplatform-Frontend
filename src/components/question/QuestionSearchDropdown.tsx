import React, { useState, useRef, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchQuestions } from '../../service/questionService';
import type { QuestionSummary } from '../../types';
import SpinnerIcon from '../../common/icons/SpinnerIcon';

interface QuestionSearchDropdownProps {
    moduleId: string;
    onQuestionSelect: (question: QuestionSummary) => void;
    questionId: string
}

const QuestionSearchDropdown = ({ moduleId, onQuestionSelect, questionId }: QuestionSearchDropdownProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // --- NEW: State for dropdown visibility

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['questions', 'search', moduleId, debouncedSearchTerm],
        queryFn: ({ pageParam = 0 }) => searchQuestions(moduleId, debouncedSearchTerm, pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage.number < lastPage.totalPages - 1 ? lastPage.number + 1 : undefined;
        },

        enabled: isDropdownOpen, // --- CHANGE: Query is enabled when the dropdown is open
    });

    const observer = useRef<IntersectionObserver | null>(null);
    const lastQuestionElementRef = useCallback((node: HTMLLIElement) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleQuestionSelect = (question: QuestionSummary) => {
        onQuestionSelect(question);
        setIsDropdownOpen(false); // Close dropdown after selection
    };


    return (
        <div className="relative" onBlur={() => setIsDropdownOpen(false)}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)} // --- NEW: Open dropdown on focus
                placeholder="Frage suchen..."
                className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {isDropdownOpen && isLoading && <div className="p-4 text-center">Lade...</div>}
            {isDropdownOpen && data && (
                <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {data.pages.map((page, i) => (
                        <React.Fragment key={i}>
                            {page.content.filter(question => question.id !== questionId).map((question, index) => {
                                const isLastElement = data.pages.length - 1 === i && page.content.length - 1 === index;
                                return (
                                    <li
                                        ref={isLastElement ? lastQuestionElementRef : null}
                                        key={question.id}
                                        onMouseDown={() => handleQuestionSelect(question)} // Use onMouseDown to prevent onBlur from firing first
                                        className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                                    >
                                        {question.questionText}
                                    </li>
                                );
                            })}
                        </React.Fragment>
                    ))}
                    {isFetchingNextPage && (
                        <li className="flex justify-center items-center p-4">
                            <SpinnerIcon />
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default QuestionSearchDropdown;