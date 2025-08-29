import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useLobby, useCancelLobby, useLeaveLobby } from '../hooks/useLobbyQueries';
import { useAuth } from '../hooks/useAuth';
import SpinnerIcon from '../common/icons/SpinnerIcon';
import { useLobbyEvents } from '../hooks/useLobbyEvents';
//import { useAutoLeaveLobby } from '../hooks/useAutoLeaveLobby';
import LobbyHeader from "../components/lobby/LobbyHeader.tsx";
import LobbyParticipants from "../components/lobby/LobbyParticipants.tsx";
import LobbyActions from "../components/lobby/LobbyActions.tsx";

const QuizLobbyPage: React.FC = () => {
    const { lobbyId } = useParams<{ lobbyId: string }>();
    const navigate = useNavigate();
    const { user, isLoading: isUserLoading } = useAuth();

    const { data: lobby, isLoading: isLobbyLoading, isError } = useLobby(lobbyId);
    const cancelLobbyMutation = useCancelLobby();
    const leaveLobbyMutation = useLeaveLobby();

    // auto-leave when participant exits page
    // NOTE: we need markLeft BEFORE registering lobby events so we can pass it into the hook
   // const { markLeft } = useAutoLeaveLobby(lobby, user || undefined);

    // WS events (cache updates / cancel handling + navigate to live)
    useLobbyEvents(lobbyId, {
      //  onBeforeNavigateToLive: () => {
            // Suppress the auto-leave beacon when we intentionally switch to the live page
        //    markLeft();
        //},

    });

    useLobbyEvents(lobbyId, {
        onQuizStarted: (e) => {
          //  markLeft();                           // <-- prevent auto-leave beacon
            navigate(`/lobbies/${lobbyId}/live?sessionId=${e.sessionId}`, { replace: true });
        }
    });


    // guards
    if (!lobbyId) return <Navigate to="/quizzes" replace />;
    if (isLobbyLoading || isUserLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <SpinnerIcon />
            </div>
        );
    }
    if (isError || !lobby) return <Navigate to="/quizzes" replace />;
    if (lobby.status === 'CANCELLED') return <Navigate to="/quizzes" replace />;

    const isParticipant = lobby.participants.some(p => p.email === user?.email);
    if (!isParticipant) return <Navigate to="/quizzes" replace />;

    const isHost = user?.email === lobby.host.email;
    const canStart = isHost && lobby.participants.length >= 2;

    const handleCancelLobby = () => {
        if (!lobbyId) return;
        cancelLobbyMutation.mutate(lobbyId, {
            onSuccess: () => {
            //    markLeft(); // suppress auto-leave follow-ups
                navigate('/quizzes', { replace: true });
            },
        });
    };

    const handleLeaveLobby = () => {
        if (!lobbyId) return;
        leaveLobbyMutation.mutate(lobbyId, {
            onSuccess: () => {
           //     markLeft(); // suppress auto-leave follow-ups
                navigate('/quizzes', { replace: true });
            },
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <LobbyHeader lobby={lobby} />
                <LobbyParticipants lobby={lobby} />

                <LobbyActions
                    lobby={lobby}
                    isHost={!!isHost}
                    canStart={!!canStart}
                    onCancel={handleCancelLobby}
                    onLeave={handleLeaveLobby}
                    isCanceling={cancelLobbyMutation.isPending}
                    isLeaving={leaveLobbyMutation.isPending}
                />
            </div>
        </div>
    );
};

export default QuizLobbyPage;
