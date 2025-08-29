// src/pages/LiveSessionPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Navigate } from 'react-router-dom';
import { useLiveEvents } from '../hooks/useLiveEvents';
import { useLiveSessionState, useSubmitLiveAnswer } from '../hooks/useLiveQuiz';
import SpinnerIcon from '../common/icons/SpinnerIcon';

export default function LiveSessionPage() {
    const { lobbyId } = useParams<{ lobbyId: string }>();
    const [sp] = useSearchParams();
    const sessionId = sp.get('sessionId') ?? undefined;

    const { data: state, isLoading, isError, refetch } = useLiveSessionState(sessionId!);
    const submit = useSubmitLiveAnswer(sessionId!);

    // WS → hält den Cache fresh
    useLiveEvents(lobbyId, sessionId, {
        onAborted: () => {
            // hier könntest du z.B. zu /quizzes navigieren
        }
    });

    // Countdown clientseitig anhand startAt/endsAt (Server ist Autorität)
    const [now, setNow] = useState<number>(Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 200);
        return () => clearInterval(t);
    }, []);

    const countdown = useMemo(() => {
        if (state?.status === 'COUNTDOWN' && state.startAt) {
            const diff = new Date(state.startAt).getTime() - now;
            return Math.max(0, Math.ceil(diff / 1000));
        }
        return 0;
    }, [state, now]);

    const secondsLeft = useMemo(() => {
        if (state?.status === 'RUNNING' && state.endsAt) {
            const diff = new Date(state.endsAt).getTime() - now;
            return Math.max(0, Math.ceil(diff / 1000));
        }
        return 0;
    }, [state, now]);

    if (!lobbyId || !sessionId) return <Navigate to="/quizzes" replace />;

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><SpinnerIcon /></div>;
    }
    if (isError || !state) {
        return <Navigate to="/quizzes" replace />;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow mb-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-800">Live-Quiz</h1>
                    <div className="text-sm text-slate-500">
                        {state.status === 'COUNTDOWN' && <>Start in <b>{countdown}</b>s</>}
                        {state.status === 'RUNNING' && <>Zeit: <b>{secondsLeft}</b>s</>}
                        {state.status === 'FINISHED' && <b>Beendet</b>}
                    </div>
                </div>
                <div className="text-slate-500">
                    Frage {Math.max(1, state.currentIndex + 1)} / {state.totalQuestions}
                    &nbsp;•&nbsp; Punkte: <b>{state.you.score}</b>
                </div>
            </div>

            {/* Frage */}
            {state.status === 'RUNNING' && state.question && (
                <div className="bg-white p-6 rounded-2xl shadow">
                    <div className="text-xl font-semibold mb-4">{state.question.text}</div>
                    <div className="grid gap-3">
                        {state.question.answers.map(a => (
                            <button
                                key={a.id}
                                disabled={state.you.answered || submit.isPending}
                                onClick={() => submit.mutate({ questionIndex: state.currentIndex, answerId: a.id })}
                                className={`w-full text-left px-4 py-3 rounded-md border hover:bg-slate-50 disabled:opacity-60`}
                            >
                                {a.text}
                            </button>
                        ))}
                    </div>

                    {state.you.answered && (
                        <div className="mt-4 text-sm text-slate-500">
                            Antwort gespeichert – warte auf Auswertung…
                        </div>
                    )}
                </div>
            )}

            {/* Countdown Card */}
            {state.status === 'COUNTDOWN' && (
                <div className="bg-white p-8 rounded-2xl shadow text-center text-5xl font-bold">
                    {countdown}
                </div>
            )}

            {/* Ende */}
            {state.status === 'FINISHED' && (
                <div className="bg-white p-8 rounded-2xl shadow text-center">
                    <div className="text-2xl font-bold mb-2">Quiz beendet</div>
                    <div className="text-slate-600">Dein Score: <b>{state.you.score}</b></div>
                    <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">
                        Neu laden
                    </button>
                </div>
            )}
        </div>
    );
}
