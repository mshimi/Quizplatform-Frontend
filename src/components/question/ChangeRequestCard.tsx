import type { QuestionChangeRequest } from '../../types';
import { useVoteForChangeRequest } from '../../hooks/useQuestionChangeQueries';
import SpinnerIcon from '../../common/icons/SpinnerIcon';

// --- Icon Components ---
const ThumbsUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.734V11.534a2 2 0 012-2h2.764a2 2 0 001.789-2.894l-3.5-7A2 2 0 007.263 3h4.017c.163 0 .326-.02.485.06L14 5.266V10z" /></svg>;
const ThumbsDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326-.02.485.06L17 5.266V10.466a2 2 0 01-2 2h-2.764a2 2 0 00-1.789 2.894l3.5 7A2 2 0 0012.738 21h-4.017a2 2 0 01-1.789-2.894L10 14z" /></svg>;


interface ChangeRequestCardProps {
    request: QuestionChangeRequest;
}

const ChangeRequestCard = ({ request }: ChangeRequestCardProps) => {
    const voteMutation = useVoteForChangeRequest();

    const handleVote = (voteType: 'APPROVE' | 'REJECT') => {
        voteMutation.mutate({ changeRequestId: request.id, voteDto: { voteType } });
    };

    const getRequestTypeLabel = (type: string) => {
        switch (type) {
            case 'INCORRECT_QUESTION_TEXT': return 'Text Korrektur';
            case 'INCORRECT_ANSWER': return 'Antwort Korrektur';
            case 'SUGGEST_DELETION': return 'Löschvorschlag';
            case 'DUPLICATE_QUESTION': return 'Duplikat';
            default: return 'Unbekannt';
        }
    };

    const hasVoted = request.currentUserHasVoted || voteMutation.isSuccess;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
            <span className="text-xs font-bold uppercase text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
              {getRequestTypeLabel(request.requestType)}
            </span>
                        <p className="text-lg text-gray-800 font-semibold mt-2">"{request.question.questionText}"</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Vorgeschlagen von <span className="font-medium">{request.requesterUsername}</span> am {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}>
            {request.status}
          </span>
                </div>

                {/* --- NEW: Conditional rendering for text changes --- */}
                {request.requestType === 'INCORRECT_QUESTION_TEXT' && (
                    <div className="mb-4 space-y-3">
                        <div>
                            <p className="text-sm font-bold text-gray-700">Bisheriger Frage:</p>
                            <p className="text-sm text-gray-600 p-3 bg-red-50 border border-red-200 rounded-md">
                                {request.question.questionText}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-700">Neuer Vorschlag:</p>
                            <p className="text-sm text-gray-800 p-3 bg-green-50 border border-green-200 rounded-md">
                                {request.proposedText}
                            </p>
                        </div>
                    </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm font-bold text-gray-700">Begründung:</p>
                    <p className="text-sm text-gray-600 italic">"{request.justification}"</p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200 flex items-center justify-between">
                    {/* Vote Counts Display */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                            <ThumbsUpIcon />
                            <span>{request.positiveVotes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-600 font-semibold">
                            <ThumbsDownIcon />
                            <span>{request.negativeVotes}</span>
                        </div>
                    </div>

                    {/* Voting Actions */}
                    <div className="flex items-center justify-end gap-4">
                        {hasVoted ? (
                            <p className="text-sm font-semibold text-gray-500">Danke für deine Stimme!</p>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleVote('APPROVE')}
                                    disabled={voteMutation.isPending}
                                    className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-white hover:bg-green-600 border border-green-600 rounded-full px-4 py-2 transition-colors disabled:opacity-50"
                                >
                                    {voteMutation.isPending && voteMutation.variables?.voteDto.voteType === 'APPROVE' ? <SpinnerIcon /> : <><ThumbsUpIcon /> <span>Zustimmen</span></>}
                                </button>
                                <button
                                    onClick={() => handleVote('REJECT')}
                                    disabled={voteMutation.isPending}
                                    className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-full px-4 py-2 transition-colors disabled:opacity-50"
                                >
                                    {voteMutation.isPending && voteMutation.variables?.voteDto.voteType === 'REJECT' ? <SpinnerIcon /> : <><ThumbsDownIcon /> <span>Ablehnen</span></>}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeRequestCard;
