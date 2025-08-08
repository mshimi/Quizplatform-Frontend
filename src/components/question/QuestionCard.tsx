import type { ChoiceQuestion } from '../../types';

// --- Icon Components ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const FlagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth={2} /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;


interface QuestionCardProps {
    question: ChoiceQuestion;
    index: number;
    onOpenChangeRequestModal: (questionId: string) => void;
}

const QuestionCard = ({ question, index, onOpenChangeRequestModal }: QuestionCardProps) => {
    const { changeRequestCounts } = question;
    const hasChangeRequests = changeRequestCounts && changeRequestCounts.total > 0;

    const getQuestionTypeLabel = () => {
        switch (question.questionType) {
            case 'SINGLE': return 'Single Choice';
            case 'MULTI': return 'Multiple Choice';
            default: return 'Frage';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
                {/* Question Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm font-bold text-indigo-600 mb-1"> Frage {index + 1} - {getQuestionTypeLabel()}</p>
                        <p className="text-lg text-gray-800 font-semibold">{question.questionText}</p>
                    </div>
                    {hasChangeRequests && (
                        <button
                            onClick={() => onOpenChangeRequestModal(question.id)}
                            className="flex items-center gap-2 text-sm font-medium text-yellow-600 bg-yellow-100 hover:bg-blue-200 rounded-full px-3 py-1 transition-colors"
                            title={`${changeRequestCounts.total} Änderungsvorschläge`}
                        >
                            <BellIcon  />
                            <span>{changeRequestCounts.total}</span>
                        </button>
                    )}
                    {
                        !hasChangeRequests && (
                            <p>
                                no change request
                            </p>
                        )
                    }
                </div>

                {/* Answers List */}
                <div className="space-y-3 mb-6">
                    {question.answers.map(answer => (
                        <div
                            key={answer.id}
                            className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                                answer.isCorrect
                                    ? 'bg-green-50 border-green-500 text-green-800'
                                    : 'bg-white border-gray-300 text-gray-700'
                            }`}
                        >
                            {answer.isCorrect ? <CheckCircleIcon  /> : <CircleIcon  />}
                            <span className="font-medium">{answer.text}</span>
                        </div>
                    ))}
                </div>

                {/* Action Buttons Footer */}
                <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-4">
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                        <EditIcon />
                        <span>Änderung vorschlagen</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
                        <FlagIcon />
                        <span>Problem melden</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;