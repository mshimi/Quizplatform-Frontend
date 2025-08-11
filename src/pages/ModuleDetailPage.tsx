
// src/pages/ModuleDetailPage.tsx

import { useParams } from 'react-router-dom'; // Assuming you use React Router
import { useModuleDetails, useToggleFollow } from '../hooks/useModuleQueries';

import ModuleCardSkeleton from '../components/module/ModuleCardSkeleton'; // Re-using for initial load
import QuestionCard from '../components/question/QuestionCard';
import PaginationControls from '../common/pagination/PaginationControls';
import StarIcon from '../common/icons/StarIcon';
import SpinnerIcon from '../common/icons/SpinnerIcon';
import {useState} from "react";
import ContributeQuestionButton from "../components/module/ContributeQuestionButton.tsx";
import {useStartQuiz} from "../hooks/useQuizMutations.ts";

const ModuleDetailPage = () => {
    const { moduleId } = useParams<{ moduleId: string }>();
    const [currentPage, setCurrentPage] = useState(0);

    const { data: module, isLoading, isError, isFetching } = useModuleDetails(moduleId, currentPage);
    const toggleFollowMutation = useToggleFollow();

    const startQuizMutation = useStartQuiz();

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
                <header className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-10">
                    {/* Main container: Stacks vertically on mobile, row on medium screens and up */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                        {/* Title and Description */}
                        <div className="flex-grow">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{module.title}</h1>
                            <p className="mt-2 md:mt-3 text-base md:text-lg text-gray-600 max-w-3xl">{module.description}</p>
                        </div>

                        {/* Follow Button: Full width on mobile, fixed width on medium screens up */}
                        <button
                            onClick={handleToggleFollow}
                            disabled={toggleFollowMutation.isPending}
                            className={`w-full md:w-32 flex-shrink-0 flex items-center justify-center gap-2 text-sm font-semibold py-2 px-5 rounded-full transition-all duration-300 h-10 ${
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

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        {/* Container für Statistiken und Aktionen */}
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

                            {/* Statistiken */}
                            <div className="flex justify-center  items-center gap-8 text-gray-500 flex-shrink-0">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-indigo-600">{module.numberOfQuestions}</div>
                                    <div className="text-sm">Fragen</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-indigo-600">{module.likeCount}</div>
                                    <div className="text-sm">Follower</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto lg:min-w-[550px]">
                                <ContributeQuestionButton moduleId={module.id} />


                                {/* Button: Alleine üben */}
                                <button
                                    onClick={() => startQuizMutation.mutate(module.id)} // 3. Add onClick handler
                                    disabled={startQuizMutation.isPending} // 4. Disable button while loading
                                    className="h-12 px-4 flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5 whitespace-nowrap"
                                >
                                    {startQuizMutation.isPending ? (
                                        <SpinnerIcon /> // 5. Show spinner when loading
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            <span>Alleine üben</span>
                                        </>
                                    )}
                                </button>

                                {/* Button: Gegen andere spielen */}
                                <button className="h-12 px-4 flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:-translate-y-0.5 whitespace-nowrap">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 01-9.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <span>Gegen andere spielen</span>
                                </button>
                            </div>

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
                                    onOpenChangeRequestModal={function (questionId: string): void {
                                      //  console.log(questionId);
                                        throw new Error('Function not implemented. ' + questionId);
                                    }}                                />
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
