import { Link } from 'react-router-dom';
import type { QuizResult as QuizResultType } from '../../types';
import QuestionResultCard from "../question/QuestionResultCard.tsx";

interface QuizResultProps {
    quizData: QuizResultType;
}


const QuizResult = ({ quizData }: QuizResultProps) => {
    const scoreColor = quizData.scorePercentage >= 50 ? 'text-teal-500' : 'text-red-500';

    return (
        <div className="space-y-8">
            {/* --- Results Summary Card --- */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <h1 className="text-2xl font-bold text-slate-800">Quiz Abgeschlossen!</h1>
                <p className="mt-2 text-slate-500">Hier ist Ihre Auswertung für das Modul:</p>
                <p className="font-semibold text-indigo-600">{quizData.module.title}</p>

                <div className="my-8">
                    <div className={`text-4xl font-bold ${scoreColor}`}>{quizData.scorePercentage}%</div>
                    <div className="w-full bg-slate-200 rounded-full h-4 mt-2">
                        <div
                            className={`h-4 rounded-full ${quizData.scorePercentage >= 50 ? 'bg-teal-500' : 'bg-red-500'}`}
                            style={{ width: `${quizData.scorePercentage}%` }}
                        ></div>
                    </div>
                    <p className="mt-3 text-lg text-slate-600">
                        Sie haben <span className="font-bold">{quizData.numberOfCorrectAnswers}</span> von <span className="font-bold">{quizData.numberOfQuestions}</span> Fragen richtig beantwortet.
                    </p>
                </div>

                <div className="flex justify-center gap-4">
                    <Link
                        to="/"
                        className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700"
                    >
                        Zurück zum Dashboard
                    </Link>
                    {/* Optional: Add a "Try Again" button */}
                </div>
            </div>

            {/* --- Detailed Question Breakdown --- */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Detailauswertung</h2>
                <div className="space-y-6">
                    {quizData.questionResults.map((question, index) => (
                        <QuestionResultCard key={question.id} question={question} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuizResult;