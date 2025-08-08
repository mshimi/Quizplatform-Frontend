// components/quiz/QuizHistorySection.tsx

import { useState } from 'react';
import { useQuizHistory } from '../../hooks/useQuizQueries';
import type {QuizStatus, QuizSummary} from '../../types';

import QuizHistorySkeleton from "./QuizHistorySkeleton.tsx";
import QuizHistoryItem from "./QuizHistoryItem.tsx";
import OutlineLinkButton from "../../common/button/OutlineLinkButton.tsx";
import StatusFilter from './StatusFilter';
import PaginationControls from "../../common/pagination/PaginationControls.tsx";
import { useAutoAnimate } from '@formkit/auto-animate/react';


const AnimatedQuizList = ({ quizzes, isFetching }: { quizzes: QuizSummary[], isFetching: boolean }) => {
    // The useAutoAnimate hook provides the ref for the parent div
    const [parent] = useAutoAnimate<HTMLDivElement>();

    return (
        <div
            ref={parent} // Attach the ref here to animate child elements
            className={`space-y-3 transition-opacity duration-300 ${isFetching ? 'opacity-60' : 'opacity-100'}`}
        >
            {quizzes.map(quiz => (
                <QuizHistoryItem key={quiz.id} quiz={quiz} />
            ))}
        </div>
    );
};

const QuizHistorySection = () => {
    // --- State & Data Fetching (unchanged) ---
    const [currentPage, setCurrentPage] = useState(0);
    const [statusFilter, setStatusFilter] = useState<QuizStatus | null>(null);
    const { data, isLoading, isError, isFetching } = useQuizHistory(currentPage, statusFilter);

    // --- Handlers (unchanged) ---
    const handleFilterChange = (status: QuizStatus | null) => {
        setStatusFilter(status);
        setCurrentPage(0);
    };

    // --- Content Rendering (updated empty/error states) ---
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => <QuizHistorySkeleton key={i} />)}
                </div>
            );
        }

        if (isError) {
            // Matched style from FollowedModulesSection
            return (
                <div className="text-center py-10 px-6 bg-red-50 text-red-700 rounded-lg">
                    <p>Quiz-Verlauf konnte nicht geladen werden.</p>
                </div>
            );
        }

        if (!data || data.content.length === 0) {
            // Matched style and structure from FollowedModulesSection's empty state
            return (
                <div className="text-center py-10 px-6 bg-blue-50 text-blue-700 rounded-lg">
                    <h3 className="font-semibold">Keine Aktivitäten gefunden</h3>
                    <p className="mt-2 text-sm">Versuchen Sie einen anderen Filter oder schließen Sie ein Quiz ab, um Ihren Verlauf hier zu sehen.</p>
                    <div className="mt-4">
                        <OutlineLinkButton link="/quizes" text="Zu den Quizzes"/>
                    </div>
                </div>
            );
        }

        return <AnimatedQuizList quizzes={data.content} isFetching={isFetching} />;

    };

    // --- Component JSX (updated section and header) ---
    return (
        // Changed section tag to match FollowedModulesSection layout
        <section className="py-8">
            {/* Changed header to include a subtitle for consistency */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Letzte Aktivitäten</h2>
                    <p className="text-gray-500">Einblick in Ihre letzten Quiz-Versuche.</p>
                </div>
                <OutlineLinkButton link="/quizzes" text="Mehr sehen"/>
            </div>

            {/* Filter controls remain */}
            <div className="mb-6">
                <StatusFilter currentFilter={statusFilter} onFilterChange={handleFilterChange} />
            </div>

            {/* Main content area */}
            {renderContent()}

            {/* Pagination remains, shown only when needed */}
            {data && data.totalPages > 1 && (
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={data.totalPages}
                    onPageChange={setCurrentPage}
                    isFetching={isFetching}
                />
            )}
        </section>
    );
};

export default QuizHistorySection;