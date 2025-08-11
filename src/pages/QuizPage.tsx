import { useParams } from 'react-router-dom';
import { useQuizDetails } from '../hooks/useQuizQueries';
import SpinnerIcon from '../common/icons/SpinnerIcon';
import QuizPlayer from '../components/quiz/QuizPlayer';
import QuizResult from '../components/quiz/QuizResult';
import {useQueryClient} from "@tanstack/react-query";
import type { QuizResult as QuizResultType } from '../types';
import {useEffect} from "react";

const QuizPage = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const queryClient = useQueryClient();
    const { data: quizData, isLoading, isError } = useQuizDetails(quizId);



    // The useEffect to invalidate on mount is still a good idea
    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['quizDetails', quizId] });
    }, [quizId, queryClient]);
    const handleQuizFinished = () => {
        queryClient.invalidateQueries({ queryKey: ['quizDetails', quizId] });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <SpinnerIcon />
                    <p className="mt-2 text-lg text-gray-600">Lade Quiz...</p>
                </div>
            </div>
        );
    }

    if (isError || !quizData) {
        return (
            <div className="text-center py-10 px-6 bg-red-50 text-red-700 rounded-lg">
                Quiz konnte nicht geladen werden.
            </div>
        );
    }

    // This is the core logic: render a different component based on the quiz status
    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            {quizData.status === 'IN_PROGRESS' && (
                <QuizPlayer quizData={quizData}  />
            )}
            {quizData.status === 'COMPLETED' &&(
                <QuizResult quizData={quizData as QuizResultType  } />
            )}
        </div>
    );
};

export default QuizPage;