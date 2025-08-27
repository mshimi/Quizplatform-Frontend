import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWaitingLobbies, useCancelLobby } from '../hooks/useLobbyQueries';
import { useAuth } from '../hooks/useAuth';
import type { QuizLobby } from '../types';
import SpinnerIcon from '../common/icons/SpinnerIcon';
import { useWebSocket } from '../hooks/useWebSocket';
import { useQueryClient } from '@tanstack/react-query';

const QuizLobbyPage = () => {
    const { lobbyId } = useParams<{ lobbyId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { notifications } = useWebSocket();

    // Fetch all waiting lobbies to find the current one by ID
    const { data: lobbies, isLoading, isError } = useWaitingLobbies();
    const [lobby, setLobby] = useState<QuizLobby | null>(null);

    const cancelLobbyMutation = useCancelLobby();

    // Effect to find the current lobby from the fetched list
    useEffect(() => {
        if (lobbies) {
            const currentLobby = lobbies.find(l => l.id === lobbyId);
            if (currentLobby) {
                setLobby(currentLobby);
                // If the current user is not the host, redirect them away
                if (currentLobby.host.email !== user?.email) {
                    navigate('/quizzes');
                }
            } else {
                // If the lobby is not in the list (e.g., cancelled, started), redirect
                navigate('/quizzes');
            }
        }
    }, [lobbies, lobbyId, user, navigate]);

    // Effect to listen for real-time updates
    useEffect(() => {
        if (notifications.some(n => n.type === 'LOBBY_UPDATE')) {
            queryClient.invalidateQueries({ queryKey: ['lobbies', 'waiting'] });
        }
    }, [notifications, queryClient]);

    const handleCancelLobby = () => {
        if (lobbyId) {
            cancelLobbyMutation.mutate(lobbyId, {
                onSuccess: () => navigate('/quizzes'), // Go back to lobby list on success
            });
        }
    };

    if (isLoading || !lobby) {
        return <div className="flex justify-center items-center h-screen"><SpinnerIcon /></div>;
    }

    if (isError) {
        return <div className="text-center p-4 bg-red-50 text-red-700 rounded-lg">Lobby konnte nicht geladen werden.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <h1 className="text-2xl font-bold text-slate-800">Warte auf Mitspieler...</h1>
                <p className="mt-2 text-slate-500">Das Quiz für das Modul <span className="font-semibold text-indigo-600">{lobby.module.title}</span> startet, sobald du es beginnst.</p>

                <div className="my-8">
                    <div className="text-lg font-bold text-slate-700 mb-4">Teilnehmer ({lobby.participants.length})</div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {lobby.participants.map(p => (
                            <div key={p.email} className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-semibold">
                                {p.firstName} {p.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-10">
                    <button
                        onClick={handleCancelLobby}
                        disabled={cancelLobbyMutation.isPending}
                        className="px-6 py-3 font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700"
                    >
                        {cancelLobbyMutation.isPending ? <SpinnerIcon/> : 'Lobby abbrechen'}
                    </button>
                    <button
                        // disabled={lobby.participants.length < 2} // Optional: Enable when at least 2 players are in
                        className="px-6 py-3 font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 disabled:bg-gray-400"
                    >
                        Quiz starten
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizLobbyPage;