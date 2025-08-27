import type { QuestionChangeRequest } from '../../types';
import { useVoteForChangeRequest } from '../../hooks/useQuestionChangeQueries';
import SpinnerIcon from '../../common/icons/SpinnerIcon';
//import QuestionCard from './QuestionCard'; // Reusing for duplicate view

// --- Icon Components ---
const ThumbsUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.734V11.534a2 2 0 012-2h2.764a2 2 0 001.789-2.894l-3.5-7A2 2 0 007.263 3h4.017c.163 0 .326.02.485.06L14 5.266V10z" /></svg>;
const ThumbsDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326-.02.485.06L17 5.266V10.466a2 2 0 01-2 2h-2.764a2 2 0 00-1.789 2.894l3.5 7A2 2 0 0012.738 21h-4.017a2 2 0 01-1.789-2.894L10 14z" /></svg>;


interface ChangeRequestCardDetailsProps {
    request: QuestionChangeRequest;
}

const ChangeRequestCardDetails = ({ request }: ChangeRequestCardDetailsProps) => {
    const voteMutation = useVoteForChangeRequest();

    const handleVote = (voteType: 'APPROVE' | 'REJECT') => {
        voteMutation.mutate({ changeRequestId: request.id, voteDto: { voteType } });
    };

    const hasVoted =
        request.currentUserHasVoted ||
        (voteMutation.isSuccess && voteMutation.variables?.changeRequestId === request.id);

    const renderRequestDetails = () => {
        switch (request.requestType) {
            case 'INCORRECT_QUESTION_TEXT':
                return (
                    <div className="space-y-3">
                    <h3 className="font-bold text-gray-700">Vorgeschlagene Textänderung:</h3>
            <div>
            <p className="text-xs font-semibold text-red-700">Bisheriger Text:</p>
            <p className="text-sm text-gray-600 p-3 bg-red-50 border border-red-200 rounded-md">{request.question.questionText}</p>
            </div>
            <div>
            <p className="text-xs font-semibold text-green-700">Neuer Vorschlag:</p>
            <p className="text-sm text-gray-800 p-3 bg-green-50 border border-green-200 rounded-md">{request.proposedText}</p>
                </div>
                </div>
            );
            case 'INCORRECT_ANSWER':
                return (
                    <>
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-700">Vorgeschlagene Antwortänderung:</h3>
                        <div>
                            <p className="text-xs font-semibold text-red-700">Bisherige Antworten:</p>
                            <div className="space-y-2 mt-1">
                                {request.question.answers.map(answer => (
                                    <p key={answer.id} className={`text-sm p-3 border rounded-md ${answer.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                        "{answer.text}" (Korrekt: {answer.isCorrect ? 'Ja' : 'Nein'})
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-green-700">Neuer Vorschlag:</p>
                            <div className="space-y-2 mt-1">
                                {request.proposedAnswers.map(answer => (
                                    <p key={answer.id} className={`text-sm p-3 border rounded-md ${answer.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                        "{answer.text}" (Korrekt: {answer.isCorrect ? 'Ja' : 'Nein'})
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                    </>
                );
    case 'DUPLICATE_QUESTION':
        return (
            <div className="space-y-4">
            <h3 className="font-bold text-gray-700">Gemeldetes Duplikat:</h3>
        <p className="text-sm text-gray-600">Diese Frage soll ein Duplikat der folgenden Frage sein:</p>
        {request.duplicateOfQuestion ? (
            <div className="transform scale-95 origin-top-left">
                <p className="text-sm text-gray-600 p-3 bg-red-50 border border-red-200 rounded-md">{request.duplicateOfQuestion.questionText}</p>
        </div>
        ) : (
            <p className="text-sm text-gray-500">Originalfrage konnte nicht geladen werden.</p>
        )}
        </div>
    );
    default:
        return null;
    }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-4">
        <div>
            <h2 className="text-xl font-bold text-gray-800">"{request.question.questionText}"</h2>
            <p className="text-sm text-gray-500 mt-1">
        Vorgeschlagen von <span className="font-medium">{request.requesterUsername}</span>
        </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <p className="text-sm font-bold text-gray-700">Begründung:</p>
    <p className="text-sm text-gray-600 italic">"{request.justification}"</p>
        </div>

    {renderRequestDetails()}

    <div className="pt-4 border-t border-gray-200">
    <p className="text-sm font-bold text-center text-gray-700 mb-3">Stimme über diesen Vorschlag ab:</p>
    <div className="flex items-center justify-center gap-4">
        {hasVoted ? (
                <p className="text-sm font-semibold text-gray-500">Danke für deine Stimme!</p>
) : (
        <>
            <button
                onClick={() => handleVote('APPROVE')}
    disabled={voteMutation.isPending}
    className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-green-600 hover:text-white hover:bg-green-600 border border-green-600 rounded-full px-4 py-2 transition-colors disabled:opacity-50"
        >
        {voteMutation.isPending && voteMutation.variables?.voteDto.voteType === 'APPROVE' ? <SpinnerIcon /> : <><ThumbsUpIcon /> <span>Zustimmen ({request.positiveVotes})</span></>}
        </button>
        <button
    onClick={() => handleVote('REJECT')}
    disabled={voteMutation.isPending}
    className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-full px-4 py-2 transition-colors disabled:opacity-50"
        >
        {voteMutation.isPending && voteMutation.variables?.voteDto.voteType === 'REJECT' ? <SpinnerIcon /> : <><ThumbsDownIcon /> <span>Ablehnen ({request.negativeVotes})</span></>}
        </button>
        </>
)}
    </div>
    </div>
    </div>
);
};

export default ChangeRequestCardDetails;
