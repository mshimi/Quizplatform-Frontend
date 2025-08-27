import type { QuestionChangeRequest } from '../../types';

interface ChangeRequestCardSummaryProps {
    request: QuestionChangeRequest;
    isSelected: boolean;
    onClick: () => void;
}

const ChangeRequestCardSummary = ({ request, isSelected, onClick }: ChangeRequestCardSummaryProps) => {
    const getRequestTypeLabel = (type: string) => {
        switch (type) {
            case 'INCORRECT_QUESTION_TEXT': return 'Text Korrektur';
            case 'INCORRECT_ANSWER': return 'Antwort Korrektur';
            case 'SUGGEST_DELETION': return 'Löschvorschlag';
            case 'DUPLICATE_QUESTION': return 'Duplikat';
            default: return 'Unbekannt';
        }
    };

    return (
        <button
            onClick={onClick}
    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
        isSelected ? 'bg-indigo-50 border-indigo-400 shadow-md' : 'bg-white border-gray-200 hover:border-indigo-300'
    }`}
>
    <div className="flex justify-between items-center mb-1">
    <p className="text-sm font-bold text-gray-800 truncate">{request.question.questionText}</p>
        <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}>
    {request.status}
    </span>
    </div>
    <p className="text-xs text-gray-500">
        {getRequestTypeLabel(request.requestType)} von <span className="font-medium">{request.requesterUsername}</span>
        </p>
        </button>
);
};

export default ChangeRequestCardSummary;
