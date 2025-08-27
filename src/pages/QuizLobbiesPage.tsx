import {useEffect} from 'react';
import { useWaitingLobbies, useJoinLobby } from '../hooks/useLobbyQueries';
import { useAuth } from '../hooks/useAuth';
import type { QuizLobby } from '../types';
import SpinnerIcon from '../common/icons/SpinnerIcon';
import { useWebSocket } from '../hooks/useWebSocket'; // Import WebSocket hook
import { useQueryClient } from '@tanstack/react-query';
import {Link} from "react-router-dom";

const QuizLobbyCard = ({ lobby, onJoin, isJoining }: { lobby: QuizLobby; onJoin: (lobbyId: string) => void; isJoining: boolean }) => {
    const { user } = useAuth();
    const isHost = user?.email === lobby.host.email;
    const canJoin = !lobby.participants.some(p => p.email === user?.email);



    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
                <h3 className="font-bold text-lg text-gray-800">{lobby.module.title}</h3>
                <p className="text-sm text-gray-500">Host: {lobby.host.firstName} {lobby.host.name}</p>
                <p className="text-sm text-gray-500">Teilnehmer: {lobby.participants.length}</p>
            </div>
            <div>
                {isHost ? (
                    <span className="text-sm font-semibold text-indigo-600">Du bist der Host</span>
                ) : canJoin ? (
                    <button
                        onClick={() => onJoin(lobby.id)}
                        disabled={isJoining}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                        {isJoining ? <SpinnerIcon /> : 'Beitreten'}
                    </button>
                ) : (
                    <span className="text-sm font-semibold text-green-600">Beigetreten</span>
                )}
            </div>
        </div>
    );
};


const QuizLobbiesPage = () => {
    const { data: lobbies, isLoading, isError } = useWaitingLobbies();
    const joinLobbyMutation = useJoinLobby();
    const { notifications } = useWebSocket(); // Get notifications from WebSocket
    const queryClient = useQueryClient();


    useEffect(() => {
        // When a lobby update notification is received, invalidate the query to refetch
        if (notifications.some(n => n.type === 'LOBBY_UPDATE')) {
            queryClient.invalidateQueries({ queryKey: ['lobbies', 'waiting'] });
        }
    }, [notifications, queryClient]);


    const handleJoinLobby = (lobbyId: string) => {
        joinLobbyMutation.mutate(lobbyId);
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center py-20"><SpinnerIcon /></div>;
        }
        if (isError) {
            return <div className="text-center p-4 bg-red-50 text-red-700 rounded-lg">Lobbies konnten nicht geladen werden.</div>;
        }
        if (!lobbies || lobbies.length === 0) {
            return <div className="text-center p-4 bg-blue-50 text-blue-700 rounded-lg">Derzeit sind keine offenen Lobbies verfügbar. Erstelle eine neue!</div>;
        }
        return (
            <div className="space-y-4">
                {lobbies.map(lobby => (
                    <QuizLobbyCard
                        key={lobby.id}
                        lobby={lobby}
                        onJoin={handleJoinLobby}
                        isJoining={joinLobbyMutation.isPending && joinLobbyMutation.variables === lobby.id}
                    />
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800">Offene Lobbies</h1>
                    {/* --- ADD THIS BUTTON --- */}
                    <Link
                        to="/lobbies/create"
                        className="px-5 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                    >
                        Lobby erstellen
                    </Link>
                </div>
                {renderContent()}
            </div>


        </>
    );
};

export default QuizLobbiesPage;