import {useState, useMemo} from 'react';
import type { QuizDetail } from '../../types';
import {useFinishQuiz, useSubmitAnswer} from '../../hooks/useQuizMutations';
import { useAutoAnimate } from '@formkit/auto-animate/react';


// --- Helper Types ---
interface QuizPlayerProps {
    quizData: QuizDetail;

}

// --- Icon Components ---
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const FlagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 16.5 12l-.75-5.25m-1.5 5.25L13.5 6l-.75 5.25m-1.5 5.25L10.5 6l-.75 5.25m-1.5 5.25L7.5 6l-.75 5.25M6 6.75h12l-1.5 5.25L12 18l-4.5-6L6 6.75Z" /></svg>;


const QuizPlayer = ({ quizData }: QuizPlayerProps) => {

    const finishQuizMutation = useFinishQuiz();

    const handleFinishQuiz = () => {
        if (answeredQuestionsCount < quizData.questions.length) {
            if (!window.confirm("Sie haben noch nicht alle Fragen beantwortet. Möchten Sie das Quiz wirklich abgeben?")) {
                return;
            }
        }
        // 4. Simply call the mutation. It will handle the refetch automatically.
        finishQuizMutation.mutate(quizData.id);
    };

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<string, string>>(() => new Map(Object.entries(quizData.selectedAnswers || {})));
    const submitAnswerMutation = useSubmitAnswer();
    const [animationParent] = useAutoAnimate<HTMLDivElement>(); // 2. Initialize the animation hook

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const selectedAnswerId = answers.get(currentQuestion.id) || null;
    const answeredQuestionsCount = useMemo(() => answers.size, [answers]);

    const handleAnswerSelect = (answerId: string) => {
        const newAnswers = new Map(answers);
        newAnswers.set(currentQuestion.id, answerId);
        setAnswers(newAnswers);
        submitAnswerMutation.mutate({ quizId: quizData.id, questionId: currentQuestion.id, selectedAnswerId: answerId });
    };

    const goToQuestion = (index: number) => {
        if (index >= 0 && index < quizData.questions.length) {
            setCurrentQuestionIndex(index);
        }
    };



    // --- JSX with new design and animations ---
    return (
        <div className="bg-slate-50 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] border border-slate-200">
            {/* --- Header --- */}
            <div className="flex justify-between items-center p-4 border-b border-slate-200 flex-shrink-0">
                <div>
                    <h2 className="font-bold text-lg text-slate-800">{quizData.module.title}</h2>
                    <p className="text-sm text-slate-500">Frage {currentQuestionIndex + 1} von {quizData.questions.length}</p>
                </div>
                <button className="text-slate-400 hover:text-red-500 transition-colors" title="Quiz abbrechen">
                    <CloseIcon />
                </button>
            </div>

            {/* --- Stepper --- */}
            <div className="p-4 flex justify-center border-b border-slate-200 flex-shrink-0 overflow-x-auto">
                <div className="flex items-center gap-2">
                    {quizData.questions.map((question, index) => {
                        const isAnswered = answers.has(question.id);
                        const isCurrent = index === currentQuestionIndex;
                        return (
                            <button
                                key={question.id}
                                onClick={() => goToQuestion(index)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 transform
                                    ${isCurrent
                                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 scale-110'
                                    : isAnswered
                                        ? 'bg-teal-500 text-white hover:bg-teal-600'
                                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                }`}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* --- Main Content (Scrollable) --- */}
            <div className="p-8 flex-grow overflow-y-auto">
                <div key={currentQuestion.id} className="animate-fade-in">
                    <h1 className="text-2xl md:text-3xl text-slate-900 font-semibold mb-8">
                        {currentQuestion.questionText}
                    </h1>
                </div>
                <div ref={animationParent} className="space-y-4"> {/* 3. Attach animation ref */}
                    {currentQuestion.answers.map((answer) => (
                        <button
                            key={answer.id}
                            onClick={() => handleAnswerSelect(answer.id)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 text-lg flex items-center gap-4 transform hover:-translate-y-1 hover:shadow-lg
                                ${selectedAnswerId === answer.id
                                ? 'bg-indigo-100 border-indigo-500 ring-4 ring-indigo-200'
                                : 'bg-white border-slate-300 hover:border-indigo-400'
                            }`}
                        >
                            <span className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-colors duration-200 ${selectedAnswerId === answer.id ? 'bg-indigo-600 border-indigo-600' : 'border-slate-400'}`}></span>
                            <span className="text-slate-800">{answer.text}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Footer / Navigation --- */}
            <div className="flex justify-between items-center p-4 bg-slate-100 rounded-b-2xl border-t border-slate-200 flex-shrink-0">
                <button
                    onClick={handleFinishQuiz}
                    disabled={finishQuizMutation.isPending}

                    className="flex items-center gap-2 px-6 py-2.5 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition-all transform hover:scale-105"
                >
                    <FlagIcon />
                    <span>Quiz abgeben</span>
                </button>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => goToQuestion(currentQuestionIndex - 1)}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center gap-2 px-4 py-2.5 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-200 disabled:opacity-50 transition"
                    >
                        <ChevronLeftIcon />
                        Vorherige
                    </button>
                    <button
                        onClick={() => goToQuestion(currentQuestionIndex + 1)}
                        disabled={currentQuestionIndex === quizData.questions.length - 1}
                        className="flex items-center gap-2 px-4 py-2.5 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-200 disabled:opacity-50 transition"
                    >
                        Nächste
                        <ChevronRightIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizPlayer;