
// src/pages/ModuleDetailPage.tsx

import { useParams } from 'react-router-dom'; // Assuming you use React Router
import { useModuleDetails, useToggleFollow } from '../hooks/useModuleQueries';

import ModuleCardSkeleton from '../components/module/ModuleCardSkeleton'; // Re-using for initial load
import QuestionCard from '../components/question/QuestionCard';
import PaginationControls from '../common/pagination/PaginationControls';
import StarIcon from '../common/icons/StarIcon';
import SpinnerIcon from '../common/icons/SpinnerIcon';
import {useState} from "react";

const ModuleDetailPage = () => {
    const { moduleId } = useParams<{ moduleId: string }>();
    const [currentPage, setCurrentPage] = useState(0);

    const { data: module, isLoading, isError, isFetching } = useModuleDetails(moduleId, currentPage);
    const toggleFollowMutation = useToggleFollow();

    const handleToggleFollow = async () => {
        if (moduleId) {
            await toggleFollowMutation.mutateAsync(moduleId);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <ModuleCardSkeleton />
            </div>
        );
    }

    if (isError || !module) {
        return <div className="text-center py-10 px-6 bg-red-50 text-red-700 rounded-lg">Modul konnte nicht geladen werden.</div>;
    }

    const questions = module.questions.content;

    return (
        <div className=" min-h-screen">
            <div className="container mx-auto px-4 py-12">
                {/* Module Header */}
                <header className="bg-white p-8 rounded-2xl shadow-lg mb-10">
                    <div className="flex justify-between items-start gap-6">
                        <div className="flex-grow">
                            <h1 className="text-4xl font-bold text-gray-900">{module.title}</h1>
                            <p className="mt-3 text-lg text-gray-600 max-w-3xl">{module.description}</p>
                        </div>
                        <button
                            onClick={handleToggleFollow}
                            disabled={toggleFollowMutation.isPending}
                            className={`flex-shrink-0 flex items-center justify-center gap-2 text-sm font-semibold py-2 px-5 rounded-full transition-all duration-300 w-32 h-10 ${
                                toggleFollowMutation.isPending
                                    ? 'bg-teal-500 cursor-not-allowed'
                                    : module.isFollowed
                                        ? 'bg-teal-500 text-white shadow-md hover:bg-teal-600'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {toggleFollowMutation.isPending ? <SpinnerIcon /> : (
                                <>
                                    <StarIcon className="w-4 h-4" />
                                    {module.isFollowed ? 'Gefolgt' : 'Folgen'}
                                </>
                            )}
                        </button>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-8 text-gray-500">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600">{module.numberOfQuestions}</div>
                            <div className="text-sm">Fragen</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600">{module.likeCount}</div>
                            <div className="text-sm">Follower</div>
                        </div>
                    </div>
                </header>

                {/* Questions Section */}
                <main>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Fragen</h2>
                    <div className="relative">
                        <div className={`transition-opacity duration-300 space-y-6 ${isFetching ? 'opacity-50' : ''}`}>
                            {questions.map((q, index) => (
                                <QuestionCard
                                    key={q.id}
                                    question={q}
                                    // Calculate the question number based on the current page
                                    index={currentPage * module.questions.size + index}
                                />
                            ))}
                        </div>
                        {isFetching && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center">
                                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {/* Pagination for Questions */}
                    {module.questions.totalPages > 1 && (
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={module.questions.totalPages}
                            onPageChange={setCurrentPage}
                            isFetching={isFetching}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default ModuleDetailPage;
