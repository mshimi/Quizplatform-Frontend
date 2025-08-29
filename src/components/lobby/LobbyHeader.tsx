import type { QuizLobby } from '../../types';

export default function LobbyHeader({ lobby }: { lobby: QuizLobby }) {
    return (
        <>
            <h1 className="text-2xl font-bold text-slate-800">Warte auf Mitspieler...</h1>
            <p className="mt-2 text-slate-500">
                Das Quiz für das Modul{' '}
                <span className="font-semibold text-indigo-600">{lobby.module.title}</span>{' '}
                startet, sobald du es beginnst.
            </p>
        </>
    );
}
