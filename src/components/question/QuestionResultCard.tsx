import type { AnswerResult, QuestionResult } from '../../types';

// --- Icon Components ---
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

const QuestionResultCard = ({ question, index }: { question: QuestionResult; index: number }) => {

    const getAnswerStyling = (answer: AnswerResult) => {
        // --- FIX ---
        // This logic now correctly uses the 'isCorrect' and 'isSelected' properties.

        // Correctly selected by user (Green Highlight)
        if (answer.correct && answer.selected) {
            return 'bg-teal-100 border-teal-500 ring-2 ring-teal-300';
        }
        // Incorrectly selected by user (Red Highlight)
        if (!answer.correct && answer.selected) {
            return 'bg-red-100 border-red-500 ring-2 ring-red-300';
        }
        // The correct answer, which the user did NOT select (Green Border)
        if (answer.correct && !answer.selected) {
            return 'bg-white border-teal-500';
        }
        // A regular incorrect answer the user did not select (Faded)
        return 'bg-white border-slate-300 opacity-60';
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <p className="text-sm font-bold text-indigo-600">Frage {index + 1}</p>
                    <div className={`flex items-center gap-2 text-sm font-bold text-white px-3 py-1 rounded-full ${question.wasAnsweredCorrectly ? 'bg-teal-500' : 'bg-red-500'}`}>
                        {question.wasAnsweredCorrectly ? <CheckIcon /> : <XIcon />}
                        <span>{question.wasAnsweredCorrectly ? 'Korrekt' : 'Falsch'}</span>
                    </div>
                </div>
                <p className="text-lg text-slate-800 font-semibold mb-4">{question.questionText}</p>
                <div className="space-y-3">
                    {question.answers.map(answer => (
                        <div key={answer.id} className={`p-4 rounded-lg border-2 transition-all text-base flex items-center gap-4 ${getAnswerStyling(answer)}`}>
                             <span className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                                ${answer.selected ? 'border-slate-800' : 'border-slate-400'}
                                ${answer.correct && answer.selected ? 'bg-teal-500' : ''}
                                ${!answer.correct && answer.selected ? 'bg-red-500' : ''}
                            `}>
                                {answer.correct && <CheckIcon />}
                            </span>
                            <span className="text-slate-800">{answer.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuestionResultCard;