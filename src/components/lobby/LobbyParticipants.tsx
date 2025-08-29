import type { QuizLobby } from '../../types';

export default function LobbyParticipants({ lobby }: { lobby: QuizLobby }) {
    return (
        <div className="my-8">
            <div className="text-lg font-bold text-slate-700 mb-4">
                Teilnehmer ({lobby.participants.length})
            </div>
            <div className="flex flex-wrap justify-center gap-4">
                {lobby.participants.map(p => (
                    <div
                        key={p.email}
                        className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-semibold"
                    >
                        {p.firstName} {p.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
