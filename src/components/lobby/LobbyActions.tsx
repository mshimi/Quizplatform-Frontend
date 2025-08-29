import type { QuizLobby } from '../../types';
import SpinnerIcon from '../../common/icons/SpinnerIcon';
import {useStartLiveSession} from "../../hooks/useLiveQuiz.ts";
import {useNavigate} from "react-router-dom";

type Props = {
    lobby: QuizLobby;
    isHost: boolean;
    canStart: boolean;
    onCancel: () => void;
    onLeave: () => void;
    isCanceling: boolean;
    isLeaving: boolean;
};

export default function LobbyActions({
        lobby,
                                         isHost,
                                         canStart,
                                         onCancel,
                                         onLeave,
                                         isCanceling,
                                         isLeaving,
                                     }: Props) {


    const start = useStartLiveSession();
  const navigate =  useNavigate();

    const handleStartQuiz = () => {
      const  lobbyId = lobby.id;
        if (!lobbyId) return;
        start.mutate({ lobbyId }, {
            onSuccess: (res) => {
                sessionStorage.setItem('skipAutoLeave', '1');
                navigate(`/lobbies/${lobbyId}/live?sessionId=${res.sessionId}`, { replace: true });
            }
        });
    };


    return (
        <div className="flex justify-center gap-4 mt-10">
            {isHost ? (
                <button
                    onClick={onCancel}
                    disabled={isCanceling}
                    className="px-6 py-3 font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 disabled:bg-red-400"
                >
                    {isCanceling ? <SpinnerIcon /> : 'Lobby abbrechen'}
                </button>
            ) : (
                <button
                    onClick={onLeave}
                    disabled={isLeaving}
                    className="px-6 py-3 font-semibold text-white bg-gray-600 rounded-md shadow-sm hover:bg-gray-700 disabled:bg-gray-400"
                >
                    {isLeaving ? <SpinnerIcon /> : 'Lobby verlassen'}
                </button>
            )}

            {isHost && (
                <button
                    onClick={handleStartQuiz}
                    disabled={!canStart || start.isPending}
                    className="px-6 py-3 font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 disabled:bg-gray-400"
                >
                    {start.isPending ? <SpinnerIcon /> : 'Quiz starten'}

                </button>
            )}
        </div>
    );
}
