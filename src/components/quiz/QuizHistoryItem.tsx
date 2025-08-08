import { Link } from 'react-router-dom';
import type { QuizSummary } from '../../types';

// --- Icon Components (assuming they are in a common folder) ---
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PlayCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


const QuizHistoryItem = ({ quiz }: { quiz: QuizSummary }) => {
    // This component now handles both 'COMPLETED' and 'IN_PROGRESS' states.

    const isCompleted = quiz.status === 'COMPLETED';
    const scorePercentage = isCompleted ? Math.round((quiz.numberOfCorrectAnswers / quiz.numberOfQuestions) * 100) : 0;
    const isPass = isCompleted && scorePercentage >= 50;

    const formattedDate = new Date(quiz.completedAt).toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const getStatusIcon = () => {
        if (!isCompleted) {
            return <PlayCircleIcon />;
        }
        return isPass ? <CheckCircleIcon /> : <XCircleIcon />;
    };

    return (
        <Link
            to={`/quizzes/${quiz.id}`}
            className="block bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-200"
            title={isCompleted ? "View quiz results" : "Continue quiz"}
        >
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                    {getStatusIcon()}
                    <div>
                        <p className="font-bold text-gray-800">{quiz.module.title}</p>
                        <p className="text-sm text-gray-500">
                            {isCompleted ? `Abgeschlossen am ${formattedDate} Uhr` : 'In Bearbeitung'}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    {isCompleted ? (
                        <>
                            <p className={`font-bold text-lg ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                                {quiz.numberOfCorrectAnswers}/{quiz.numberOfQuestions}
                            </p>
                            <p className="text-sm text-gray-500">{scorePercentage}%</p>
                        </>
                    ) : (
                        <span className="text-sm font-semibold text-blue-600">Fortsetzen &rarr;</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default QuizHistoryItem;
